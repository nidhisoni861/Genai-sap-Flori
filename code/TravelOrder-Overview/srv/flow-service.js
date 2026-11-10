import cds from '@sap/cds';

// Only callers that know the shared key (TravelOrder Intake) may create bookings here.
const keyOk = req => {
  const expected = process.env.FLOW_KEY;
  return Boolean(expected) && req.http?.req?.headers?.['x-flow-key'] === expected;
};

export default class FlowService extends cds.ApplicationService {
  init() {
    const { TravelBookings } = cds.entities('travelbookings');

    this.on('receiveBooking', async req => {
      if (!keyOk(req)) return req.reject(401, 'Missing or wrong flow key.');
      const d = req.data;
      if (!d.bookingNumber || !d.destination) return req.reject(400, 'bookingNumber and destination are required.');

      // Same trip sent twice: keep the first one.
      const existing = await SELECT.one.from(TravelBookings).columns('ID').where({ bookingNumber: d.bookingNumber });
      if (existing) return `Booking ${d.bookingNumber} already exists.`;

      await INSERT.into(TravelBookings).entries({
        ID: cds.utils.uuid(),
        bookingNumber: d.bookingNumber,
        customerName: d.customerName,
        customerEmail: d.customerEmail,
        destination: d.destination,
        departureDate: d.departureDate,
        returnDate: d.returnDate,
        numberOfTravellers: d.numberOfTravellers,
        totalPrice: d.totalPrice,
        currency: d.currency || 'EUR',
        amountPaid: 0,
        paymentStatus: 'Unpaid',
        bookingStatus: 'Confirmed',
        customerNotes: d.notes
      });
      return `Booking ${d.bookingNumber} created.`;
    });

    return super.init();
  }
}
