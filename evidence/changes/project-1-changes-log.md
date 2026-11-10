# Project 1: Joule Skill and Agent, build log

Tenant: SAP Build eu10 Trial 2 (university), project "AI Travel Advisor", Joule Studio classic edition.
SAP notice: GenAI features in Joule Studio will no longer be available from January 2027.

## Step 19: design
project-1-joule-agent/design.md (agent purpose, 2 skills, instructions, 6 planned tests).

## Step 20: skill "Calculate Refund" (in progress, 10 Nov 2026)
Done and saved:
- Skill created (identifier calculateRefund).
- Inputs: Trip Price, Days Before Departure, both Number and required.
- Condition step "Refund Band": 30 days or more (days >= 30), 14 to 29 days (days >= 14), Under 14 days (days >= 0); first true branch wins.
- Outputs: Refund Percent (Number), Refund Amount (Number), Refund Rule (String).

Problems met:
- Input type stayed "String" and could not be changed while "Allow skill to be started directly by a user" was on. Turning it off made the type editable; inputs were recreated as Number.
- Clicking "Add Branch" several times created extra branches; the canvas shows two unnamed "If 2" branches that the side panel does not list. To check and remove.
- I (Claude) clicked the toolbar trash icon by mistake and deleted the condition step; it was not saved, and "Don't Save" restored the saved version.
- Output description limit is 50 characters.

Still to do: values per branch (Set Variables), map the outputs at End, check the extra branches, test.

## Step 20 finished (10 Nov 2026), simplified design (option C, chosen by the student)
- Outputs reduced to one: Refund Rule (String). Refund Percent and Refund Amount were removed: classic Joule skills cannot calculate the amount without a formula or an action, so the agent calculates price x percent from its instructions.
- Skill variable Rule Text (String).
- Each branch has a Set Variables step:
  - 30 days or more: "refund 90 percent ... over 1000 EUR needs a manager"
  - 14 to 29 days: "refund 50 percent ... over 1000 EUR needs a manager"
  - Under 14 days: "no refund (0 percent), booking cancelled"
- End step: Refund Rule = Rule Text. Design Console: 0 errors, 0 warnings. Saved.
- Test: "A test package cannot be created ... No Joule skill scenario is triggerable or there is no Joule agent." Expected, because the skill is meant to be called by the agent (Step 22). The skill will be tested through the agent.
- Not resolved: the canvas still draws two unnamed "If 2" branches that the condition panel does not list; the console reports no errors for them. To check at the agent test.

## Step 22: agent tools (10 Nov 2026)
Problem: Add Tool > Joule Skill said the skill was "not usable as tool because they have non-string parameters" (screenshot 07). Agent tools only accept skills whose inputs are all text.

Fix in the skill "Calculate Refund":
- Both inputs (Trip Price, Days Before Departure) changed from Number to String.
- New skill variable Days Number (Number).
- New first step "Convert Days" (Set Variables): Days Number = StringToNumber(Days Before Departure), built in the formula editor (screenshot 08).
- The three Refund Band conditions now compare Days Number instead of the text input: >= 30, >= 14, >= 0.
- Saved, Design Console 0 errors (screenshot 09).

Agent "TravelOrder Assistant":
- Tools added: Joule Skill "Calculate Refund" and Calculator (for price x percent). Saved, 0 errors (screenshot 10).

Problems met:
- In the condition editor, typing a value did not reach the field (it went to the search box), and pressing Escape closed the whole dialog without saving. Fixed by entering the value directly in the value field and pressing Apply.
- The earlier "Edit" button on the agent only renames it; cancelled without change.

Test: pressing Test asks for an Environment, and the list is empty (screenshot 11). The agent cannot be run in this tenant until an environment exists. Next options: check whether Release + Deploy (Step 23) creates one, or ask the tenant admin / professor.

## Step 21: skill "Check Booking Request" (10 Nov 2026)
- Skill created (identifier checkBookingRequest), started only by the agent (direct start by user switched off).
- Inputs, all text and optional (agent tools accept only text): Departure Date, Return Date, Number Of Travellers, Budget.
- Variables (true/false): Departure OK, Return OK, Travellers OK, Budget OK, Order OK. (Text variable Problems is set but not used in the end.)
- Step "Find Problems" (Set Variables) with formulas:
  - Departure OK = MatchesRegExp(Departure Date, "^[0-9]{4}-[0-9]{2}-[0-9]{2}$")
  - Return OK = same pattern on Return Date
  - Travellers OK = MatchesRegExp(Number Of Travellers, "^[1-9][0-9]*$")  (missing, 0 or negative = false)
  - Budget OK = MatchesRegExp(Budget, "^[0-9]+([.][0-9]+)?$")  (missing or negative = false)
  - Order OK = true as a start value
- Condition "Both Dates Given": if Departure OK and Return OK are true, step "Check Date Order" sets
  Order OK = IsGreaterThan(DifferenceInDaysForDate(DateFromISO(Departure Date), DateFromISO(Return Date)), 0)
- Outputs (true/false): Departure Date Valid, Return Date Valid, Return After Departure, Travellers Valid, Budget Valid. Saved, Design Console 0 errors (screenshot 12).
- Agent: tool "Check Booking Request" added (now 3 tools, screenshot 13). Instructions extended: send dates as YYYY-MM-DD, report each false value in plain words, use Return After Departure only when both dates are valid, otherwise "complete and ready for review".

Design change and why:
- Planned output was one text listing the problems. ConcatenateStrings does not accept true/false values ("The result should be of type string"), and classic skills have no IF function, so a combined text was not possible without many branches. The skill now returns five true/false results and the agent writes the message.

Mistakes and fixes:
- A script that mapped the five End outputs in one go shifted them by one row (for example Departure Date Valid got Order OK). Found in the screenshot, all five mappings removed and set again one by one, then checked.
- Pressing Escape in the formula editor closes it without saving (same as Step 22); the formula was entered again.

## Step 23: release and deploy (10 Nov 2026)
- Released version 1.0.0 with a release note (screenshot 14). The version contains 3 artifacts: Calculate Refund, Check Booking Request, TravelOrder Assistant.
- Deploy: the only environment offered is "Public". SAP refused: "cannot be deployed in the default environment because it contains an AI Skill artifact, which can only be deployed in a shared environment" (screenshot 15). SAP also notes the public environment will be deprecated (SAP Note 3522611).
- Result: not deployed. A shared environment must be created by a tenant administrator (SAP Build Control Tower > Environments). The student account cannot create it. Same reason why Test showed an empty environment list (Step 22).
- Not done: live test of the agent (planned tests 1 to 6).
- Update (10 Nov 2026): the student asked the professor. Students have no access to create a shared environment or deploy in the university tenant. Project 1 ends at "built and released 1.0.0, not deployed"; the reason is shown in screenshot 15.
