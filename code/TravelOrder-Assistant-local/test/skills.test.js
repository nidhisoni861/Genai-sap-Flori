// Checks the two skill copies with the planned test cases from project-1-joule-agent/design.md.
// No AI needed: these are the fixed business rules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateRefund, checkBookingRequest, calculator } from '../skills.js';

const rule = (days) => calculateRefund({ tripPrice: '1000', daysBeforeDeparture: String(days) }).refundRule;

test('refund bands (tests 1, 2, 3, 6 and boundaries)', () => {
  assert.match(rule(40), /90 percent/); // tests 1 and 6
  assert.match(rule(30), /90 percent/);
  assert.match(rule(29), /50 percent/);
  assert.match(rule(20), /50 percent/); // test 2
  assert.match(rule(14), /50 percent/);
  assert.match(rule(13), /0 percent/);
  assert.match(rule(5), /0 percent/); // test 3
  assert.match(rule(0), /0 percent/);
});

test('refund: missing or negative days give no rule (Joule Default branch)', () => {
  assert.equal(rule(''), '');
  assert.equal(rule(-3), '');
  assert.equal(rule('abc'), '');
});

test('calculator: refund amounts', () => {
  assert.equal(calculator({ expression: '1500 * 90 / 100' }).result, 1350); // test 1: over 1000, manager
  assert.equal(calculator({ expression: '800 * 50 / 100' }).result, 400); // test 2
  assert.equal(calculator({ expression: '1100 * 90 / 100' }).result, 990); // test 6: 1000 or less, no manager
  assert.ok(calculator({ expression: 'process.exit()' }).error);
});

test('booking check: test 4, return date missing', () => {
  const r = checkBookingRequest({ departureDate: '2027-07-12', returnDate: '', numberOfTravellers: '2', budget: '3000' });
  assert.deepEqual(r, { departureDateValid: true, returnDateValid: false, returnAfterDeparture: true, travellersValid: true, budgetValid: true });
});

test('booking check: test 5, return before departure', () => {
  const r = checkBookingRequest({ departureDate: '2027-07-20', returnDate: '2027-07-10', numberOfTravellers: '2', budget: '2000' });
  assert.equal(r.returnAfterDeparture, false);
  assert.equal(r.departureDateValid && r.returnDateValid && r.travellersValid && r.budgetValid, true);
});

test('booking check: complete request', () => {
  const r = checkBookingRequest({ departureDate: '2027-07-12', returnDate: '2027-07-19', numberOfTravellers: '2', budget: '3000.50' });
  assert.ok(Object.values(r).every(Boolean));
});

test('booking check: travellers and budget rules', () => {
  const base = { departureDate: '2027-07-12', returnDate: '2027-07-19' };
  assert.equal(checkBookingRequest({ ...base, numberOfTravellers: '0', budget: '100' }).travellersValid, false);
  assert.equal(checkBookingRequest({ ...base, numberOfTravellers: '', budget: '100' }).travellersValid, false);
  assert.equal(checkBookingRequest({ ...base, numberOfTravellers: '2', budget: '-5' }).budgetValid, false);
  assert.equal(checkBookingRequest({ ...base, numberOfTravellers: '2' }).budgetValid, false);
  assert.equal(checkBookingRequest({ ...base, departureDate: '12.07.2027', numberOfTravellers: '2', budget: '1' }).departureDateValid, false);
});
