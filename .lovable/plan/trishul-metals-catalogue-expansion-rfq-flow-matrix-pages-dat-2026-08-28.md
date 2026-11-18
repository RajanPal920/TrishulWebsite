# Trishul Metals — Catalogue Expansion, RFQ Flow, Matrix Pages & Datasheets

Adds everything from the 2026 product catalogue that is missing today, plus five new capabilities: cross-selling matrix pages, a proper RFQ system, procurement/shipping content, compare & favourites, and downloadable PDFs.

## 1. Catalogue gaps to fill

Today the site covers flanges and pipe fittings only, in nickel/duplex/stainless. The catalogue also sells:

New product categories and product pages:
- Pipes & Tubes — A312 seamless/welded pipe, A269 general tube, A213 boiler/exchanger tube, A249 welded tube, A789 duplex tube, A554 mechanical tube, nickel pipe/tube (B161/B165/B167/B407/B423/B444/B622), carbon steel A106, A53, API 5L, A333, A671/A672, large-diameter IS 3589/EN 10217, A179/A192/A210 exchanger tube
- Forged fittings — socket-weld (Class 3000/6000/9000) and threaded (Class 2000/3000/6000) to ASME B16.11
- Bars — round, hex, square, flat and angle (A276/A479, B160/B164/B166/B425/B446/B473/B574/B637)
- Sheets, Plates & Coils — A240, high-alloy plate, nickel plate/sheet (B127/B162/B168/B424/B443/B463/B575/B670), CS plate A36/A516 Gr 70/A572
- Large-diameter flanges (B16.47 Series A/B) as an explicit product page

New material family — Carbon Steel: A106 Gr B/C, A53 Gr A/B, API 5L Gr B & X42–X80, A333 Gr 6, A105, A350 LF2, A234 WPB, A420 WPL6, A36, A516 Gr 70, A572 Gr 50.

New stainless grades from the catalogue: 304L, 316L, 310S, 317L (existing 304/316/321/347/904L/254 SMO stay).

Also added from the catalogue: schedule quick-reference table (NPS/OD/SCH 10S/40/80), flange facing & class selection table, surface-finish guide, and the inspection route / test matrix — placed in the Technical Knowledge Centre.

## 2. Material x product matrix pages (full matrix)

New route `/materials/{grade}/{product}` — e.g. `/materials/nickel-200/flanges`, `/materials/inconel-625/buttweld-fittings`, `/materials/carbon-steel-a106/seamless-pipe`.

Each page composes grade data plus product data into a genuine commercial page: applicable ASTM material spec for that pairing, dimensional standard, size/class range, condition, testing, typical service, an ordering checklist, and a grade-specific FAQ block. Pages are generated on demand from the data layer (no thousands of files), with unique title/description/canonical and Product + Breadcrumb JSON-LD.

Cross-linking: grade pages list every product available in that grade; product pages list every grade; matrix pages link sideways to related grades and related products. A `/matrix` hub indexes the full grid so nothing is orphaned. Combinations that are not real (e.g. a grade with no plate route) are suppressed by a validity rule so no empty pages ship.

## 3. RFQ flow (both email and stored record)

New multi-step RFQ page and a compact RFQ drawer available from every grade, product and matrix page (prefilled with that item).

Fields: line items (material grade selector, product selector, size/NPS or OD x WT, schedule/class, facing/ends, quantity + unit) with add-another-line; standards & code edition; testing requirements (PMI, hydro, UT/ET, RT, PT/MT, IGC A262, ferrite, impact, hardness, NACE); certification (EN 10204 3.1 / 3.2 + TPI); Incoterm, destination port/country, required delivery date; company, contact, email, phone; free-text notes; file upload for drawings, specs and BOQs (PDF/DWG/XLSX/images, multiple files).

On submit: the enquiry and files are stored securely, an RFQ reference number is issued, and a formatted email with all fields and file links is sent to export@trishulmetal.com, plus an acknowledgement to the customer. Requires enabling the Lovable Cloud backend.

## 4. Procurement & international shipping

New `/procurement` and `/shipping` sections covering: the enquiry-to-dispatch six-step route, documentation package (EN 10204 3.1/3.2 MTC, CoC, NDT/PMI/dimensional reports, invoice, packing list, certificate of origin, B/L, insurance, fumigation), Incoterms table (EXW, FOB, CFR, CIF, DAP, DDP) with what each includes and who bears risk, indicative lead times by product family and grade availability, export packing and marking standards, payment terms, and country/region-wise contact routing (Middle East, Europe, North America, Southeast Asia, Africa, Oceania, India) with the right port pairs and typical transit times.

## 5. Compare & favourites

- Compare: select up to 4 alloy grades (or products) and view a side-by-side table of composition, mechanical/physical properties, PREN, corrosion behaviour, max temperature and standards. Sticky compare bar with a `/compare` view.
- Favourites: a shortlist toggle on grade, product, matrix and technical pages; a `/shortlist` page listing saved items with one click to "Send all as an RFQ" (prefills the RFQ line items) or download all datasheets.
- Both persist in the browser, so no login is needed.

## 6. Downloadable datasheets

Every grade, product, matrix and industry page gets a "Download datasheet (PDF)" button. PDFs are generated on demand from live site data in Trishul gold/graphite branding: header with logo and contact block, the page's technical tables, standards, applications and a disclaimer/footer with the enquiry checklist. Grade sheets include composition, mechanical, physical, corrosion and standards; product sheets include the supply range and dimensional standards; industry sheets include service conditions and preferred alloys. Also a full "Download catalogue" action assembling multiple sheets from the shortlist.

## Technical notes

- Data layer extended: new `products.pipes-tubes.ts`, `products.bars.ts`, `products.plates.ts`, `products.forged.ts`, `materials.carbon.ts`, plus new stainless grades; `ProductCategory` union widened; a `availability` map defines valid grade x product pairings and their ASTM spec/standard/range so matrix pages stay accurate.
- Matrix route: `src/routes/materials.$slug.$product.tsx` with a loader validating both segments and `notFound()` otherwise; hub at `src/routes/matrix.index.tsx`.
- Backend (Lovable Cloud): `rfq_submissions` table with RLS (public insert only, no public read), storage bucket for attachments with size/type limits, a server function that validates input with Zod, stores the record, and sends mail to export@trishulmetal.com via Resend (needs a Resend API key and a verified sender domain — I will prompt for the key).
- PDFs: client-side generation with jsPDF + autotable, brand tokens from `styles.css`, no server round-trip.
- Compare/favourites: localStorage-backed context provider, hydration-safe.
- SEO: unique `head()` per new route, sitemap coverage for matrix pages, breadcrumb and product JSON-LD.
- Existing golden/graphite theme, components and page structure are reused throughout — no visual redesign.
