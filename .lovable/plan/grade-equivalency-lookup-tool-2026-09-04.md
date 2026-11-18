# Grade Equivalency Lookup tool

Add a searchable grade-equivalency table to the existing `/tools` page, alongside the calculators.

## What changes

**1. New component — `src/components/site/GradeEquivalency.tsx`**
- Data source: the existing `materials` dataset (`src/data/materials.ts`) — no duplicated data. Each row is derived from a `Material`:
  - **Common name** → `m.name` (linked to its material page `/materials/$slug`)
  - **UNS** → `m.uns`
  - **ASTM/ASME** → first of `m.standards.flanges` / `m.standards.fittings` (joined if several)
  - **EN / Werkstoff** → `m.werkstoff` (fallback "—" where absent)
  - **Family** → `familyLabel[m.family]` chip
- Scope: the CRA + stainless families (Nickel, Duplex, Super Duplex, Stainless — the ~34 documented alloy grades); carbon/polymer piping excluded from the table.
- Controls: a search input (matches name, UNS, Werkstoff, ASTM designation) plus family filter buttons (All / Nickel / Duplex / Super Duplex / Stainless), using the existing gold/charcoal token styling.
- Table styled with the existing `SpecTable` look (bordered, mono numeric columns), wrapped in the same `surface-panel` card treatment as the calculators.

**2. Tools page — `src/routes/tools.tsx`**
- New section "Grade Equivalency Lookup" (own `<Section>` with eyebrow/title/intro), placed between the grade finder section and the calculator grid.
- Meta description updated to mention the equivalency lookup.

**3. Nav — `src/components/site/Header.tsx`**
- The header uses flat links (no dropdown exists). The "Tools" link already points to `/tools`; add an in-page anchor (`#equivalency`) on the new section so it can be deep-linked, and add "Grade equivalency" as a quick anchor link inside the Tools page hero area alongside the existing tool anchors (if none exist, a small anchor row is added).

## Verification
- `bunx tsgo` type-check
- Playwright screenshot of `/tools`: search "2205", filter by Duplex, confirm rows/columns render and grade links resolve.
