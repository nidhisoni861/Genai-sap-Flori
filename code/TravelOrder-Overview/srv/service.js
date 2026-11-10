import cds from '@sap/cds';
import { bookingFacts, generateInsights } from './ai-insights.js';

export default class TravelBookingsService extends cds.ApplicationService {
  init() {
    const { TravelBookings } = cds.entities('travelbookings');

    this.on('generateInsights', 'TravelBookings', async req => {
      const key = req.params[0];
      const ID = key?.ID ?? key;
      const booking = await SELECT.one.from(TravelBookings).where({ ID });
      if (!booking) return req.reject(404, 'Booking not found.');
      const today = new Date().toISOString().slice(0, 10);
      try {
        const ai = await generateInsights(bookingFacts(booking, today));
        await UPDATE(TravelBookings).set({
          aiSummary: ai.summary,
          aiPriority: ai.priority,
          aiAlert: ai.alert,
          aiPlaces: ai.places,
          aiHotels: ai.hotels,
          aiGeneratedAt: new Date().toISOString()
        }).where({ ID });
      } catch (e) {
        return req.reject(e.status || 500, e.message);
      }
    });

    // Payments: the same checks as the buttons, so a direct call cannot skip them.
    const loadForPayment = async req => {
      const key = req.params[0];
      const ID = key?.ID ?? key;
      const booking = await SELECT.one.from(TravelBookings).where({ ID });
      if (!booking) return req.reject(404, 'Booking not found.');
      if (booking.bookingStatus === 'Cancelled') return req.reject(409, 'A cancelled booking cannot be paid.');
      if (!(Number(booking.totalPrice) > 0)) return req.reject(409, 'This booking has no total price.');
      return booking;
    };

    this.on('recordPartialPayment', 'TravelBookings', async req => {
      const booking = await loadForPayment(req);
      if (!booking) return;
      if (booking.paymentStatus !== 'Unpaid') {
        return req.reject(409, 'A partial payment is only possible while the booking is unpaid. Use Record Full Payment.');
      }
      const half = Math.round(Number(booking.totalPrice) * 50) / 100;
      await UPDATE(TravelBookings).set({ amountPaid: half, paymentStatus: 'Partly Paid' }).where({ ID: booking.ID });
      req.info(`Partial payment recorded: ${half.toFixed(2)} ${booking.currency || 'EUR'} of ${Number(booking.totalPrice).toFixed(2)} paid.`);
    });

    this.on('recordFullPayment', 'TravelBookings', async req => {
      const booking = await loadForPayment(req);
      if (!booking) return;
      if (booking.paymentStatus === 'Paid') return req.reject(409, 'This booking is already paid.');
      const total = Number(booking.totalPrice);
      const now = Number(booking.amountPaid) || 0;
      await UPDATE(TravelBookings).set({ amountPaid: total, paymentStatus: 'Paid' }).where({ ID: booking.ID });
      req.info(`Payment recorded: ${(total - now).toFixed(2)} ${booking.currency || 'EUR'} received. The booking is fully paid.`);
    });

    return super.init();
  }
}
