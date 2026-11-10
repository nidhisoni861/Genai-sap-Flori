// Sends an approved trip to Bookings Overview (Project 3) and After-Booking (Project 4).
// The same booking number is used everywhere: TO-<S/4HANA sales order>.
// URLs and key come from BTP environment variables, so nothing secret is in the code.

function nameFromEmail(email) {
  const local = String(email || '').split('@')[0];
  const name = local.split(/[._-]+/).filter(Boolean).map(p => p[0].toUpperCase() + p.slice(1)).join(' ');
  return name || 'Customer';
}

export function tripFromRequest(booking, salesOrder) {
  return {
    bookingNumber: `TO-${salesOrder}`,
    customerName: nameFromEmail(booking.senderEmail),
    customerEmail: booking.senderEmail,
    destination: booking.destination,
    departureDate: booking.departureDate,
    returnDate: booking.returnDate,
    numberOfTravellers: booking.numberOfTravellers,
    // Intake only knows the customer's budget; it is used as the trip price.
    totalPrice: booking.budget,
    currency: booking.currency || 'EUR',
    notes: booking.originalMessage
  };
}

async function send(url, trip) {
  const res = await fetch(`${url.replace(/\/$/, '')}/odata/v4/flow/receiveBooking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-flow-key': process.env.FLOW_KEY },
    body: JSON.stringify(trip),
    signal: AbortSignal.timeout(15000)
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 150)}`);
}

// Returns one line per target; never throws, so the sales order is never undone.
export async function forwardTrip(booking, salesOrder) {
  const trip = tripFromRequest(booking, salesOrder);
  const targets = [
    ['Bookings Overview', process.env.FLOW_OVERVIEW_URL],
    ['After-Booking', process.env.FLOW_AFTERBOOKING_URL]
  ];
  const results = [];
  for (const [name, url] of targets) {
    if (!url || !process.env.FLOW_KEY) {
      results.push({ name, ok: false, message: `${name}: not configured` });
      continue;
    }
    try {
      await send(url, trip);
      results.push({ name, ok: true, message: `${name}: booking ${trip.bookingNumber} sent` });
    } catch (error) {
      results.push({ name, ok: false, message: `${name}: ${error.message}` });
    }
  }
  return { bookingNumber: trip.bookingNumber, results };
}
