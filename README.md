# TravelOrder AI

SAP university final exam project (Nidhi and Aathrav): AI-assisted sales order processing for travel bookings in SAP S/4HANA.

S/4HANA is simulated with a mock service in the SAP API_SALES_ORDER_SRV format (agreed with the professor). All data is invented sample data.

| # | Project | Folder | Platform |
|---|---|---|---|
| 1 | TravelOrder Assistant (Joule agent + 2 skills) | `project-1-joule-agent/` (design; built in SAP Build Joule Studio) and `code/TravelOrder-Assistant-local/` (local copy to run it: `npm start`) | SAP Build, released 1.0.0, not deployed (students have no shared environment) |
| 2 | TravelOrder Intake: AI reads a booking request and creates a sales order in mock S/4HANA | `code/TravelOrder-AI/` | CAP + Fiori elements, SAP BTP Cloud Foundry, HANA Cloud |
| 3 | Bookings Overview with AI summary and priority | `code/TravelOrder-Overview/` | CAP + Fiori elements, SAP BTP |
| 4 | After-Booking: change dates, cancel, refund, manager approval | `code/TravelOrder-AfterBooking/` | CAP + Fiori elements, SAP BTP |

Start page linking all four projects (run locally):
`cd code/TravelOrder-Assistant-local && npm start`, then open http://localhost:4010/start

Live apps (SAP login required):
- P2: https://e2029c81trial-dev-travelorder-ai.cfapps.us10-001.hana.ondemand.com/travelorderaiintake/index.html
- P3: https://e2029c81trial-dev-travelorder-overview.cfapps.us10-001.hana.ondemand.com/overview/index.html
- P4: https://e2029c81trial-dev-travelorder-afterbooking.cfapps.us10-001.hana.ondemand.com/afterbooking/index.html

Evidence of AI use (prompts, change logs, screenshots): `evidence/`.

Secrets (OpenAI key, BTP service keys) are not in this repository. To run locally, create a `.env` with `OPENAI_API_KEY=...` in the project folder.
