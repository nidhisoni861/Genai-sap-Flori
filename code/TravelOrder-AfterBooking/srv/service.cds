using { afterbooking as db } from '../db/schema';

@requires: 'authenticated-user'
@path: 'after-booking'
service AfterBookingService {
  @readonly
  entity Bookings as projection on db.Bookings { *, virtual expectedRefund : Decimal(10,2) } actions {
    @Core.OperationAvailable: { $edmJson: { $Or: [ { $Eq: [ { $Path: 'in/status_code' }, 'Confirmed' ] }, { $Eq: [ { $Path: 'in/status_code' }, 'Changed' ] } ] } }
    @Common.SideEffects: { TargetProperties: ['in/status_code', 'in/departureDate', 'in/returnDate', 'in/changeFeesTotal', 'in/expectedRefund'], TargetEntities: [in.status, in.History] }
    action changeDates(@title: 'New Departure Date' @mandatory newDepartureDate: Date, @title: 'New Return Date' @mandatory newReturnDate: Date);

    @Core.OperationAvailable: { $edmJson: { $Or: [ { $Eq: [ { $Path: 'in/status_code' }, 'Confirmed' ] }, { $Eq: [ { $Path: 'in/status_code' }, 'Changed' ] } ] } }
    @Common.SideEffects: { TargetProperties: ['in/status_code', 'in/refundPercent', 'in/refundAmount', 'in/refundApprovalNeeded', 'in/expectedRefund'], TargetEntities: [in.status, in.History] }
    @Common.IsActionCritical: true
    action cancelBooking();

    @Core.OperationAvailable: { $edmJson: { $Eq: [ { $Path: 'in/status_code' }, 'CancellationRequested' ] } }
    @Common.SideEffects: { TargetProperties: ['in/status_code', 'in/refundApprovalNeeded'], TargetEntities: [in.status, in.History] }
    @requires: 'Manager'
    action approveRefund();
  };
  @readonly entity History as projection on db.BookingHistory;
  @readonly entity BookingStatus as projection on db.BookingStatus;
}
