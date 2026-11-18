# Downloadable sample MTC (PDF)

Make the redacted EN 10204 3.1 specimen certificate available as a branded PDF download, alongside the on-page version.

## What changes

- A "Download specimen certificate (PDF)" button on the sample MTC card (shown on the Quality page and anywhere the specimen appears).
- The PDF mirrors the on-screen certificate exactly: header with company details and certificate number, "SPECIMEN — CUSTOMER DATA REDACTED" stamp, order/material summary block, chemical composition table, mechanical properties table, tests & NDT results, and the declaration/signature footer.
- Redacted fields render as solid grey bars in the PDF, same as on screen, so nothing customer-identifying is exposed.
- Styling matches the existing gold/graphite datasheet PDFs already generated for alloy grades and products, so it reads as one document family.

## Technical notes

- Move the certificate's data arrays (summary fields, chemistry, mechanicals, tests) out of `src/components/site/MtcSample.tsx` into a shared data module so the component and the PDF generator use one source.
- Add `downloadMtcSpecimen()` to `src/lib/datasheet.ts` using the existing jsPDF + autoTable helpers (`header`, `heading`, `table`, `footer`), with grey filled rectangles for redacted values.
- Add the download button to `MtcSample.tsx` using the same button styling as the other datasheet download controls.
- File name: `Trishul-Metals-Specimen-MTC-EN10204-3.1.pdf`.
- QA: generate the PDF, render its page to an image and inspect for clipped tables, overflow and correct redaction before finishing.
