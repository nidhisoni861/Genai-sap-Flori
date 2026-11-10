import cds from '@sap/cds';
import { CHANGE_FEE, calculateRefund, datesProblem } from './booking-rules.js';

const CHANGEABLE = ['Confirmed', 'Changed'];

export default class AfterBookingService extends cds.ApplicationService {
  init() {
    const { Bookings } = this.entities;
    const db = cds.entities('afterbooking');

    const load = req => SELECT.one.from(db.Bookings).where({ ID: req.params[0].ID ?? req.params[0] });

    const record = (req, ID, action0, detail) => INSERT.into(db.BookingHistory).entries({
      ID: cds.utils.uuid(),
      booking_ID: ID,
      timestamp: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
      performedBy: req.user.id,
      action0,
      detail
    });

    const requireStatus = (req, booking, allowed) => {
      if (!booking) return req.reject(404, 'Booking not found.');
      if (!allowed.includes(booking.status_code)) {
        return req.reject(409, `This action is not allowed while the status is ${booking.status_code}.`);
      }
    };

    this.after('READ', Bookings, async result => {
    const rows = [].concat(result || []).filter(row => row.ID);
    if (!rows.length) return;
    const stored = await SELECT.from(db.Bookings).columns('ID', 'status_code', 'tripPrice', 'departureDate').where({ ID: { in: rows.map(row => row.ID) } });
    const byId = new Map(stored.map(row => [row.ID, row]));
    const currentDate = new Date().toISOString().slice(0, 10);
    for (const row of rows) {
      const b = byId.get(row.ID);
      if (b && CHANGEABLE.includes(b.status_code) && b.departureDate >= currentDate) {
        row.expectedRefund = calculateRefund(b.tripPrice, b.departureDate).amount;
      }
    }
  });

  this.on('changeDates', Bookings, async req => {
      const booking = await load(req);
      requireStatus(req, booking, CHANGEABLE);
      const { newDepartureDate, newReturnDate } = req.data;
      const problem = datesProblem(newDepartureDate, newReturnDate);
      if (problem) return req.reject(400, problem);
      if (newDepartureDate === booking.departureDate && newReturnDate === booking.returnDate) {
        return req.reject(400, 'The new dates are the same as the current dates.');
      }
      await UPDATE(db.Bookings).set({
        departureDate: newDepartureDate,
        returnDate: newReturnDate,
        changeFeesTotal: Number(booking.changeFeesTotal ?? 0) + CHANGE_FEE,
        status_code: 'Changed'
      }).where({ ID: booking.ID });
      await record(req, booking.ID, 'Change Dates', `${booking.departureDate} to ${booking.returnDate} changed to ${newDepartureDate} to ${newReturnDate}. Fee ${CHANGE_FEE} EUR.`);
    });

    this.on('cancelBooking', Bookings, async req => {
      const booking = await load(req);
      requireStatus(req, booking, CHANGEABLE);
      if (booking.departureDate < new Date().toISOString().slice(0, 10)) {
        return req.reject(409, 'This trip has already departed and cannot be cancelled.');
      }
      const refund = calculateRefund(booking.tripPrice, booking.departureDate);
      const status = refund.approvalNeeded ? 'CancellationRequested' : refund.amount > 0 ? 'Refunded' : 'Cancelled';
      await UPDATE(db.Bookings).set({
        refundPercent: refund.percent,
        refundAmount: refund.amount,
        refundApprovalNeeded: refund.approvalNeeded,
        status_code: status
      }).where({ ID: booking.ID });
      await record(req, booking.ID, 'Cancel Booking', `Refund ${refund.percent}% = ${refund.amount} ${booking.currency}.${refund.approvalNeeded ? ' Manager approval needed.' : ''}`);
    });

    this.on('approveRefund', Bookings, async req => {
      const booking = await load(req);
      requireStatus(req, booking, ['CancellationRequested']);
      await UPDATE(db.Bookings).set({ status_code: 'Refunded', refundApprovalNeeded: false }).where({ ID: booking.ID });
      await record(req, booking.ID, 'Approve Refund', `Refund of ${booking.refundAmount} ${booking.currency} approved.`);
    });

    return super.init();
  }
}
