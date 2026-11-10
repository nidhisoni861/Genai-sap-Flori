import cds from '@sap/cds';

// Only callers that know the shared key (TravelOrder Intake) may create bookings here.
const keyOk = req => {
  const expected = process.env.FLOW_KEY;
  return Boolean(expected) && req.http?.req?.headers?.['x-flow-key'] === expected;
};

export default class FlowService extends cds.ApplicationService {
  init() {
    const db = cds.entities('afterbooking');

    this.on('receiveBooking', async req => {
      if (!keyOk(req)) return req.reject(401, 'Missing or wrong flow key.');
      const d = req.data;
      if (!d.bookingNumber || !d.destination) return req.reject(400, 'bookingNumber and destination are required.');

      // Same trip sent twice: keep the first one.
      const existing = await SELECT.one.from(db.Bookings).columns('ID').where({ bookingNumber: d.bookingNumber });
      if (existing) return `Booking ${d.bookingNumber} already exists.`;

      const ID = cds.utils.uuid();
      await INSERT.into(db.Bookings).entries({
        ID,
        bookingNumber: d.bookingNumber,
        customerName: d.customerName,
        customerEmail: d.customerEmail,
        destination: d.destination,
        departureDate: d.departureDate,
        returnDate: d.returnDate,
        numberOfTravellers: d.numberOfTravellers,
        tripPrice: d.totalPrice,
        currency: d.currency || 'EUR',
        changeFeesTotal: 0,
        refundApprovalNeeded: false,
        status_code: 'Confirmed'
      });
      await INSERT.into(db.BookingHistory).entries({
        ID: cds.utils.uuid(),
        booking_ID: ID,
        timestamp: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
        performedBy: 'TravelOrder Intake',
        action0: 'Received',
        detail: `Booking received from TravelOrder Intake (S/4HANA sales order ${d.bookingNumber.replace(/^TO-/, '')})`
      });
      return `Booking ${d.bookingNumber} created.`;
    });

    return super.init();
  }
}
