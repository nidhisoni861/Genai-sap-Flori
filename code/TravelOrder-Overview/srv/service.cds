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
    @Common.SideEffects: { TargetProperties: ['in/aiSummary', 'in/aiPriority', 'in/aiAlert', 'in/aiGeneratedAt', 'in/priorityCriticality'] }
    action generateInsights();
  };
}
