import cds from '@sap/cds';

const keyOk = req => {
  const expected = process.env.FLOW_KEY;
  return Boolean(expected) && req.http?.req?.headers?.['x-flow-key'] === expected;
};

export default class FlowService extends cds.ApplicationService {
  init() {
    const db = cds.entities('travelorderai');

    // Creates a new booking request (status New). The Intake AI extraction then reads the message,
    // exactly as for a request that arrived by email.
    this.on('receiveRequest', async req => {
      if (!keyOk(req)) return req.reject(401, 'Missing or wrong flow key.');
      const { subject, message, senderEmail } = req.data;
      if (!message?.trim()) return req.reject(400, 'message is required.');

      const rows = await SELECT.from(db.BookingRequests).columns('requestNumber');
      const last = Math.max(10000, ...rows.map(r => Number(/^BRQ(\d+)$/.exec(r.requestNumber ?? '')?.[1] ?? 0)));
      const requestNumber = `BRQ${last + 1}`;
      const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
      const ID = cds.utils.uuid();

      await INSERT.into(db.BookingRequests).entries({
        ID,
        requestNumber,
        receivedAt: now,
        senderEmail: senderEmail || 'customer@example.com',
        subject: subject || 'Request from TravelOrder Assistant',
        originalMessage: message,
        // Master data in (mock) S/4HANA for requests from the assistant.
        customerNumber: 'CUST00001',
        tripProductCode: 'TRIPCUSTOM',
        status_code: 'New',
        orderLocked: false
      });
      await INSERT.into(db.AuditEntries).entries({
        ID: cds.utils.uuid(),
        auditEntryId: `AE-${cds.utils.uuid()}`,
        timestamp: now,
        performedBy: 'TravelOrder Assistant',
        action0_code: 'Received',
        fieldName: 'requestNumber',
        aiValue: null,
        finalValue: requestNumber,
        bookingRequests_ID: ID
      });
      return requestNumber;
    });

    return super.init();
  }
}
