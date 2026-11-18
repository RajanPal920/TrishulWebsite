# NORSOK M-630 — accurate compliance positioning across the site

Add NORSOK M-630 alongside ASTM / ASME / NACE wherever it is technically defensible, framed strictly as a **specification materials can be sourced against** — never as a certification Trishul holds.

## Guardrails on wording

Approved phrases only:

- Short / inline: "and applicable NORSOK M-630 requirements"
- Standards chip: "NORSOK M-630 (on specification)"
- Standard sentence: "Materials available against applicable NORSOK M-630 requirements, subject to grade, product form, applicable MDS and manufacturer qualification."

Explicitly avoided (no certificate exists to support them): "NORSOK M-630 Certified", "NORSOK Certified", "NORSOK approved supplier", "M-650 Qualified". M-650 is only ever described as something the *manufacturing source* may hold, to be verified per enquiry.

## Changes by page

**Homepage (`src/routes/index.tsx`)**
- Hero subheadline: "...supplied against ASTM, ASME, NACE and applicable NORSOK M-630 requirements..."
- Global supply / sourcing block: add a line "Materials available against applicable NORSOK M-630 Material Data Sheets, subject to grade, product form and manufacturer qualification."
- Title/meta description: work in "NORSOK M-630" naturally next to the existing ASTM/ASME/NACE terms.

**Quality page (`src/routes/quality.tsx`)**
- New section "NORSOK M-630 material requirements" with the long-form paragraph from the brief, plus three short clarifying points: the applicable MDS depends on material/grade/product form; manufacturer qualification must be verified per enquiry; M-650 is only claimed where the actual manufacturing source holds valid qualification for the required MDS/product.
- New "NORSOK documentation available on enquiry" list — the 11 document types (MDS, M-650 manufacturer qualification where applicable, EN 10204 3.1/3.2 MTC, chemistry, mechanical, heat-treatment records, NDT (UT/MPI/DPI/RT), corrosion testing, manufacturer ISO 9001, third-party inspection, full heat/batch traceability).
- Add "Materials sourced against applicable NORSOK M-630 MDS (specification, not a held certification)" to the compliance list in `src/data/company.ts`.

**New technical article (`src/data/technical.ts`)** — `norsok-m-630-materials-guide`, "NORSOK M-630 Materials Guide": what M-630 is, how MDS numbers map to grade and product form, relationship to M-650 manufacturer qualification, documentation set, and what ASTM/ASME/NACE paperwork does *not* cover. Renders through the existing `/technical/$slug` route with its own head/meta; carries the SEO terms (NORSOK M-630 supplier, material data sheet, stainless steel, alloy materials, M-650 qualified manufacturer) once each, in-sentence.

**Product / material pages** — add NORSOK M-630 only where it is genuinely applicable: duplex, super duplex and the offshore-relevant nickel grades already carry it; extend the same `standards.other` entry to any duplex/super-duplex forms that are missing it. No NORSOK on carbon steel, PVC/CPVC, or general commodity stainless.

**RFQ page** — standards checklist already lists NORSOK; add a helper note that NORSOK enquiries should state the MDS number and whether M-650 manufacturer qualification is required.

**Industries** — offshore, subsea, oil & gas and desalination entries already reference M-630; align their wording to the approved phrasing.

**AI assistant prompt (`src/lib/assistant.server.ts`)** — instruct it never to claim NORSOK certification and to use the sourcing-against-specification framing.

## Consistency pass

Grep every ASTM/ASME/NACE mention site-wide, add NORSOK M-630 only where the grade and product form support it, and report back: pages changed, exact wording used, claims deliberately avoided, and which manufacturer certificates you'd need to upload (M-650 qualification certificates, mill ISO 9001, MDS-specific test reports) to strengthen the claims later.

## Verification

Type-check, build, and a Playwright pass over the homepage, quality page and the new technical article.
