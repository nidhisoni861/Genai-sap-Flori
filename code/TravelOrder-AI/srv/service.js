import cds from '@sap/cds';
import { extractBooking } from './ai-extraction.js';
import { checkBooking } from './booking-checks.js';
import { createSalesOrder } from './s4-sales-order.js';

export default class travelorderaiSrv extends cds.ApplicationService {
  init() {
    const { BookingRequests } = this.entities;
    const db = cds.entities('travelorderai');

    const decide = async (req, action, allowedFrom, status, extra = {}) => {
      const { ID } = req.params[0];
      const current = await SELECT.one.from(db.BookingRequests).where({ ID });
      if (!current) return req.reject(404, 'Booking request not found.');
      if (!allowedFrom.includes(current.status_code)) {
        return req.reject(409, `This action is not allowed while the status is ${current.status_code}.`);
      }
      await UPDATE(db.BookingRequests).set({ status_code: status, ...extra }).where({ ID });
      await INSERT.into(db.AuditEntries).entries({
        auditEntryId: `AE-${cds.utils.uuid()}`,
        timestamp: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
        performedBy: req.user.id,
        action0_code: action,
        fieldName: 'status',
        aiValue: current.status_code,
        finalValue: status,
        bookingRequests_ID: ID
      });
    };

    this.on('runAiExtraction', BookingRequests, async req => {
      const { ID } = req.params[0];
      const current = await SELECT.one.from(db.BookingRequests).where({ ID });
      if (!current) return req.reject(404, 'Booking request not found.');
      if (!['New', 'NeedsInformation'].includes(current.status_code)) {
        return req.reject(409, `AI extraction is not allowed while the status is ${current.status_code}.`);
      }
      if (!current.originalMessage?.trim()) return req.reject(400, 'This request has no customer message to read.');

      let ai;
      try {
        ai = await extractBooking({ subject: current.subject, message: current.originalMessage });
      } catch (error) {
        return req.reject(error.status ?? 502, error.message);
      }

      const extracted = {
        language_code: ai.language,
        destination: ai.destination,
        departureDate: ai.departureDate,
        returnDate: ai.returnDate,
        numberOfTravellers: ai.numberOfTravellers,
        budget: ai.budget,
        currency: ai.currency
      };
      const found = Object.fromEntries(Object.entries(extracted).filter(([, value]) => value !== null));
      const issues = checkBooking({ ...current, ...found });
      const status = issues.length ? 'NeedsInformation' : 'ReadyforReview';

      await UPDATE(db.BookingRequests).set({
        ...found,
        missingInformation: issues.join('; ') || null,
        aiRecommendation: ai.recommendation,
        aiConfidence: ai.confidence,
        status_code: status
      }).where({ ID });

      const timestamp = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
      await INSERT.into(db.AuditEntries).entries(Object.entries(found).map(([fieldName, value]) => ({
        auditEntryId: `AE-${cds.utils.uuid()}`,
        timestamp,
        performedBy: 'OpenAI',
        action0_code: 'AIExtraction',
        fieldName,
        aiValue: String(value),
        finalValue: String(value),
        bookingRequests_ID: ID
      })));
    });

    this.on('approve', BookingRequests, async req => {
      const booking = await SELECT.one.from(db.BookingRequests).where({ ID: req.params[0].ID });
      const issues = booking ? checkBooking(booking) : [];
      if (issues.length) return req.reject(409, `This request cannot be approved: ${issues.join('; ')}.`);
      await decide(req, 'Approve', ['ReadyforReview', 'Failed'], 'Approved');

      // Send the approved request to S/4HANA (simulated). A refusal must not undo the approval,
      // so the request is kept with status Failed and the reason, instead of rejecting the action.
      const result = await createSalesOrder(booking);
      const ID = booking.ID;
      if (result.ok) {
        await UPDATE(db.BookingRequests).set({ status_code: 'OrderCreated', salesOrderNumber: result.salesOrder, errorMessage: null, orderLocked: true }).where({ ID });
      } else {
        await UPDATE(db.BookingRequests).set({ status_code: 'Failed', errorMessage: result.message }).where({ ID });
        req.warn(`Approved, but S/4HANA did not create the sales order: ${result.message}`);
      }
      await INSERT.into(db.AuditEntries).entries({
        auditEntryId: `AE-${cds.utils.uuid()}`,
        timestamp: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
        performedBy: req.user.id,
        action0_code: 'CreateSalesOrder',
        fieldName: result.ok ? 'salesOrderNumber' : 'errorMessage',
        aiValue: null,
        finalValue: result.ok ? result.salesOrder : result.message.slice(0, 250),
        bookingRequests_ID: ID
      });
    });

    this.on('rejectRequest', BookingRequests, req => {
      const comment = (req.data.comment || '').trim();
      if (!comment) return req.reject(400, 'A reviewer comment is required to reject a request.');
      return decide(req, 'Reject', ['New', 'NeedsInformation', 'ReadyforReview'], 'Rejected', { reviewerComment: comment });
    });

    this.on('requestInformation', BookingRequests, req =>
      decide(req, 'RequestInformation', ['New', 'ReadyforReview'], 'NeedsInformation'));

    // A request that already has a sales order in S/4HANA must not be changed or deleted.
    const blockWhenOrdered = async req => {
      const key = req.params?.[0]; const ID = key?.ID ?? key;
      if (!ID) return;
      const row = await SELECT.one.from(db.BookingRequests).columns('status_code').where({ ID });
      if (row?.status_code === 'OrderCreated') return req.reject(409, 'This request already has a sales order in S/4HANA and cannot be changed or deleted.');
    };
    this.before('EDIT', BookingRequests, blockWhenOrdered);
    this.before('DELETE', BookingRequests, blockWhenOrdered);

    this.before('SAVE', BookingRequests, req => {
      const { departureDate, returnDate, numberOfTravellers, budget } = req.data;
      if (departureDate && returnDate && returnDate <= departureDate) {
        req.error(400, 'Return date must be after departure date.', 'returnDate');
      }
      if (numberOfTravellers !== undefined && numberOfTravellers !== null && numberOfTravellers < 1) {
        req.error(400, 'Number of travellers must be at least 1.', 'numberOfTravellers');
      }
      if (budget !== undefined && budget !== null && budget < 0) {
        req.error(400, 'Budget must not be negative.', 'budget');
      }
    });

    return super.init();
  }
}
