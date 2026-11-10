using { travelorderai } from '../db/schema.cds';

service travelorderaiSrv {
  @odata.draft.enabled
  entity BookingRequests as projection on travelorderai.BookingRequests actions {
    @Core.OperationAvailable: { $edmJson: { $And: [ { $Path: 'in/IsActiveEntity' }, { $Or: [ { $Eq: [ { $Path: 'in/status_code' }, 'ReadyforReview' ] }, { $Eq: [ { $Path: 'in/status_code' }, 'Failed' ] } ] } ] } }
    @Common.SideEffects: { TargetProperties: ['in/status_code', 'in/salesOrderNumber', 'in/errorMessage', 'in/orderLocked'], TargetEntities: [in.status, in.AuditEntries] }
    action approve();

    @Core.OperationAvailable: { $edmJson: { $And: [ { $Path: 'in/IsActiveEntity' }, { $Or: [ { $Eq: [ { $Path: 'in/status_code' }, 'New' ] }, { $Eq: [ { $Path: 'in/status_code' }, 'NeedsInformation' ] }, { $Eq: [ { $Path: 'in/status_code' }, 'ReadyforReview' ] } ] } ] } }
    @Common.SideEffects: { TargetProperties: ['in/status_code', 'in/reviewerComment'], TargetEntities: [in.status, in.AuditEntries] }
    action rejectRequest(@title: 'Reviewer Comment' @mandatory @UI.MultiLineText comment: LargeString);

    @Core.OperationAvailable: { $edmJson: { $And: [ { $Path: 'in/IsActiveEntity' }, { $Or: [ { $Eq: [ { $Path: 'in/status_code' }, 'New' ] }, { $Eq: [ { $Path: 'in/status_code' }, 'ReadyforReview' ] } ] } ] } }
    @Common.SideEffects: { TargetProperties: ['in/status_code'], TargetEntities: [in.status, in.AuditEntries] }
    action requestInformation();

    @Core.OperationAvailable: { $edmJson: { $And: [ { $Path: 'in/IsActiveEntity' }, { $Or: [ { $Eq: [ { $Path: 'in/status_code' }, 'New' ] }, { $Eq: [ { $Path: 'in/status_code' }, 'NeedsInformation' ] } ] } ] } }
    @Common.SideEffects: { TargetProperties: ['in/status_code', 'in/language_code', 'in/destination', 'in/departureDate', 'in/returnDate', 'in/numberOfTravellers', 'in/budget', 'in/currency', 'in/missingInformation', 'in/aiRecommendation', 'in/aiConfidence'], TargetEntities: [in.status, in.AuditEntries] }
    action runAiExtraction();
  };
  entity AuditEntries as projection on travelorderai.AuditEntries;
}
