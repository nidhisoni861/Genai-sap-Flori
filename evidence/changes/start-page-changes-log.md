# Start page: connecting Projects 1 to 4 (10 Nov 2026)

Built with Claude Code in `code/TravelOrder-Assistant-local/` (same local server as the Project 1 assistant).

## What was added
- `public/start.html` at http://localhost:4010/start: four cards in process order, 1 Assistant, 2 Intake, 3 Overview, 4 After-Booking. Each card shows what the step does, the SAP technology, the AI used, and an "Open" button.
  - Card 1 opens the assistant in the same tab; cards 2 to 4 open the BTP apps in a new tab (full links).
  - Demo script with the cases to show: Assistant Test 4 and Test 1; Intake BRQ10008 (AI analysis) and BRQ10004 (create sales order); Overview BO-2001 (AI insights); After-Booking AB-1001 (cancel, 1,350 EUR, manager approval, same amount as the Assistant).
  - Note: each app has its own database; S/4HANA is simulated; the Assistant is a local copy of the Joule agent.
- Assistant chat page: "<- Start" button in the header.
- `server.js`: route /start; the startup message prints both addresses.

## Why only links, no data flow
Decided the night before the exam: real data flow between the apps needs about 4 to 6 hours and three redeploys, with the risk of breaking apps that work. The start page needs no change to the BTP apps and no redeploy.

## Problems found
- Step 1 check: all three app links returned "404 Not Found". Cause: the BTP trial stops HANA Cloud and all apps every night. Created `~/start-exam.sh` in BAS (starts HANA, waits, starts the six apps, checks the links). Run took about 8 minutes (12:28 to 12:36); all three links then returned 200. Morning steps written in `EXAM-MORNING-CHECKLIST.md`.
- The arrows between the cards were covered by the next card and showed as short dashes; fixed with z-index.

## Test (Step 4)
- Start page loads; Open Assistant opens the chat in the same tab; "<- Start" goes back: pass.
- Open Intake, Overview, After-Booking each open a new tab with the right link: pass (in the test browser without SAP login they show the SAP sign-in page first, as expected).
- Layout at 1440 and 1280 pixel width, no horizontal scroll: pass.
- Assistant still answers Test 1 correctly after the change: pass.
- Data in the apps at test time: P2 10 booking requests and 3 sales orders in mock S/4HANA; P3 12 bookings; P4 8 bookings (AB-1001 Confirmed).

Screenshots: `evidence/screenshots/start-page/01` and `02`.

## End-to-end test after a full restart (10 Nov 2026, evening)
Goal: prove that everything works after the nightly stop, using records that are not in the demo script, so the demo cases stay fresh.

Restart: all six BTP apps stopped with cf stop, then ~/start-exam.sh started them. HANA was already running. The script reached "ALL DONE" after about 2.5 minutes; all three links returned 200. Note: a restart ends the browser login session; reloading the app signs in again.

| Step | Action | Result |
|---|---|---|
| P1 Assistant | Booking check "2 travellers, 12 July 2027, no return date" | Pass: "The booking request is not complete. The problem is: return date missing or wrong (use YYYY-MM-DD). Please provide a ret" |
| P2 Intake | AI extraction on BRQ10002 (German message) | Pass: language DE and destination Berlin extracted; AI recommends clarifying the exact dates; no invented values (dates and budget were already in the sample data); status Ready for Review |
| P2 Intake | Approve BRQ10009 (Maldives) | Pass: status Order Created, sales order 5000004 created in mock S/4HANA (type OR, sales org 1010, PurchaseOrderByCustomer BRQ10009) |
| P3 Overview | Generate AI insights on BO-2009 (Istanbul, unpaid, visa question) | Pass: summary and alert mention the open 890 EUR and the visa question; AI priority Medium |
| P4 After-Booking | Cancel AB-1005 (Rome, 3,200 EUR, more than 30 days) | Pass: 90 % = 2,880 EUR, Cancellation Requested, manager needed |
| P4 After-Booking | Approve refund AB-1005 as manager | Pass: Refunded |
| P4 After-Booking | Cancel AB-1004 (Oslo, 4 days before departure) | Pass: 0 %, Cancelled |

The OpenAI key still works on BTP after the restart (P2 and P3 AI calls succeeded).
Demo cases still unused: P2 BRQ10008 (New) and BRQ10003 (Ready for Review), P3 BO-2001, P4 AB-1001 (Confirmed).

Mistake found and fixed: the demo script said to create the sales order on BRQ10004. That request has status Approved, and the Approve action (which creates the order) is only offered for Ready for Review or Failed. The demo script now uses BRQ10003.

Screenshots: evidence/screenshots/end-to-end/01 to 03.
