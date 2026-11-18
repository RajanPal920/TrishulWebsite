# Add "Specified Against Failure Mode" homepage section

## Goal
New homepage section between the CRA "Material families" section and the "Buyer tools" section. Four cards, one per failure mode, using the existing card style (surface-panel glass card with gold hover glow via `CardLink` in `src/components/site/parts.tsx`). Technical, factual tone only.

## Placement
`src/routes/index.tsx` — new `<Section>` inserted immediately after the Material families `</Section>` block (line ~180) and before the "Start here" / GradeFinder section.

## Section structure
- `SectionHead`: eyebrow "Engineering selection", title "Specified Against Failure Mode", intro: one factual line, e.g. "Material families matched to the environments that cause the most expensive in-service failures."
- `mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4` — four `CardLink` components.

## Cards (title / body / grade tags / link)

1. **Sour Service (H2S)** — body: "Hydrogen sulfide environments require materials qualified under NACE MR0175 / ISO 15156 to resist sulfide stress cracking."
   - Tags: Super Duplex · Duplex · Inconel 625
   - Links to `/materials/$slug` for `inconel-625` (representative qualified grade)
2. **Chloride Pitting & Stress-Corrosion Cracking** — body: "High-chloride environments — seawater, produced water, brine — attack standard stainless at welds and crevices first."
   - Tags: Duplex · Super Duplex
   - Links to `super-duplex-2507` grade page
3. **High-Temperature Oxidation** — body: "Sustained high-temperature service degrades standard alloys through scaling and creep."
   - Tags: Inconel 601 · Inconel 617 · Inconel 690
   - Links to `inconel-601` grade page
4. **Cryogenic Service** — body: "LNG and cryogenic systems require materials that stay ductile and fracture-resistant at sub-zero temperatures."
   - Tags: Stainless 304L/316L · Nickel Alloys
   - Links to `stainless-steel-316` grade page

All slugs verified to exist in `src/data/materials.*.ts`; the `$slug` route already renders per-grade pages, so no new routes are needed.

## Scope guardrails
- No copy, grade names, counts, or links elsewhere change.
- No new components — reuse `Section`, `SectionHead`, `CardLink`.
- Gold/graphite theme untouched; cards inherit existing `surface-panel` / `--shadow-gold` styling.

## Verification
- Type-check clean (`tsgo`), build log shows no errors.
- Playwright screenshot of the homepage confirming the four cards render in order and links resolve.
