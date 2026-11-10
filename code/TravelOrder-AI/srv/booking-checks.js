const REQUIRED = [
  ['destination', 'destination'],
  ['departureDate', 'exact departure date'],
  ['returnDate', 'exact return date'],
  ['numberOfTravellers', 'number of travellers'],
  ['budget', 'budget'],
  ['currency', 'currency']
];

const isBlank = value => value === null || value === undefined || value === '';

export function checkBooking(booking, today = new Date().toISOString().slice(0, 10)) {
  const { departureDate, returnDate, numberOfTravellers, budget } = booking;
  const missing = REQUIRED.filter(([field]) => isBlank(booking[field])).map(([, label]) => label);
  const problems = [];

  if (!isBlank(departureDate) && departureDate < today) problems.push('departure date is in the past');
  if (!isBlank(departureDate) && !isBlank(returnDate) && returnDate <= departureDate) {
    problems.push('return date must be after departure date');
  }
  if (!isBlank(numberOfTravellers) && numberOfTravellers < 1) problems.push('number of travellers must be at least 1');
  if (!isBlank(budget) && budget <= 0) problems.push('budget must be greater than 0');

  return [...missing.map(label => `missing: ${label}`), ...problems];
}
