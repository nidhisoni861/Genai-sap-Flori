using { travelorderaiSrv } from '../../srv/service.cds';

annotate travelorderaiSrv.BookingRequests with @UI.DataPoint #receivedAt: {
  Value: receivedAt,
  Title: 'Received At',
};
annotate travelorderaiSrv.BookingRequests with @UI.DataPoint #senderEmail: {
  Value: senderEmail,
  Title: 'Sender Email',
};
annotate travelorderaiSrv.BookingRequests with @UI.DataPoint #customerNumber: {
  Value: customerNumber,
  Title: 'Customer Number',
};
annotate travelorderaiSrv.BookingRequests with @UI.HeaderFacets: [
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#receivedAt', ID: 'ReceivedAt' },
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#senderEmail', ID: 'SenderEmail' },
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#customerNumber', ID: 'CustomerNumber' }
];
annotate travelorderaiSrv.BookingRequests with @UI.HeaderInfo: {
  TypeName: 'Booking Request',
  TypeNamePlural: 'Booking Requests',
  Title: { Value: requestNumber }
};
annotate travelorderaiSrv.BookingRequests with {
  ID @UI.Hidden
};
annotate travelorderaiSrv.BookingRequests with @UI.Identification: [
    { $Type: 'UI.DataFieldForAction', Action: 'travelorderaiSrv.runAiExtraction', Label: 'Read with AI', Criticality: #Critical },
    { $Type: 'UI.DataFieldForAction', Action: 'travelorderaiSrv.approve', Label: 'Approve', Criticality: #Positive },
    { $Type: 'UI.DataFieldForAction', Action: 'travelorderaiSrv.rejectRequest', Label: 'Reject', Criticality: #Negative },
    { $Type: 'UI.DataFieldForAction', Action: 'travelorderaiSrv.requestInformation', Label: 'Request Information' },
    { Value: requestNumber }];
annotate travelorderaiSrv.BookingRequests with {
  requestNumber @Common.Label: 'Request Number';
  receivedAt @Common.Label: 'Received At';
  senderEmail @Common.Label: 'Sender Email';
  subject @Common.Label: 'Subject';
  originalMessage @Common.Label: 'Original Message';
  language @Common.Label: 'Language';
  customerNumber @Common.Label: 'Customer Number';
  tripProductCode @Common.Label: 'Trip Product Code';
  destination @Common.Label: 'Destination';
  departureDate @Common.Label: 'Departure Date';
  returnDate @Common.Label: 'Return Date';
  numberOfTravellers @Common.Label: 'Number Of Travellers';
  budget @Common.Label: 'Budget';
  currency @Common.Label: 'Currency';
  missingInformation @Common.Label: 'Missing Information';
  aiRecommendation @Common.Label: 'Ai Recommendation';
  aiConfidence @Common.Label: 'Ai Confidence';
  reviewerComment @Common.Label: 'Reviewer Comment';
  status @Common.Label: 'Status';
  salesOrderNumber @Common.Label: 'Sales Order Number';
  errorMessage @Common.Label: 'Error Message';
  AuditEntries @Common.Label: 'Audit Entries'
};
annotate travelorderaiSrv.BookingRequests with {
  ID @Common.Text: { $value: requestNumber, ![@UI.TextArrangement]: #TextOnly };
  language @Common.Text : { $value: language.name, ![@UI.TextArrangement]: #TextOnly };
  status @Common.Text : { $value: status.name, ![@UI.TextArrangement]: #TextOnly };
};
annotate travelorderaiSrv.BookingRequests with {
  language @Common.ValueListWithFixedValues;
  status @Common.ValueListWithFixedValues;
};
annotate travelorderaiSrv.BookingRequests with @UI.SelectionFields : [
 status_code,
 destination,
 departureDate,
 receivedAt
];
annotate travelorderaiSrv.BookingRequests with @UI.LineItem : [
    { $Type: 'UI.DataField', Value: requestNumber },
    { $Type: 'UI.DataField', Value: status_code, Criticality: status.criticality, ![@UI.Importance]: #High },
    { $Type: 'UI.DataField', Value: receivedAt },
    { $Type: 'UI.DataField', Value: senderEmail },
    { $Type: 'UI.DataField', Value: subject },
    { $Type: 'UI.DataField', Value: language_code },
    { $Type: 'UI.DataField', Value: customerNumber },
    { $Type: 'UI.DataField', Value: tripProductCode },
    { $Type: 'UI.DataField', Value: destination },
    { $Type: 'UI.DataField', Value: departureDate },
    { $Type: 'UI.DataField', Value: returnDate },
    { $Type: 'UI.DataField', Value: numberOfTravellers },
    { $Type: 'UI.DataField', Value: budget },
    { $Type: 'UI.DataField', Value: currency },
    { $Type: 'UI.DataField', Value: salesOrderNumber },
    { $Type: 'UI.DataField', Value: errorMessage }
];
annotate travelorderaiSrv.BookingRequests with @UI.FieldGroup #originalMessageSection: {
  $Type: 'UI.FieldGroupType', Data: [
    { $Type: 'UI.DataField', Value: originalMessage }

  ]
};


annotate travelorderaiSrv.BookingRequests with @UI.FieldGroup #bookingDetailsSection: {
  $Type: 'UI.FieldGroupType', Data: [
    { $Type: 'UI.DataField', Value: requestNumber },
    { $Type: 'UI.DataField', Value: receivedAt },
    { $Type: 'UI.DataField', Value: senderEmail },
    { $Type: 'UI.DataField', Value: subject },
    { $Type: 'UI.DataField', Value: language_code },
    { $Type: 'UI.DataField', Value: customerNumber },
    { $Type: 'UI.DataField', Value: tripProductCode },
    { $Type: 'UI.DataField', Value: destination },
    { $Type: 'UI.DataField', Value: departureDate },
    { $Type: 'UI.DataField', Value: returnDate },
    { $Type: 'UI.DataField', Value: numberOfTravellers },
    { $Type: 'UI.DataField', Value: budget },
    { $Type: 'UI.DataField', Value: currency }

  ]
};


annotate travelorderaiSrv.BookingRequests with @UI.FieldGroup #aiReviewSection: {
  $Type: 'UI.FieldGroupType', Data: [
    { $Type: 'UI.DataField', Value: missingInformation, Label: 'Missing or Wrong Information' },
    { $Type: 'UI.DataField', Value: aiRecommendation },
    { $Type: 'UI.DataField', Value: aiConfidence },
    { $Type: 'UI.DataField', Value: reviewerComment },
    { $Type: 'UI.DataField', Value: status_code, Criticality: status.criticality },
    { $Type: 'UI.DataField', Value: salesOrderNumber },
    { $Type: 'UI.DataField', Value: errorMessage }

  ]
};


annotate travelorderaiSrv.AuditEntries with @UI.LineItem #auditEntriesTableSection: [
    { $Type: 'UI.DataField', Value: auditEntryId },
    { $Type: 'UI.DataField', Value: timestamp },
    { $Type: 'UI.DataField', Value: performedBy },
    { $Type: 'UI.DataField', Value: action0_code, Criticality: action0.criticality },
    { $Type: 'UI.DataField', Value: fieldName },
    { $Type: 'UI.DataField', Value: aiValue },
    { $Type: 'UI.DataField', Value: finalValue }

  ];


annotate travelorderaiSrv.BookingRequests with @UI.Facets: [
  {
    $Type: 'UI.CollectionFacet',
    ID: 'detailsTab',
    Label: 'Details',
    Facets: [
      { $Type: 'UI.ReferenceFacet', ID: 'originalMessageSection', Label: 'Original Message', Target: '@UI.FieldGroup#originalMessageSection' },
      { $Type: 'UI.ReferenceFacet', ID: 'bookingDetailsSection', Label: 'Booking Details', Target: '@UI.FieldGroup#bookingDetailsSection' },
      { $Type: 'UI.ReferenceFacet', ID: 'aiReviewSection', Label: 'AI Recommendation and Review', Target: '@UI.FieldGroup#aiReviewSection' } ]
  },
  {
    $Type: 'UI.CollectionFacet',
    ID: 'auditTab',
    Label: 'Audit',
    Facets: [
      { $Type: 'UI.ReferenceFacet', ID: 'auditEntriesTableSection', Label: 'Audit History', Target: 'AuditEntries/@UI.LineItem#auditEntriesTableSection' } ]
  }
];
annotate travelorderaiSrv.AuditEntries with {
  bookingRequests @Common.ValueList: {
    CollectionPath: 'BookingRequests',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: bookingRequests_ID,
        ValueListProperty: 'ID'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'requestNumber'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'receivedAt'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'senderEmail'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'subject'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'originalMessage'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'language_code'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'customerNumber'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'tripProductCode'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'destination'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'departureDate'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'returnDate'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'numberOfTravellers'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'budget'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'currency'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'missingInformation'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'aiRecommendation'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'aiConfidence'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'reviewerComment'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'status_code'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'salesOrderNumber'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'errorMessage'
      },
    ],
  }
};
annotate travelorderaiSrv.AuditEntries with @UI.DataPoint #timestamp: {
  Value: timestamp,
  Title: 'Timestamp',
};
annotate travelorderaiSrv.AuditEntries with @UI.DataPoint #performedBy: {
  Value: performedBy,
  Title: 'Performed By',
};
annotate travelorderaiSrv.AuditEntries with @UI.DataPoint #action0: {
  Value: action0_code,
  Title: 'Action',
  Criticality: action0.criticality,
};
annotate travelorderaiSrv.AuditEntries with @UI.HeaderFacets: [
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#timestamp', ID: 'Timestamp' },
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#performedBy', ID: 'PerformedBy' },
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#action0', ID: 'Action0' }
];
annotate travelorderaiSrv.AuditEntries with @UI.HeaderInfo: {
  TypeName: 'Audit Entry',
  TypeNamePlural: 'Audit Entries',
  Title: { Value: auditEntryId }
};
annotate travelorderaiSrv.AuditEntries with {
  ID @UI.Hidden
};
annotate travelorderaiSrv.AuditEntries with @UI.Identification: [{ Value: auditEntryId }];
annotate travelorderaiSrv.AuditEntries with {
  auditEntryId @Common.Label: 'Audit Entry Id';
  timestamp @Common.Label: 'Timestamp';
  performedBy @Common.Label: 'Performed By';
  action0 @Common.Label: 'Action';
  fieldName @Common.Label: 'Field Name';
  aiValue @Common.Label: 'Ai Value';
  finalValue @Common.Label: 'Final Value';
  bookingRequests @Common.Label: 'Booking Request'
};
annotate travelorderaiSrv.AuditEntries with {
  ID @Common.Text: { $value: auditEntryId, ![@UI.TextArrangement]: #TextOnly };
  bookingRequests @Common.Text: { $value: bookingRequests.requestNumber, ![@UI.TextArrangement]: #TextOnly };
  action0 @Common.Text : { $value: action0.name, ![@UI.TextArrangement]: #TextOnly };
};
annotate travelorderaiSrv.AuditEntries with {
  action0 @Common.ValueListWithFixedValues;
};
annotate travelorderaiSrv.AuditEntries with @UI.SelectionFields: [
  bookingRequests_ID,
  action0_code
];
annotate travelorderaiSrv.AuditEntries with @UI.LineItem: [
    { $Type: 'UI.DataField', Value: ID },
    { $Type: 'UI.DataField', Value: auditEntryId },
    { $Type: 'UI.DataField', Value: timestamp },
    { $Type: 'UI.DataField', Value: performedBy },
    { $Type: 'UI.DataField', Value: action0_code, Criticality: action0.criticality },
    { $Type: 'UI.DataField', Value: fieldName },
    { $Type: 'UI.DataField', Value: aiValue },
    { $Type: 'UI.DataField', Value: finalValue },
    { $Type: 'UI.DataField', Label: 'Booking Request', Value: bookingRequests_ID }
];
annotate travelorderaiSrv.AuditEntries with @UI.FieldGroup #Main: {
  $Type: 'UI.FieldGroupType', Data: [
    { $Type: 'UI.DataField', Value: ID },
    { $Type: 'UI.DataField', Value: auditEntryId },
    { $Type: 'UI.DataField', Value: timestamp },
    { $Type: 'UI.DataField', Value: performedBy },
    { $Type: 'UI.DataField', Value: action0_code, Criticality: action0.criticality },
    { $Type: 'UI.DataField', Value: fieldName },
    { $Type: 'UI.DataField', Value: aiValue },
    { $Type: 'UI.DataField', Value: finalValue },
    { $Type: 'UI.DataField', Label: 'Booking Request', Value: bookingRequests_ID }
]};
annotate travelorderaiSrv.AuditEntries with @UI.Facets: [
  { $Type: 'UI.ReferenceFacet', ID: 'Main', Label: 'General Information', Target: '@UI.FieldGroup#Main' }
];
// Step 17: no Edit or Delete after a sales order exists in S/4HANA.
annotate travelorderaiSrv.BookingRequests with @(
  UI.UpdateHidden: orderLocked,
  UI.DeleteHidden: orderLocked
) {
  orderLocked @UI.Hidden;
};

// Fields set only by the system (AI, approval, S/4HANA): read-only for staff, also on the server.
annotate travelorderaiSrv.BookingRequests with {
  status @readonly;
  salesOrderNumber @readonly;
  errorMessage @readonly;
  orderLocked @readonly;
};
annotate travelorderaiSrv.AuditEntries with @(Capabilities: { InsertRestrictions: { Insertable: false }, UpdateRestrictions: { Updatable: false }, DeleteRestrictions: { Deletable: false } }) {
  auditEntryId @readonly; timestamp @readonly; performedBy @readonly; action0 @readonly;
  fieldName @readonly; aiValue @readonly; finalValue @readonly;
};
