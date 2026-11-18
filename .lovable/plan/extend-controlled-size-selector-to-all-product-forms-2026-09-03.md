# Extend Controlled Size Selector to All Product Forms

## Problem
The GradeFinder "Controlled size selector" only supports flanges (NPS, pressure class, facing). Buyers of pipes, sheets/plates, rings, circles/discs and round bars get no dimensional or weight guidance.

## Approach
Add a **Product form** selector at the top of the selector panel. Each form swaps in its own dimension inputs and results table, reusing the selected alloy grade (for equivalent designations, density-based weight, and matching product page links).

### Forms and inputs

```text
Form            Inputs                        Output table
--------------  ----------------------------  ---------------------------------------
Flange          NPS, Class, Facing            OD × thickness, bolt circle, holes,
                                              facing finish, rating (existing — kept)
Pipe / Tube     NPS, Schedule (10S/40/80)     OD × wall (in + mm), nominal bore,
                                              weight per metre
Sheet / Plate   Thickness, Width, Length      Thickness (mm/in), standard sheet sizes,
                                              weight per sheet
Ring (forged)   OD, ID, Thickness             Cross-section, volume, weight per ring
Circle / Disc   Diameter, Thickness           Area, weight per piece
Round Bar       Diameter, Length              Weight per metre and per bar
```

### Form availability by grade
Forms are filtered by the selected grade's allowed product matrix (`productsForMaterial`), so polymer grades don't show forged rings and alloy grades don't show irrelevant forms. Forms with no matching product page are hidden.

### Weight calculation
- New `density` (g/cm³) field per material family: nickel alloys ~8.4–8.9, duplex/super duplex ~7.8, stainless ~7.9–8.0, carbon ~7.85, polymers ~1.4.
- Added to material records in `src/data/materials*.ts` (or a per-family lookup in `cad.ts`); shown in results with a "theoretical, confirm mill tolerance" note.

### Data additions (`src/data/cad.ts`)
- `sheetSizes`: standard thicknesses (0.5–100 mm), widths (1000/1250/1500/2000 mm), lengths (2000/2500/3000/6000 mm).
- `ringDims` and `circleDims`: common OD/ID/thickness ranges.
- `barDims`: round bar diameters 6–300 mm with kg/m for carbon steel baseline (scaled by family density).
- Pipe weight per metre derived from existing `pipeDims` (OD × wall × density formula).

### UI changes (`src/components/site/GradeFinder.tsx`)
- New "Product form" radio/segmented control above NPS.
- Right panel renders form-specific inputs and results; the quote button label updates per form ("Quote 316L Sheet 2 mm × 1250 × 2500").
- "Matching product pages" chips filtered to the chosen form.
- No change to the equivalent-grade finder side (left column).

## Technical details
- Files: `src/data/cad.ts` (new dimension tables + weight helpers), `src/data/materials*.ts` or family density map, `src/components/site/GradeFinder.tsx` (form state + conditional UI).
- Pure frontend; no backend, migration or new routes.
- Disclaimer footer extended: theoretical weights, confirm against governing standard/mill certificate.

## Verification
- Type-check, build OK.
- Playwright: switch each form on the homepage widget, verify correct inputs/results, weight math spot-check, mobile layout, quote CTA label.
