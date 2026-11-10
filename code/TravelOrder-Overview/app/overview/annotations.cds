using travelbookingsSrv as S from '../../srv/service';

annotate S.TravelBookings with {
  bookingNumber @title: 'Booking Number';
  customerName @title: 'Customer';
  customerEmail @title: 'Customer Email';
  destination @title: 'Destination';
  departureDate @title: 'Departure Date';
  returnDate @title: 'Return Date';
  numberOfTravellers @title: 'Travellers';
  totalPrice @title: 'Total Price';
  currency @title: 'Currency';
  amountPaid @title: 'Amount Paid';
  paymentStatus @title: 'Payment Status';
  bookingStatus @title: 'Booking Status';
  customerNotes @title: 'Customer Notes' @UI.MultiLineText;
  aiSummary @title: 'AI Summary' @UI.MultiLineText;
  aiPriority @title: 'AI Priority';
  aiAlert @title: 'AI Alert' @UI.MultiLineText;
  aiGeneratedAt @title: 'AI Generated At';
  aiPlaces @title: 'Places to Visit' @UI.MultiLineText;
  aiHotels @title: 'Hotel Suggestions (no prices)' @UI.MultiLineText;
  paymentCriticality @UI.Hidden;
  priorityCriticality @UI.Hidden;
};

annotate S.TravelBookings with @(
  UI.HeaderInfo: { TypeName: 'Booking', TypeNamePlural: 'Bookings', Title: { Value: bookingNumber }, Description: { Value: destination } },
  UI.SelectionFields: [ bookingStatus, paymentStatus, aiPriority, destination ],
  UI.Identification: [
    { $Type: 'UI.DataFieldForAction', Action: 'travelbookingsSrv.generateInsights', Label: 'Generate AI Insights' },
    { $Type: 'UI.DataFieldForAction', Action: 'travelbookingsSrv.recordPartialPayment', Label: 'Record Partial Payment (50 %)' },
    { $Type: 'UI.DataFieldForAction', Action: 'travelbookingsSrv.recordFullPayment', Label: 'Record Full Payment' }
  ],
  UI.LineItem: [
    { $Type: 'UI.DataFieldForAction', Action: 'travelbookingsSrv.generateInsights', Label: 'Generate AI Insights' },
    { $Type: 'UI.DataFieldForAction', Action: 'travelbookingsSrv.recordPartialPayment', Label: 'Record Partial Payment (50 %)' },
    { $Type: 'UI.DataFieldForAction', Action: 'travelbookingsSrv.recordFullPayment', Label: 'Record Full Payment' },
    { Value: bookingNumber },
    { Value: customerName },
    { Value: destination },
    { Value: departureDate },
    { Value: bookingStatus },
    { Value: paymentStatus, Criticality: paymentCriticality, ![@UI.Importance]: #High },
    { Value: aiPriority, Criticality: priorityCriticality, ![@UI.Importance]: #High }
  ],
  UI.PresentationVariant: { SortOrder: [ { Property: departureDate, Descending: false } ], Visualizations: [ '@UI.LineItem' ] },
  UI.FieldGroup #Trip: { Data: [ { Value: customerName }, { Value: customerEmail }, { Value: destination }, { Value: departureDate }, { Value: returnDate }, { Value: numberOfTravellers }, { Value: bookingStatus } ] },
  UI.FieldGroup #Payment: { Data: [ { Value: totalPrice }, { Value: currency }, { Value: amountPaid }, { Value: paymentStatus, Criticality: paymentCriticality } ] },
  UI.FieldGroup #Notes: { Data: [ { Value: customerNotes } ] },
  UI.FieldGroup #AI: { Data: [ { Value: aiPriority, Criticality: priorityCriticality }, { Value: aiSummary }, { Value: aiAlert }, { Value: aiGeneratedAt } ] },
  UI.FieldGroup #Tips: { Data: [ { Value: aiPlaces }, { Value: aiHotels } ] },
  UI.Facets: [
    { $Type: 'UI.ReferenceFacet', ID: 'trip', Label: 'Trip Details', Target: '@UI.FieldGroup#Trip' },
    { $Type: 'UI.ReferenceFacet', ID: 'payment', Label: 'Payment', Target: '@UI.FieldGroup#Payment' },
    { $Type: 'UI.ReferenceFacet', ID: 'notes', Label: 'Customer Notes', Target: '@UI.FieldGroup#Notes' },
    { $Type: 'UI.ReferenceFacet', ID: 'ai', Label: 'AI Insights', Target: '@UI.FieldGroup#AI' },
    { $Type: 'UI.ReferenceFacet', ID: 'tips', Label: 'AI Travel Suggestions (please check before booking)', Target: '@UI.FieldGroup#Tips' }
  ]
);
