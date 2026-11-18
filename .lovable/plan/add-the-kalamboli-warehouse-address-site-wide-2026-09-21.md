# Add the Kalamboli warehouse address site-wide

The Kalamboli warehouse becomes a second, clearly labelled location alongside the existing
Durgadevi Street office (which stays primary). One source of truth in the company data file
means the address flows automatically into the header strip, footer, Contact page and the
structured data search engines read, plus a Google Maps link and a visits-by-appointment note.

## Address as supplied

```text
Trishul Metals & Alloys
Plot No. 1818, Road No. 23,
Kalamboli Warehouse Complex (KWC),
Kalamboli, Navi Mumbai, Maharashtra – 410218, India
```

The dash before the PIN code is written as `Maharashtra 410218` so the address reads the same
way everywhere and stays machine-parseable.

## What changes

### 1. Company data — the single source

`src/data/company.ts`

- Extend the `Office` type with three fields: `kind` (`"office"` or `"warehouse"`),
  `mapsUrl`, and an optional `visitNote`.
- Add a second entry to the `offices` list for Kalamboli, keeping the Mumbai office first and
  unchanged:
  - Role: "Warehouse & despatch" · City: "Kalamboli" · Flag: IN
  - Lines: Plot No. 1818, Road No. 23 / Kalamboli Warehouse Complex (KWC) / Kalamboli,
    Navi Mumbai / Maharashtra 410218 / India
  - Same contact email, phone and working hours as the office
  - Coverage note: ready stock, cut-to-size handover, inspection and export packing,
    despatched via Nhava Sheva
- Add `company.warehouseLine` (one-line warehouse address) next to the existing
  `company.addressLine`, and point `mapsUrl` at a standard key-free Google Maps search link
  built from the full address, so it works on any domain without extra setup.

### 2. Header top strip

`src/components/site/Header.tsx` — already loops over the office list, so the warehouse line
("IN Kalamboli — Warehouse & despatch") appears next to the Mumbai line. The strip wraps
naturally and stays hidden on mobile, as today.

### 3. Footer

`src/components/site/Footer.tsx` — the warehouse renders as its own labelled block under the
office block, with a "View on Google Maps" link and the visits-by-appointment note.

### 4. Contact page

`src/routes/contact.tsx`

- The "Our office" grid already maps the office list, so the warehouse renders as a second
  card with its own label, maps link and visit note.
- The contact detail list gains a "Warehouse" entry below the existing "Office" entry.
- Page heading/intro wording broadened slightly from one desk to "office and warehouse" so
  the two locations read as intentional.

### 5. Structured data (SEO)

`src/routes/__root.tsx` — the Organization JSON-LD already builds `address`, `location` and
`contactPoint` arrays from the office list, so the warehouse is added to all three. The
`location` entries are also enriched with region and PIN code, and carry `hasMap` pointing at
the Google Maps link, so each site is a complete, distinct place record.

### 6. Machine-readable summary and facility caption

- `src/routes/llms.txt.tsx` — a "Warehouse" line is added under Contact.
- `src/components/site/FacilityGallery.tsx` — the caption below the gallery names the Kalamboli
  warehouse as the place where stock is held and visits are arranged, instead of only quoting
  the office address.
- `src/routes/stock.tsx` — the ready-stock copy and page description say "Kalamboli warehouse"
  rather than the generic "Mumbai warehouse", which is what the stock actually refers to.

## What is not touched

The Durgadevi Street office remains the primary listed address everywhere it already appears.
No grades, products, pricing, RFQ flows, team or personnel content change. Gold/charcoal
tokens and existing layout are reused — no new styling system.

## Verification

- Typecheck and dev build clean (`/tmp/observability/build-errors.log`).
- Browser check at 1280 and 390: warehouse visible in header strip (desktop), footer, and as a
  second Contact card; "View on Google Maps" resolves to the Kalamboli address; no horizontal
  overflow; no console errors.
- Organization JSON-LD parses and contains both Mumbai and Kalamboli place entries with the
  correct PIN code and maps link.
