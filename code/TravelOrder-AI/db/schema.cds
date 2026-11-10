using { sap.common.CodeList } from '@sap/cds/common';

namespace travelorderai;

entity BookingRequestsLanguageCodeList : CodeList {
  @Common.Text : { $value: name, ![@UI.TextArrangement]: #TextOnly }
  key code : String(10);
}

entity BookingRequestsStatusCodeList : CodeList {
  @Common.Text : { $value: name, ![@UI.TextArrangement]: #TextOnly }
  key code : String(30);
  criticality : Integer;
}

entity AuditEntriesAction0CodeList : CodeList {
  @Common.Text : { $value: name, ![@UI.TextArrangement]: #TextOnly }
  key code : String(50);
  criticality : Integer;
}

entity BookingRequests {
  key ID: UUID;
  requestNumber: String(50) @assert.unique @mandatory;
  receivedAt: DateTime;
  senderEmail: String(100);
  subject: String(200);
  originalMessage: LargeString;
  language: Association to BookingRequestsLanguageCodeList;
  customerNumber: String(20);
  tripProductCode: String(30);
  destination: String(100);
  departureDate: Date;
  returnDate: Date;
  numberOfTravellers: Integer;
  budget: Decimal;
  currency: String(3);
  missingInformation: LargeString;
  aiRecommendation: LargeString;
  aiConfidence: Decimal;
  reviewerComment: LargeString;
  status: Association to BookingRequestsStatusCodeList;
  salesOrderNumber: String(50);
  orderLocked: Boolean default false;
  errorMessage: LargeString;
  AuditEntries: Association to many AuditEntries on AuditEntries.bookingRequests = $self;
}

entity AuditEntries {
  key ID: UUID;
  auditEntryId: String(50) @assert.unique @mandatory;
  timestamp: DateTime;
  performedBy: String(100);
  action0: Association to AuditEntriesAction0CodeList;
  fieldName: String(50);
  aiValue: String(255);
  finalValue: String(255);
  bookingRequests: Association to BookingRequests;
}
