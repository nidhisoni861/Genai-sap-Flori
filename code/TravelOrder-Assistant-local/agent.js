// Local copy of the Joule agent "TravelOrder Assistant".
// Expertise and instructions are the same text as in SAP Build Joule Studio.
import { tools, skillFunctions } from './skills.js';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_STEPS = 6;

const EXPERTISE = 'Travel agency back-office assistant for booking requests, cancellations and refunds.';

const INSTRUCTIONS = `You are TravelOrder Assistant for a travel agency. You help staff with cancellations, refunds and booking requests.

REFUNDS: For any refund or cancellation question, call the skill "Calculate Refund" with the trip price (EUR) and the number of days between the cancellation day and the departure date. If the user gives dates instead of days, calculate the days first. If the price or the days are not given, leave them empty; when the skill returns an empty refund rule, ask the user for the missing information and do not give an amount.
Then calculate the refund amount: trip price x refund percent / 100 (use the Calculator). If the refund amount is over 1,000 EUR, say that a manager must approve it. 1,000 EUR or less needs no manager approval.
Rules: 30 or more days before departure: 90 percent. 14 to 29 days: 50 percent. Under 14 days: 0 percent, the booking is cancelled without refund. A date change costs 50 EUR.

BOOKING REQUESTS: For every booking request, also a new or changed one in the same chat, call the skill "Check Booking Request". Never decide without calling it. Send dates as YYYY-MM-DD, travellers and budget as plain numbers; leave a value empty if the user did not give it. The skill returns true/false for: Departure Date Valid, Return Date Valid, Return After Departure, Travellers Valid, Budget Valid.
The result also contains "problems" (a list) and "result". Report exactly the items in "problems", nothing more; if the list is empty, say "complete and ready for review".
Go through all five values one by one. Every false value is a problem; report it in plain words: Departure Date Valid false = "departure date missing or wrong", Return Date Valid false = "return date missing or wrong", Return After Departure false = "return date must be after the departure date", Travellers Valid false = "number of travellers missing or below 1", Budget Valid false = "budget missing or negative". Use Return After Departure only when both dates are valid. Only if all five values are true, say "complete and ready for review".

You only give suggestions; a person always makes the final decision. Never invent data; if information is missing, ask for it. Answer short and clear in English.

Example: "Trip 1,500 EUR, cancelled 40 days before departure" -> 90 percent = 1,350 EUR, manager approval needed.`;

// Tool names in this local copy: "Calculate Refund" = calculateRefund,
// "Check Booking Request" = checkBookingRequest, Calculator = calculator.
const SYSTEM = `Expertise: ${EXPERTISE}\n\n${INSTRUCTIONS}\n\nTool names: "Calculate Refund" = calculateRefund, "Check Booking Request" = checkBookingRequest, Calculator = calculator. Today is ${new Date().toISOString().slice(0, 10)}.`;

async function callModel(messages, mustUseTool = false) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      messages,
      tools,
      tool_choice: mustUseTool ? 'required' : 'auto',
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI request failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
  }
  return (await res.json()).choices[0].message;
}

// Turns the five true/false values of "Check Booking Request" into plain problems,
// so the model does not have to read the true/false values itself (it sometimes misread them).
// This is the "list of problems" output from the original design, which classic Joule skills
// could not build; in the Joule agent the same step is done by the agent instructions.
const PROBLEM_TEXT = {
  departureDateValid: 'departure date missing or wrong (use YYYY-MM-DD)',
  returnDateValid: 'return date missing or wrong (use YYYY-MM-DD)',
  returnAfterDeparture: 'return date must be after the departure date',
  travellersValid: 'number of travellers missing or below 1',
  budgetValid: 'budget missing or negative',
};

function withProblems(output) {
  const bothDates = output.departureDateValid && output.returnDateValid;
  const problems = Object.entries(PROBLEM_TEXT)
    .filter(([key]) => output[key] === false && (key !== 'returnAfterDeparture' || bothDates))
    .map(([, text]) => text);
  return { ...output, problems, result: problems.length ? 'not complete' : 'complete and ready for review' };
}

// A question with numbers (price, days, dates) must go through a skill first.
function needsSkill(history) {
  const last = [...history].reverse().find((m) => m.role === 'user');
  return /\d/.test(last?.content ?? '');
}

// history: [{ role: 'user' | 'assistant', content: string }]
// Returns the answer plus every skill call, so the page can show which skill was used.
export async function ask(history) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is missing in .env');
  const messages = [{ role: 'system', content: SYSTEM }, ...history];
  const toolCalls = [];

  const forceFirst = needsSkill(history);
  for (let step = 0; step < MAX_STEPS; step++) {
    const msg = await callModel(messages, forceFirst && step === 0);
    messages.push(msg);
    if (!msg.tool_calls?.length) {
      return { reply: msg.content, toolCalls };
    }
    for (const call of msg.tool_calls) {
      const fn = skillFunctions[call.function.name];
      let args = {};
      let output;
      try {
        args = JSON.parse(call.function.arguments || '{}');
        output = fn ? fn(args) : { error: 'Unknown tool' };
        if (call.function.name === 'checkBookingRequest') output = withProblems(output);
      } catch (err) {
        output = { error: err.message };
      }
      toolCalls.push({ name: call.function.name, input: args, output });
      messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(output) });
    }
  }
  return { reply: 'Sorry, I could not finish this request. Please ask again.', toolCalls };
}
