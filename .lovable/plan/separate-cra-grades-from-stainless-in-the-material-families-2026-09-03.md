# Separate CRA grades from stainless in the "Material families" section

## Current state (homepage, `src/routes/index.tsx`)

The "Corrosion-Resistant Alloy (CRA) Grades" section (lines 123–146) renders one 4-column card grid over `familyOrder` (line 55): Nickel Alloys, Duplex, Super Duplex, Stainless Steel — all identical `CardLink`s, each linking to `/materials` with an "N grades" eyebrow and a body of the first 4 grade names joined by " · ".

## Change

Split the single grid into two visual tiers, keeping all links (`to="/materials"`) and the grade data unchanged:

1. **CRA featured row** — Nickel Alloys, Duplex, Super Duplex in a 3-column grid (`md:grid-cols-3`), with the exact same card treatment they have today (eyebrow, title, grade-name body). Since the grid goes from 4 to 3 columns, these cards naturally become larger/more prominent.

2. **Muted supporting strip** — directly below, a visually lighter block:
   - Small uppercase label: "Also Available — Supporting Grades" (muted foreground, small tracking-wide text — not a full `SectionHead`)
   - A single full-width, low-emphasis strip (subtle `bg-card/40`, `border-border`, reduced padding) containing the Stainless Steel card content: "10 grades" eyebrow, "Stainless Steel" title, links to `/materials` unchanged.
   - Body text replaced with exactly: "Standard austenitic stainless steel supplied alongside CRA grades for mixed-metallurgy builds and projects requiring a single-source supplier."
   - The existing grade list (304/304L, 316/316L, 321, 347 …) stays visible as a small muted line beneath the description so no grade information is lost.

## What does not change

- Grade names, counts, and the `/materials` link targets.
- The section eyebrow ("Corrosion-Resistant Alloy (CRA) Grades"), title and intro.
- Gold/graphite theme; only muted neutral tokens used for the strip.
- The `/materials` index page is untouched (it keeps its own per-family sections).

## Verification

- Type-check (`bunx tsgo --noEmit`) and build log check.
- Playwright screenshot of the homepage section confirming: 3 large CRA cards on top, muted stainless strip below with the new label and description.
