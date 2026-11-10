// Receives a checked booking request from the TravelOrder Assistant (Project 1).
// Open path, protected by the shared key in the x-flow-key header (BTP env variable FLOW_KEY).
@requires: 'any'
@path: 'flow'
service FlowService {
  action receiveRequest(
    subject     : String(200),
    message     : LargeString,
    senderEmail : String(100)
  ) returns String;
}
