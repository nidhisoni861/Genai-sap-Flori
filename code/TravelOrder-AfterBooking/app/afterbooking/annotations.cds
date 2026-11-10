using AfterBookingService as S from '../../srv/service';

annotate S.Bookings with @(
  UI.HeaderInfo: { TypeName: 'Booking', TypeNamePlural: 'Bookings', Title: { Value: bookingNumber }, Description: { Value: destination } },
  UI.SelectionFields: [ status_code, destination, departureDate ],
  UI.LineItem: [
    { Value: bookingNumber },
    { Value: status_code, Criticality: status.criticality, ![@UI.Importance]: #High },
    { Value: customerName },
    { Value: destination },
    { Value: departureDate },
    { Value: returnDate },
    { Value: tripPrice }
  ],
  UI.Identification: [
    { $Type: 'UI.DataFieldForAction', Action: 'AfterBookingService.changeDates', Label: 'Change Dates' },
    { $Type: 'UI.DataFieldForAction', Action: 'AfterBookingService.cancelBooking', Label: 'Cancel Booking', Criticality: #Negative },
    { $Type: 'UI.DataFieldForAction', Action: 'AfterBookingService.approveRefund', Label: 'Approve Refund', Criticality: #Positive }
  ],
  UI.FieldGroup #Trip: { Data: [
    { Value: customerName }, { Value: customerEmail }, { Value: destination }, { Value: departureDate }, { Value: returnDate }, { Value: numberOfTravellers },
    { Value: status_code, Criticality: status.criticality }
  ] },
  UI.FieldGroup #Money: { Data: [
    { Value: tripPrice }, { Value: currency }, { Value: changeFeesTotal }, { Value: refundPercent }, { Value: expectedRefund, Label: 'Refund if Cancelled Today' }, { Value: refundAmount }, { Value: refundApprovalNeeded }
  ] },
  UI.Facets: [
    { $Type: 'UI.ReferenceFacet', ID: 'trip', Label: 'Trip', Target: '@UI.FieldGroup#Trip' },
    { $Type: 'UI.ReferenceFacet', ID: 'money', Label: 'Payment and Refund', Target: '@UI.FieldGroup#Money' },
    { $Type: 'UI.ReferenceFacet', ID: 'history', Label: 'History', Target: 'History/@UI.PresentationVariant' }
  ]
);

annotate S.Bookings with {
  status @(
    Common.Text: status.name,
    Common.TextArrangement: #TextOnly,
    Common.ValueListWithFixedValues: true,
    Common.ValueList: {
      CollectionPath: 'BookingStatus',
      Parameters: [
        { $Type: 'Common.ValueListParameterInOut', LocalDataProperty: status_code, ValueListProperty: 'code' },
        { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
      ]
    }
  );
};

annotate S.History with @(
  UI.PresentationVariant: { SortOrder: [ { Property: timestamp, Descending: true } ], Visualizations: [ '@UI.LineItem' ] },
  UI.HeaderInfo: { TypeName: 'History Entry', TypeNamePlural: 'History', Title: { Value: action0 } },
  UI.LineItem: [ { Value: timestamp }, { Value: performedBy }, { Value: action0 }, { Value: detail } ],
  UI.Facets: [ { $Type: 'UI.ReferenceFacet', Label: 'Details', Target: '@UI.LineItem' } ]
);
