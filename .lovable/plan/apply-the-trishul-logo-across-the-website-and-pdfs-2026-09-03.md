# Apply the Trishul logo across the website and PDFs

Use the uploaded Trishul Metals & Alloys logo as the official visual brand mark throughout the site and in every user-generated PDF, while retaining the existing gold/graphite theme.

## Website branding

- Upload the supplied logo through the project asset flow and create a reusable brand-logo component with descriptive alt text.
- Replace the current text-only `TRISHUL METALS` lockup in the desktop/mobile header with the full logo, sized responsively without stretching or crowding navigation.
- Replace the text-only footer wordmark with the same logo at an appropriate footer size.
- Replace standalone decorative brand labels with the logo where layout and readability allow; retain written company-name references inside sentences, page titles, contact details, legal copyright text, SEO metadata, and structured data so accessibility and search visibility are not harmed.
- Create a padded square favicon from the logo symbol/mark and update the root favicon reference.

## PDF branding

- Add the logo to the shared PDF header so it automatically appears on every current downloadable PDF: material, product, industry, matrix, comparison, MTC, PMI, TPI, and packing-list documents.
- Preserve the current charcoal header and gold document family, resizing the logo proportionally and repositioning contact/subtitle text so nothing overlaps.
- Keep the company name in PDF body/legal statements only where it conveys document identity or certification context rather than acting as a visual wordmark.
- Load the logo safely before PDF generation and show/download only after the image is ready; keep existing file names and document content unchanged.

## Verification

- Check the header and footer on desktop and mobile for sharp rendering, correct proportions, and no navigation overlap.
- Generate representative portrait and landscape PDFs, render every page to images, and inspect the logo, tables, redactions, page breaks, footer, and margins.
- Confirm all PDF download buttons still work and the project build remains clean.

## Technical notes

- Source asset: the uploaded `logo.png.png`; use the CDN asset pointer for the website and PDF generator.
- The favicon remains a real optimized file in `public/`, as required by browsers.
- The shared PDF helper in `src/lib/datasheet.ts` is the single integration point for all existing generated PDFs.
