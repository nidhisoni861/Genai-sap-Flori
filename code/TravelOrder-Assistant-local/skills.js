// Local copies of the two Joule skills built in SAP Build (project "AI Travel Advisor").
// The rules match the Joule versions step by step, so the agent behaves the same way.

// Skill 1: Calculate Refund
// Joule: inputs are text, step "Convert Days" turns days into a number,
// condition "Refund Band" picks the first true branch (>= 30, >= 14, >= 0),
// output is the Refund Rule text. The agent calculates the amount itself.
export function calculateRefund({ tripPrice, daysBeforeDeparture }) {
  const raw = String(daysBeforeDeparture ?? '').trim();
  const days = raw === '' ? NaN : Number(raw); // empty must not count as 0 days
  let refundRule = '';
  if (Number.isFinite(days)) {
    if (days >= 30) {
      refundRule = 'Refund 90 percent of the trip price. A refund over 1000 EUR needs manager approval.';
    } else if (days >= 14) {
      refundRule = 'Refund 50 percent of the trip price. A refund over 1000 EUR needs manager approval.';
    } else if (days >= 0) {
      refundRule = 'No refund (0 percent). The booking is cancelled without refund.';
    }
  }
  // Like the Joule "Default" branch: no rule for missing or negative days.
  return { refundRule, tripPrice: String(tripPrice ?? '') };
}

// Skill 2: Check Booking Request
// Joule: step "Find Problems" checks the text inputs with MatchesRegExp,
// then "Check Date Order" runs only when both dates are valid.
const DATE = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
const TRAVELLERS = /^[1-9][0-9]*$/;
const BUDGET = /^[0-9]+([.][0-9]+)?$/;

function text(value) {
  return value === undefined || value === null ? '' : String(value).trim();
}

function daysBetween(start, end) {
  // Same as SAP DifferenceInDaysForDate(start, end): end minus start in days.
  const [y1, m1, d1] = start.split('-').map(Number);
  const [y2, m2, d2] = end.split('-').map(Number);
  return (Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000;
}

export function checkBookingRequest({ departureDate, returnDate, numberOfTravellers, budget }) {
  const dep = text(departureDate);
  const ret = text(returnDate);
  const departureDateValid = DATE.test(dep);
  const returnDateValid = DATE.test(ret);
  let returnAfterDeparture = true; // start value, as in Joule
  if (departureDateValid && returnDateValid) {
    returnAfterDeparture = daysBetween(dep, ret) > 0;
  }
  return {
    departureDateValid,
    returnDateValid,
    returnAfterDeparture,
    travellersValid: TRAVELLERS.test(text(numberOfTravellers)),
    budgetValid: BUDGET.test(text(budget)),
  };
}

// Joule built-in tool: Calculator. Only numbers, + - * / and brackets are allowed.
export function calculator({ expression }) {
  const expr = text(expression);
  if (!/^[0-9+\-*/(). ]+$/.test(expr)) {
    return { error: 'Only numbers and + - * / ( ) are allowed.' };
  }
  const result = Function(`"use strict"; return (${expr});`)();
  if (!Number.isFinite(result)) return { error: 'Not a valid calculation.' };
  return { result: Math.round(result * 100) / 100 };
}

// Tool definitions sent to the model. All inputs are strings, like the Joule agent tools.
export const tools = [
  {
    type: 'function',
    function: {
      name: 'calculateRefund',
      description: 'Calculates the refund for a cancelled travel booking from the trip price and the days before departure.',
      parameters: {
        type: 'object',
        properties: {
          tripPrice: { type: 'string', description: 'Trip price in EUR; empty if not given' },
          daysBeforeDeparture: { type: 'string', description: 'Days between the cancellation day and the departure date; empty if the user did not give days or dates. Never guess.' },
        },
        required: ['tripPrice', 'daysBeforeDeparture'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'checkBookingRequest',
      description: 'Checks if a travel booking request is complete: dates, number of travellers and budget.',
      parameters: {
        type: 'object',
        properties: {
          departureDate: { type: 'string', description: 'Departure date, format YYYY-MM-DD; empty if not given' },
          returnDate: { type: 'string', description: 'Return date, format YYYY-MM-DD; empty if not given' },
          numberOfTravellers: { type: 'string', description: 'How many people travel; empty if not given' },
          budget: { type: 'string', description: 'Budget in EUR; empty if not given' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Calculates a simple arithmetic expression, for example "1500 * 90 / 100".',
      parameters: {
        type: 'object',
        properties: { expression: { type: 'string' } },
        required: ['expression'],
      },
    },
  },
];

export const skillFunctions = { calculateRefund, checkBookingRequest, calculator };
