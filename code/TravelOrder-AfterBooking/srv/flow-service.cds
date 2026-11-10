// Receives a booking from TravelOrder Intake (Project 2) after the sales order is created.
// Open path, protected by the shared key in the x-flow-key header (BTP env variable FLOW_KEY).
@requires: 'any'
@path: 'flow'
service FlowService {
  action receiveBooking(
    bookingNumber      : String(20),
    customerName       : String(100),
    customerEmail      : String(100),
    destination        : String(100),
    departureDate      : Date,
    returnDate         : Date,
    numberOfTravellers : Integer,
    totalPrice         : Decimal(10, 2),
    currency           : String(3),
    notes              : LargeString
  ) returns String;
}
