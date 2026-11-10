using { travelbookings as db } from '../db/schema';

@requires: 'authenticated-user'
@path: 'overview'
service travelbookingsSrv {
  @readonly
  entity TravelBookings as projection on db.TravelBookings {
    *,
    case paymentStatus when 'Paid' then 3 when 'Partly Paid' then 2 when 'Unpaid' then 1 else 0 end as paymentCriticality : Integer,
    case aiPriority when 'High' then 1 when 'Medium' then 2 when 'Low' then 3 else 0 end as priorityCriticality : Integer
  } actions {
    @Common.SideEffects: { TargetProperties: ['in/aiSummary', 'in/aiPriority', 'in/aiAlert', 'in/aiGeneratedAt', 'in/priorityCriticality', 'in/aiPlaces', 'in/aiHotels'] }
    action generateInsights();

    // Payment recording. Partial = 50 % of the total price, only while unpaid.
    @Core.OperationAvailable: { $edmJson: { $And: [ { $Eq: [ { $Path: 'in/paymentStatus' }, 'Unpaid' ] }, { $Ne: [ { $Path: 'in/bookingStatus' }, 'Cancelled' ] } ] } }
    @Common.SideEffects: { TargetProperties: ['in/amountPaid', 'in/paymentStatus', 'in/paymentCriticality'] }
    action recordPartialPayment();

    // Full = amount paid becomes the total price (also completes a partial payment).
    @Core.OperationAvailable: { $edmJson: { $And: [ { $Ne: [ { $Path: 'in/paymentStatus' }, 'Paid' ] }, { $Ne: [ { $Path: 'in/bookingStatus' }, 'Cancelled' ] } ] } }
    @Common.SideEffects: { TargetProperties: ['in/amountPaid', 'in/paymentStatus', 'in/paymentCriticality'] }
    action recordFullPayment();
  };
}
