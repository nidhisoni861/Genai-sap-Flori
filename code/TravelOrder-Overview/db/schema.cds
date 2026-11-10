namespace travelbookings;

entity TravelBookings {
  key ID: UUID;
  bookingNumber: String(20) @mandatory;
  customerName: String(100);
  customerEmail: String(100);
  destination: String(60);
  departureDate: Date;
  returnDate: Date;
  numberOfTravellers: Integer;
  totalPrice: Decimal(10,2);
  currency: String(3);
  amountPaid: Decimal(10,2);
  paymentStatus: String(20);
  bookingStatus: String(20);
  customerNotes: LargeString;
  aiSummary: LargeString;
  aiPriority: String(10);
  aiAlert: LargeString;
  aiGeneratedAt: Timestamp;
}
