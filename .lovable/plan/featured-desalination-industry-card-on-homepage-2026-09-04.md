# Featured Desalination Industry Card on Homepage

## Current state (verified)
- Homepage Industries section renders `industries.slice(0, 6)` from `src/data/industries.ts`, which shows: Offshore Oil & Gas, Onshore Oil & Gas, Subsea Engineering, Refineries, Petrochemical Plants, LNG Plants.
- A `desalination-plants` industry already exists in the data (9th entry) with a full page at `/industries/desalination-plants` — it just falls outside the homepage's first-six cutoff.
- Cards use `CardLink` with `title={i.name}` and `body={i.tagline}`.

## Change (homepage only — `src/routes/index.tsx`)
1. Replace the `slice(0, 6)` render with an explicit featured list of the same six card slots, dropping **Onshore Oil & Gas** (it remains on the full 20-industries page and list — no duplication) and inserting **Desalination & Seawater Systems**:
   - Offshore Oil & Gas
   - Desalination & Seawater Systems
   - Subsea Engineering
   - Refineries
   - Petrochemical Plants
   - LNG Plants
2. The Desalination card uses the same `CardLink` style, links to `/industries/desalination-plants`, and carries the user-specified copy: "RO, MSF and MED plant piping specified in duplex and super duplex for chloride and pitting resistance".
3. All other cards keep their existing data-driven name/tagline; the "All 20 industry applications →" link and count are unchanged.

No changes to `src/data/industries.ts`, other routes, or copy elsewhere.

## Verification
- `bunx tsgo` type check, plus a Playwright screenshot of the homepage Industries section confirming six cards with Desalination featured second.
