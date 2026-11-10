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
          aiGeneratedAt: new Date().toISOString()
        }).where({ ID });
      } catch (e) {
        return req.reject(e.status || 500, e.message);
      }
    });

    return super.init();
  }
}
