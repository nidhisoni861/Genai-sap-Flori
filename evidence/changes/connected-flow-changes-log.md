# Connecting Projects 1 to 4 (10 Nov 2026)

Goal: type a trip once in the Assistant (P1) and see the same trip in Intake (P2), Overview (P3) and After-Booking (P4).
Built with Claude Code. Same BTP account and the same three apps; no new app was created.

## Design
- P1 (local copy of the Joule agent): when the skill finds the request complete, a "Send to Intake" button appears. It calls P2 on BTP.
- P2: new CAP service FlowService (path /flow), action receiveRequest: creates a booking request with status New. The Intake AI then reads it as usual ("Read with AI").
- P2 Approve: after the sales order is created in mock S/4HANA, the trip is sent to P3 and P4 (trip-forward.js) with the booking number TO-<sales order>. If P3 or P4 fails, the sales order stays and only a warning is shown.
- P3 and P4: new CAP service FlowService, action receiveBooking: creates the booking (P3: unpaid, confirmed; P4: confirmed, with a history entry). The same trip sent twice is created only once.
- Security: the flow services are open paths protected by a shared key (header x-flow-key, BTP environment variable FLOW_KEY). Wrong or missing key: 401. In production the BTP Destination service with OAuth would be used instead.
- Mock S/4HANA master data: new customer CUST00001 (TravelOrder Assistant customer) and new product TRIPCUSTOM (custom trip without list price; the customer budget is the net amount). Found before deployment: without them the sales order for an assistant request would fail, because the mock checks customers and products like SAP does.
- Limits: the price in P3 and P4 is the customer's budget (Intake has no real price); the customer name is made from the email address.

## Safety
- Git tag working-before-flow on GitHub before any change.
- Backup of the old server code in BAS: ~/backup-before-flow.tgz.
- Only the server modules were deployed (cf deploy -m <srv module>); screens and database content were not changed.

## Local test (on the Mac, test database)
P1 to P2 to P3 and P4 complete; P4 cancel 90 %; P3 switched off: order kept, warning shown; missing/wrong key refused; assistant skill tests 7 of 7.

## Deployment problems
- First run: the Mac tar added hidden AppleDouble files (._flow-service.cds) into BAS; the CDS build failed ("Mismatched IllegalToken"). Nothing reached BTP. Files deleted, script changed to skip them, run again.
- The deploy resets environment variables set with cf set-env. Found before the run that OPENAI_MODEL was not in the script; added. After the run all variables were present again (OPENAI_API_KEY, OPENAI_MODEL, FLOW_KEY, FLOW_OVERVIEW_URL, FLOW_AFTERBOOKING_URL).
- Deployed P3 13:13, P4 13:16, P2 13:18 (BAS time). Without key 401, with key accepted, all screens 200.

## End-to-end test on BTP (screenshots evidence/screenshots/connected-flow/01 to 07)
| Step | Result |
|---|---|
| P1: "3 travellers to Lisbon, 5 to 12 Sept 2027, budget 3,300 EUR", email maria.costa@example.com | complete; sent; created as BRQ10011 |
| P2: BRQ10011 in the list, status New, CUST00001 / TRIPCUSTOM | pass |
| P2: Read with AI | Lisbon, 5 and 12 Sept 2027, 3 travellers, 3,300 EUR, confidence 95, Ready for Review |
| P2: Approve | "Sales order 5000005 created. Bookings Overview: booking TO-5000005 sent. After-Booking: booking TO-5000005 sent." |
| P3: TO-5000005 | Maria Costa, Lisbon, 5 Sept 2027, Unpaid; Generate AI Insights: priority Medium |
| P4: TO-5000005 | Maria Costa, Lisbon, 5 to 12 Sept 2027, 3 travellers, 3,300 EUR, Confirmed; history "received from TravelOrder Intake (S/4HANA sales order 5000005)" |
| P4: Cancel, then Approve Refund | 90 % = 2,970 EUR, manager needed; approved: Refunded |
