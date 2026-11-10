export const CHANGE_FEE = 50;
export const APPROVAL_LIMIT = 1000;

const today = () => new Date().toISOString().slice(0, 10);

export function daysBetween(fromDate, toDate) {
  return Math.round((Date.parse(toDate) - Date.parse(fromDate)) / 86400000);
}

export function refundPercent(daysBeforeDeparture) {
  if (daysBeforeDeparture >= 30) return 90;
  if (daysBeforeDeparture >= 14) return 50;
  return 0;
}

export function calculateRefund(tripPrice, departureDate, cancelDate = today()) {
  const percent = refundPercent(daysBetween(cancelDate, departureDate));
  const amount = Math.round(Number(tripPrice) * percent) / 100;
  return { percent, amount, approvalNeeded: amount > APPROVAL_LIMIT };
}

export function datesProblem(departureDate, returnDate, currentDate = today()) {
  if (departureDate < currentDate) return 'The new departure date cannot be in the past.';
  if (returnDate <= departureDate) return 'The return date must be after the departure date.';
  return null;
}
