# Trishul Metals — Elite Industrial Platform Upgrade

The site already has 34 alloy grades, 38 product pages, and a grade × product matrix engine (`src/data/matrix.ts`) that generates the deep long-tail pages (e.g. Inconel 625 weld neck flanges). What's missing is the discovery layer, the dual-footprint trust signals, pressure–temperature data, the verification utilities, and the FAQ matrix. This plan closes those gaps.

## 1. Deep page index and discovery

- Add a `/matrix` directory page that lists every valid grade × product combination grouped by family and product category, with filters — this turns the existing generated pages into a crawlable index (hundreds of URLs, well under any build limit).
- Add `sitemap.xml` and update `robots.txt` to reference it, covering all static routes, grade pages, product pages, industry pages, technical articles, and every matrix pair.
- Cross-link: each grade page lists its product forms; each product page lists available grades; each matrix page links to sibling forms in the same grade.

## 2. Pressure–temperature and specification depth

- Add ASME B16.5 material-group mapping per grade plus pressure–temperature rating tables (Classes 150–2500 across the temperature band) as a new data module.
- Render a P–T rating table on every flange-bearing grade page and matrix page, alongside the existing composition, mechanical, physical and standards tables.
- Add a size/dimension matrix (NPS range, schedule, pressure class, facing options) to matrix pages.

## 3. Dual-footprint trust architecture

- Add a Dubai commercial coordination office alongside the Mumbai HQ in company data.
- Show both locations in a new slim header utility bar (phone, export email, both cities), the footer, the contact page (two location cards with hours in IST and GST), and the Organization JSON-LD.

## 4. Procurement utilities

- New "Size Selector & Equivalent Grade Finder" widget: cross-references ASTM / UNS / Werkstoff / DIN / EN / JIS / BS designations across all grades, and maps NPS → OD → schedule → wall, pressure class and facing. Placed on `/tools`, surfaced as a compact panel on the homepage and on each grade page.
- Deep-link from the finder into the matching matrix page and prefill the RFQ.

## 5. Quality, traceability, verification

- Expand `/quality` into a documentation dossier: watermarked EN 10204 3.1 MTC specimen (already present), plus new PMI report and TPI release-note specimens, each with PDF download using the existing generator.
- Add an MTC batch verification lookup: enter a sample heat number, get a verification result card (status, grade, spec, heat, test summary). Backed by a small seeded table in the backend with demo heat numbers, clearly labelled as a demonstration lookup.

## 6. 20-point FAQ matrix

- New FAQ dataset in four categories — Material Compliance, Quality & Testing, Logistics & Packaging, Commercial & RFQ Workflow.
- New `/faq` page with category tabs and FAQPage JSON-LD; relevant subsets embedded on technical, quality, RFQ and shipping sections.

## 7. Visual and performance

- Verify the Lovable badge stays disabled in publish settings.
- Generate the missing operational photography: verified stock racking, export-grade fumigated wooden crating, macro shots of flange faces and weld bevels; apply across quality, about and homepage.
- Performance pass: `loading="lazy"` + explicit width/height on all non-hero imagery, `fetchpriority="high"` on hero, defer the AI assistant widget until idle, and trim render cost on the largest list pages.

## Technical notes

- New route files: `matrix.tsx`, `faq.tsx`, plus a server route emitting `sitemap.xml`. All new links get their route file in the same change so the route tree stays valid.
- New data modules for P–T ratings, equivalent-grade designations, FAQ matrix, and document specimens.
- One backend migration for the heat-number verification table (public read policy, grants, seeded demo rows).
- Everything stays on the existing gold/graphite token set in `src/styles.css` — no new colour system.
