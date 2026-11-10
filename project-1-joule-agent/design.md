# Project 1: TravelOrder Assistant (Joule Agent and Skills), Design

## Where
SAP Build (university tenant "SAP Build - eu10 - Trial - 2"), Joule Studio, classic edition.
Project: **AI Travel Advisor** (owner: student account GE390282).
Note: SAP shows that Generative AI features in Joule Studio will no longer be available from January 2027.

## Business purpose
Travel agency staff ask questions in normal language ("How much refund if…?", "Is this request complete?").
The Joule agent answers by calling skills that apply the same business rules as the other TravelOrder AI apps:
- Project 2 (booking request checks before a sales order is created)
- Project 4 (refund rules after a cancellation)

The agent only gives suggestions. A person always decides.

## Skill 1: Calculate Refund
| Input | Type | Required |
|---|---|---|
| tripPrice | String (EUR) | yes |
| daysBeforeDeparture | String | yes |

As built: inputs are text because agent tools only accept text inputs. The first step converts the days to a number (StringToNumber) for the rule checks.

Rules (same as Project 4):
- 30 days or more: 90 %
- 14 to 29 days: 50 %
- under 14 days: 0 %, booking cancelled without refund
- refund over 1,000 EUR: manager approval needed

Output (as built): Refund Rule, a text naming the rule (90 / 50 / 0 percent) and the manager approval rule. The agent calculates the amount (price x percent), because classic Joule skills cannot calculate it without an extra action.

## Skill 2: Check Booking Request
| Input | Type | Required |
|---|---|---|
| departureDate | String (YYYY-MM-DD) | no |
| returnDate | String (YYYY-MM-DD) | no |
| numberOfTravellers | String | no |
| budget | String (EUR) | no |

Checks (same as Project 2):
- departure date missing
- return date missing
- return date not after departure date
- number of travellers missing or below 1
- budget missing or negative

Output (as built): five true/false values: departureDateValid, returnDateValid, returnAfterDeparture, travellersValid, budgetValid. The agent turns every false value into a plain-language problem, or says "complete and ready for review". (Classic skills cannot join true/false values into one text.)

## Agent: TravelOrder Assistant
Description: Helps travel agency staff with booking requests, cancellations and refunds.

Instructions:
```
You are TravelOrder Assistant for a travel agency. You help staff check booking requests and calculate refunds.
Use the skill "Calculate Refund" for any refund or cancellation question.
Use the skill "Check Booking Request" to check if a booking request is complete.
Rules: refund 90% if 30 or more days before departure, 50% for 14 to 29 days, 0% under 14 days. Refunds over 1,000 EUR need manager approval. A date change costs 50 EUR.
You only give suggestions; a person always makes the final decision. Never invent data. Answer short and clear in English.
```

## Planned tests
| # | Question | Expected |
|---|---|---|
| 1 | A customer cancels a 1,500 EUR trip 40 days before departure. How much refund? | 90 % = 1,350 EUR, manager approval needed |
| 2 | Trip 800 EUR, cancelled 20 days before departure. | 50 % = 400 EUR, no approval |
| 3 | Trip 600 EUR, cancelled 5 days before departure. | 0 %, cancelled without refund |
| 4 | Request: 2 travellers, departure 12 July 2027, no return date, budget 3,000 EUR. | Missing: return date |
| 5 | Request: departure 20 July 2027, return 10 July 2027, 2 travellers, budget 2,000 EUR. | Return date must be after departure |
| 6 | Trip 1,100 EUR, cancelled 40 days before departure. | 90 % = 990 EUR, no approval (1,000 or less) |

## Data
Invented sample values only. No personal data (shared university tenant).
