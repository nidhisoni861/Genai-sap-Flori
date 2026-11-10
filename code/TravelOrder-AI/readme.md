# Getting Started

Welcome to your new CAP project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`readme.md` | this getting started guide

## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start with your domain model, in a CDS file in `db/`

## Learn More

Learn more at <https://cap.cloud.sap>.


This CAP project and the included SAP Fiori application were generated with the Project Accelerator, using the prompt: Build an SAP CAP application with an SAP Fiori elements UI called &quot;TravelOrder AI Intake&quot;.

Business purpose:
Travel agency staff receive booking requests from customers by email. The application helps staff review each request, correct it, and approve it before it becomes a sales order in SAP S&#x2F;4HANA.

Entity: BookingRequest
- requestNumber
- receivedAt
- senderEmail
- subject
- originalMessage (long text)
- language
- customerNumber
- tripProductCode
- destination
- departureDate
- returnDate
- numberOfTravellers
- budget and currency
- missingInformation (long text)
- aiRecommendation (long text)
- aiConfidence (decimal, 0 to 100)
- reviewerComment (long text)
- status: New, Needs Information, Ready for Review, Approved, Rejected, Order Created, Failed
- salesOrderNumber
- errorMessage (long text)

Entity: AuditEntry, linked to BookingRequest
- timestamp
- performedBy
- action
- fieldName
- aiValue
- finalValue

User interface:
- List page with filters for status, destination, departure date and received date.
- Object page showing the original message, extracted booking details, AI recommendation, review result and audit history.
- Colour the status field by its state.

Actions on BookingRequest:
- Approve: only when status is Ready for Review. Sets status to Approved.
- Reject: requires a reviewer comment. Sets status to Rejected.
- Request Information: sets status to Needs Information.

Validation:
- Return date must be after departure date.
- Number of travellers must be at least 1.
- Budget must not be negative.

Include realistic sample data for 10 booking requests using invented customers and example.com email addresses, covering every status.
Do not include real personal data..
