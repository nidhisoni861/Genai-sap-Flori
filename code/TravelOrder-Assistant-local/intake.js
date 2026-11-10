// Sends a checked booking request to TravelOrder Intake (Project 2) on SAP BTP.
// Address and key come from .env (INTAKE_FLOW_URL, FLOW_KEY); nothing secret is in the code.

export async function sendToIntake({ message, senderEmail }) {
  const url = process.env.INTAKE_FLOW_URL;
  const key = process.env.FLOW_KEY;
  if (!url || !key) throw new Error('INTAKE_FLOW_URL or FLOW_KEY is missing in .env');
  if (!message?.trim()) throw new Error('The request text is empty.');

  const res = await fetch(`${url.replace(/\/$/, '')}/odata/v4/flow/receiveRequest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-flow-key': key },
    body: JSON.stringify({
      subject: 'Request from TravelOrder Assistant',
      message: message.trim(),
      senderEmail: senderEmail?.trim() || 'customer@example.com',
    }),
    signal: AbortSignal.timeout(20000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Intake answered ${res.status}: ${text.slice(0, 200)}`);
  return { requestNumber: JSON.parse(text).value };
}
