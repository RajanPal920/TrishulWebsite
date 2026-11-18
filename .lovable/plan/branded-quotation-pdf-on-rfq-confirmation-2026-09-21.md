# Branded quotation PDF on RFQ confirmation

## Outcome

Customers can download a polished Trishul Metals & Alloys quotation PDF from the RFQ confirmation page. The document will carry the official logo and company details, show each requested grade, product, size, class/schedule, facing, quantity, processing, certification, and delivery basis, and state **“Landed cost: pending specification review”** rather than inventing a price.

## Build plan

### 1. Capture class and facing separately
- Split the current combined **Class / schedule / facing** input into dedicated **Class / schedule** and **Facing** fields for every RFQ line.
- Preserve existing RFQ prefill behavior for `rating`, add an optional `facing` prefill value, and retain compatibility with previously stored enquiries that do not have a separate facing value.
- Store facing inside each line item alongside the existing grade, product, size, rating, quantity, cut length, and processing details; no new database column is needed because line items are already stored as structured data.

### 2. Create the branded quote PDF template
- Add a dedicated quotation PDF generator using the existing PDF tooling and official Trishul logo.
- Use the established charcoal, gold, and silver document styling with a clear quotation title, RFQ reference, issue date, company contact details, Mumbai office, and Kalamboli warehouse address.
- Include customer/project information, delivery destination and Incoterm, and a line-item table with grade, product, size, class/schedule, facing, quantity, and processing.
- Include certification, testing, attachments, and customer notes when supplied.
- Add a prominent commercial summary showing **“Landed cost: pending specification review”**, plus wording that the document is a preliminary quotation template and not a binding offer until commercial review is completed.
- Keep the existing RFQ acknowledgement PDF available as a separate document and use a distinct quotation filename based on the RFQ reference.

### 3. Link it to the confirmation page
- Add a clearly labelled **Download quotation PDF** action beside the existing acknowledgement download.
- Show class/schedule and facing separately in the confirmation-page item summary.
- Keep the secure confirmation-token lookup and expose no additional customer records.

### 4. Keep customer records consistent
- Update the shared RFQ item types and confirmation mapping for the new facing field.
- Show the separated facing value in the customer dashboard’s RFQ item table while preserving older records.

## Verification

- Submit a representative multi-line RFQ containing grade, size, class, facing, processing, certification, and delivery details.
- Confirm the confirmation page displays the saved values and both PDF downloads work.
- Generate the quotation PDF, render every page to images, and inspect logo quality, table wrapping, page breaks, margins, footer placement, and pending-cost language.
- Test an older RFQ without a facing value, mobile layout, and the clean project build.

## Technical notes

- Reuse the existing logo asset and PDF conventions; no new visual asset is required.
- The landed-cost calculator will not be used to manufacture a price for this document. A numeric price can be added later through a separate authorized staff quotation workflow.
