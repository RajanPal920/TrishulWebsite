# Group non-CRA grades into labelled "Supporting Product Line" subsections

Label-and-group only: no grade is removed, hidden, renamed, or changed in spec — every grade stays fully searchable and selectable. No team/personnel content is touched.

## Grade Equivalency finder (src/components/site/GradeFinder.tsx)

This is the one place all three groups appear side by side (search results list + the Grade dropdown). Changes:

- **Grade dropdown** — split into three `<optgroup>` blocks:
  1. CRA & Stainless grades (nickel, duplex, super duplex, stainless) — unlabelled group or "CRA Alloy & Stainless Grades".
  2. **Supporting Product Line — Carbon Steel** (A106, A53, API 5L, A333 Gr 6, A105, A350 LF2, A234 WPB, A420 WPL6, A516 Gr 70 — carbon steel is supplied by Trishul itself as companion grades, so no separate entity attribution).
  3. **Supporting Product Line — manufactured by Apex Polymer & Engineering** (UPVC, CPVC, SWR PVC-U). Uses the exact company name already established on the site ("Apex Polymer & Engineering") — will flag if it should differ.
- **Search results list** — when results span groups, render the same muted subheadings as section dividers above each cluster; results themselves unchanged.
- Subheadings use the existing muted small-caps label style (`text-muted-foreground`, small uppercase tracking) so they read as "also available from a related line."

## Materials index (src/routes/materials.index.tsx)

- The polymer family section's eyebrow currently falls through to "CRA". Fix the eyebrow logic so the polymer section reads **"Supporting Product Line — manufactured by Apex Polymer & Engineering"** (mirroring the carbon section's existing "Companion grades" treatment). Grade cards, counts and links unchanged.

## Checked and left unchanged

- `GradeEquivalency` table on /tools already shows only the four CRA families — carbon and polymer never appear there, so no change.
- Matrix pages already pair polymer grades only with PVC products and carbon grades only with carbon product forms — no mixed presentation.
- No pricing, part numbers, dimensions, or specification text is modified anywhere.

## Verification

`bunx tsgo`, then Playwright on /tools: confirm optgroups in the dropdown, subheadings in search results spanning groups, and the polymer eyebrow on /materials.
