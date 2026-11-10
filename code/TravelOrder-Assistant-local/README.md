# TravelOrder Assistant: local copy (Project 1)

The real Project 1 is a Joule agent built in SAP Build Joule Studio (project "AI Travel Advisor", released 1.0.0). Students cannot deploy it, because AI skills need a shared environment that only a tenant administrator can create. This folder is a **local copy** of that agent, so it can be shown working.

What is the same as in Joule:
- Agent expertise and instructions (same text).
- Skill "Calculate Refund" (`calculateRefund`): 30+ days 90 %, 14 to 29 days 50 %, under 14 days 0 %.
- Skill "Check Booking Request" (`checkBookingRequest`): the same five true/false checks with the same patterns.
- Tool "Calculator".
- All tool inputs are text, like the Joule agent tools.

What is different: the model runs through the OpenAI API (gpt-4o-mini, as in Projects 2 and 3), not through Joule.

## Run
1. Create `.env` with `OPENAI_API_KEY=...` (never commit it).
2. `npm test` checks the skill rules (no AI needed).
3. `npm start`, then open http://localhost:4010

Each answer shows which skill was called, with its input and output.
