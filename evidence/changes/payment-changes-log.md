# Payment buttons in Bookings Overview (P3), 10 Nov 2026

Request from the student: P3 showed "Unpaid" with no way to record a payment. Option A chosen: two buttons in P3 only. Built with Claude Code.

## What was added (P3 only)
- srv/service.cds: actions recordPartialPayment and recordFullPayment, with OperationAvailable (buttons greyed out when not allowed) and SideEffects (screen refreshes).
- srv/service.js: rules. Partial = 50 % of the total price, only while Unpaid. Full = amount paid becomes the total price (also completes a partial payment), not when already Paid. Both refused for a cancelled booking or a booking without a price. The server checks the same rules, so a direct call cannot skip them.
- app/overview/annotations.cds: buttons "Record Partial Payment (50 %)" and "Record Full Payment" on the booking page and in the list.
- Only the P3 server was deployed (the buttons come from the server metadata); P2, P4 and the database content were not changed.

## Safety
Git tag working-before-payment; BAS backup ~/backup-before-payment.tgz. Package built with COPYFILE_DISABLE=1, so no hidden Mac files this time.

## Local test (Mac)
Unpaid -> partial 1,250 of 2,500 (Partly Paid); second partial refused; full -> Paid (1,250 received); full again refused; full directly from Unpaid -> Paid; both buttons in $metadata.

## Deployment
Deployed 13:50 (BAS time); OPENAI_API_KEY, OPENAI_MODEL and FLOW_KEY restored after the deploy.

## End-to-end test on BTP (screenshots evidence/screenshots/payment/01 to 07)
| Step | Result |
|---|---|
| P1: "4 travellers to Rome, 10 to 17 Sept 2027, budget 4,000 EUR", julia.weber@example.com | complete, sent, BRQ10013 |
| P2: Read with AI | Rome, dates, 4 travellers, 4,000 EUR, confidence 90, Ready for Review |
| P2: Approve | sales order 5000007, TO-5000007 sent to Overview and After-Booking |
| P3: TO-5000007 | Julia Weber, Rome, Unpaid, 4,000 EUR; both payment buttons active |
| P3: Record Partial Payment | "2000.00 EUR of 4000.00 paid", Partly Paid, partial button greyed out |
| P3: Record Full Payment | "2000.00 EUR received. The booking is fully paid.", Paid 4,000 of 4,000, both buttons greyed out |
| P3: Generate AI Insights | priority Low, no alert (the unpaid trip TO-5000006 had Medium with a payment alert) |
| P4: TO-5000007 | same trip, Confirmed; Cancel: 90 % = 3,600 EUR, manager needed; Approve Refund: Refunded |

Also seen: the student's own test trip TO-5000006 (Paris) went through P1 to P4, including a date change and a refund in P4.

## Known limit (not changed, option B not chosen)
P4 calculates the refund from the trip price, not from the amount paid in P3, because the payment is not sent to P4.

## Small fix
Assistant message after sending now names the real P2 button ("Read with AI") instead of "run the AI extraction".
