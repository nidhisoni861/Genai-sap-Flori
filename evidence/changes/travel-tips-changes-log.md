# AI travel suggestions in Bookings Overview (P3), 10 Nov 2026

Request from the student: when "Generate AI Insights" runs, also show 4 to 5 places to visit and 4 to 5 hotels for the destination.
The student first suggested hard-coded data for Italy; we decided against it because the button says "AI" and the demo must show real AI output that works for any destination.

## What was added (P3 only, built with Claude Code)
- db/schema.cds: new fields aiPlaces and aiHotels (long text).
- srv/ai-insights.js: the same OpenAI call also returns places (4 to 5 sights, "Name: reason") and hotels (4 to 5 real hotels, "Hotel, area: why it fits", no prices). New facts: nights and budget per traveller per night, used to match the hotel class (below 150 EUR simple/mid-range, 150 to 350 EUR 3 to 4 star, above 350 luxury). Unknown destination: empty lists. Customer notes stay untrusted.
- srv/service.js and service.cds: fields saved and refreshed on screen.
- annotations.cds: new section "AI Travel Suggestions (please check before booking)" with "Places to Visit" and "Hotel Suggestions (no prices)".
- Priority, summary and alert unchanged.

## Local test (Mac, real OpenAI)
- Italy (4 people, 4,000 EUR): Colosseum, Venice, Pisa, Florence; hotels in those cities.
- Paris (2 people, 2,500 EUR): first run gave luxury hotels (Le Meurice) that do not fit the budget. Fixed with the budget-per-night rule; second run gave mid-range hotels.
- Vienna wheelchair booking: hotels with accessible rooms (AI also uses the customer notes); priority still High.
- Fake destination "Xyzzy Land": empty lists (nothing invented).

## Deployment
- Safety: Git tag working-before-tips; BAS backup ~/backup-before-tips.tgz.
- The browser controlling BAS lost its connection once; nothing had been sent. Reconnected.
- First deploy stopped: the Cloud Foundry login in BAS had expired ("Authentication has expired"). Nothing changed on BTP. Logged in again with SAP's one-time passcode from the user's SAP session (not saved; terminal history and clipboard cleared).
- Deployed P3 database and server at 15:00 (BAS time); OPENAI_API_KEY, OPENAI_MODEL, FLOW_KEY restored.
- As expected, P3 data was reset to the 12 original sample bookings (test trips TO-5000005 to TO-5000009 removed from P3 only; P2 and P4 keep them).

## End-to-end test on BTP (screenshots evidence/screenshots/travel-tips/01 to 05)
| Step | Result |
|---|---|
| P1: "2 travellers to Rome, 15 to 22 Oct 2027, budget 3,200 EUR", marco.bianchi@example.com | complete, sent, BRQ10016 |
| P2: Read with AI, Approve | Rome, dates, 2 travellers, 3,200 EUR, confidence 90; sales order 5000010; TO-5000010 sent to P3 and P4 |
| P3: TO-5000010 | Marco Bianchi, Rome, Unpaid -> Record Full Payment -> Paid 3,200 |
| P3: Generate AI Insights | priority Low; summary "confirmed and fully paid"; places: Colosseum, Vatican City, Trevi Fountain, Roman Forum; hotels: Hotel Artemide, Hotel Nazionale, Hotel Delle Nazioni, Hotel Quirinale |
| P4: TO-5000010 | same trip; Cancel: 90 % = 2,880 EUR, manager needed; Approve Refund: Refunded |

## Limitations (for the report)
- Hotel names come from the AI's general knowledge and can be outdated or wrong; the section says "please check before booking" and shows no prices or availability.
- For a whole country (e.g. "Italy") the AI spreads suggestions over several cities; a city gives tighter results.
- Long lists are shortened on screen with "Show More" (Fiori default).
