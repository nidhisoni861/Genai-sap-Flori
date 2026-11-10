# Project 4: After-Booking App, Requirements

## Business problem
After a trip is booked, travel agency staff must handle date changes, cancellations and refunds. Doing this by hand leads to inconsistent fees and refunds, and no clear record of who decided what.

## Users
- **Travel agent:** views bookings, changes dates, requests cancellations.
- **Manager:** approves large refunds.

## Business rules decided by the team

| # | Topic | Rule |
|---|---|---|
| 1 | Refund on cancellation | 30 or more days before departure: 90%. 14 to 29 days: 50%. Under 14 days: 0% |
| 2 | Change fee | EUR 50 for every change, regardless of how far away departure is |
| 3 | What can be changed | Travel dates only |
| 4 | Refund approval | Refunds over EUR 1,000 need manager approval |
| 5 | Booking statuses | Confirmed, Changed, Cancellation Requested, Cancelled, Refunded |

## Confirmed details
- The refund percentage applies to the trip price. Change fees already paid are not refunded.
- A refund of EUR 1,000 or less does not need manager approval; above EUR 1,000 it does (for example EUR 1,001).
- Cancelled and Refunded bookings cannot be changed.

- Days before departure are counted from the day the customer cancels, not from the booking date.

## Validation
- The return date must be after the departure date, and a new departure date cannot be in the past.

## Screens
- **Bookings list:** filters for status, destination and departure date; shows booking number, customer, destination, departure and status.
- **Booking details:** customer, trip, dates, price, change fees, refund amount and history of every change.
- **Buttons:** Change Dates, Cancel Booking, Approve Refund.

## Backend
A CAP OData service with its own database on SAP BTP. S/4HANA is not required for this project.
