namespace afterbooking;

entity BookingStatus {
  key code        : String(30);
      name        : String(50);
      criticality : Integer;
}

entity Bookings {
  key ID                   : UUID;
      bookingNumber        : String(20) @mandatory @assert.unique @title: 'Booking Number';
      customerName         : String(100) @title: 'Customer';
      customerEmail        : String(100) @title: 'Customer Email';
      destination          : String(100) @title: 'Destination';
      departureDate        : Date @title: 'Departure Date';
      returnDate           : Date @title: 'Return Date';
      numberOfTravellers   : Integer @title: 'Travellers';
      tripPrice            : Decimal(10, 2) @title: 'Trip Price';
      currency             : String(3) @title: 'Currency';
      changeFeesTotal      : Decimal(10, 2) default 0 @title: 'Change Fees';
      refundPercent        : Integer @title: 'Refund %';
      refundAmount         : Decimal(10, 2) @title: 'Refund Amount';
      refundApprovalNeeded : Boolean default false @title: 'Manager Approval Needed';
      status               : Association to BookingStatus @title: 'Status';
      History              : Composition of many BookingHistory on History.booking = $self;
}

entity BookingHistory {
  key ID          : UUID;
      booking     : Association to Bookings;
      timestamp   : DateTime @title: 'Time';
      performedBy : String(100) @title: 'Performed By';
      action0     : String(30) @title: 'Action';
      detail      : String(255) @title: 'Details';
}
