# RFQ quotation workflow, client dashboard, and production launch

## Outcome

Customers will submit one RFQ, receive a reference and downloadable branded acknowledgement PDF, and land on a dedicated confirmation page. The submission will be stored, emailed to the Trishul inbox, and visible to that customer in a secure dashboard alongside order history and certificates.

The acknowledgement and confirmation page will show **“Estimated landed cost: pending specification review”**. They will not present an automatic or binding price.

## Build plan

### 1. Secure customer accounts and company profiles
- Enable email/password sign-in and Google sign-in, with self-registration and email verification.
- Add a public `/auth` page with sign-in, registration, forgot-password flow, and a required public `/reset-password` page.
- Create a customer `profiles` table for company and contact details, automatically created on registration and editable by the account owner only.
- Move the dashboard behind the managed authenticated route guard and protect every customer-data server function independently.
- Make header/homepage account links session-aware and provide secure sign-out with protected-data cache clearing.

### 2. Connect RFQs to customers and the dashboard
- Extend RFQ records with a stable public reference and optional authenticated owner ID, while retaining email matching for submissions made before login.
- Add owner-only policies and authenticated server functions so customers can see only RFQs belonging to their verified account/email.
- Add an **RFQs** area to the dashboard with status, submitted items, testing/certification requirements, attachment names, and acknowledgement download.
- Preserve the existing order-history and certificate areas, but route access and reads through the protected dashboard architecture.
- Make certificate files downloadable through short-lived signed links when a private storage path exists; retain the request-copy action when no file is stored.

### 3. Real inbox delivery and acknowledgement PDF
- Reuse the project’s existing email service to notify `contactustrishul@gmail.com` after every successfully stored RFQ.
- Include reference, customer/company details, project and delivery details, every line item, processing, testing/certification, and uploaded filenames in the email.
- Generate a branded, logo-bearing RFQ acknowledgement PDF from the stored server-validated record, clearly marked **not a quotation or binding offer** and **commercial pricing pending specification review**.
- Provide the PDF from the confirmation page and dashboard through an authenticated or reference-bound download path; never accept arbitrary storage paths from the browser.
- Keep database persistence as the source of truth: if email delivery fails, preserve the RFQ and show a successful submission while logging the notification failure for follow-up.

### 4. Dedicated quote confirmation page
- After submission, navigate to `/rfq/confirmation` using a non-guessable confirmation token/reference rather than rendering success inside the form.
- Show the submitted customer details, selected grade/product/size/quantity, processing, certification, attachments received, and the explicit landed-cost status **pending specification review**.
- Add acknowledgement PDF download, dashboard/sign-in, and contact actions.
- Prevent the page from exposing another customer’s RFQ and mark it `noindex`.

### 5. Database and security changes
- Add `profiles` with explicit grants, RLS, owner policies, and an auth-signup trigger.
- Extend `rfq_requests` additively for customer ownership, stable reference, confirmation access, and status; do not alter existing submissions destructively.
- Add narrowly scoped grants and policies for owner RFQ reads and staff reads; keep public insert blocked because submission continues through validated server code.
- Use authenticated user access for ordinary dashboard reads and privileged access only for RFQ intake, email orchestration, and secure file signing.

### 6. Verification and launch
- Test registration, email verification state, email/password and Google login, password reset, session-aware navigation, sign-out, and unauthorized access.
- Submit a real multi-line RFQ with an attachment; confirm database persistence, inbox notification attempt, confirmation details, PDF contents/logo, and dashboard appearance.
- Visually inspect every generated PDF page for clipping, overlap, logo quality, and readable tables.
- Verify order and certificate isolation, signed document downloads, responsive layouts, reduced motion, keyboard focus, no overflow, and clean build.
- Publish the latest site so Privacy Policy, Terms, motion updates, and the new customer workflow are live.
- Connect `www.trishulmetal.com` to this project and verify DNS/SSL. The domain currently points elsewhere and is not connected here, so final cutover may require the domain owner to approve or update DNS records shown by the connection flow.

## Technical notes

- Continue using the existing RFQ form, private upload bucket, order/certificate tables, PDF tooling, and graphite/gold design system.
- Keep the existing single RFQ submission pipeline; no duplicate upload or submit path.
- Treat RFQ acknowledgement PDFs separately from later staff-issued commercial quotations.
- No team, employee, or staff biography content will be changed.