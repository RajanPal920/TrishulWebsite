# Introduce "Corrosion-Resistant Alloy (CRA)" as the unifying category

Framing/label change only — on the homepage (`src/routes/index.tsx`). No grade names, counts, or other copy change.

## 1. Hero subheadline

Current (line ~83):

> Nickel alloy, duplex, super duplex and stainless steel flanges and pipe fittings supplied against ASTM, ASME and NACE requirements with heat-traceable EN 10204 3.1 documentation.

New:

> Nickel alloy, duplex, super duplex and stainless steel Corrosion-Resistant Alloy (CRA) flanges and pipe fittings supplied against ASTM, ASME and NACE requirements with heat-traceable EN 10204 3.1 documentation.

Note: your example wording dropped "and stainless steel" — I kept it since stainless grades are part of the catalogue and the instruction says not to change other copy. Say the word if you'd rather match your example exactly.

## 2. "Material families" section label

In the Material families `SectionHead` (line ~119), change the eyebrow from "Material families" to **"Corrosion-Resistant Alloy (CRA) Grades"** — this is the small gold label sitting directly above the section title and the four family cards. Section title, intro and cards stay untouched.

## 3. Page title & meta description

- `title`: "Corrosion-Resistant Alloy (CRA) Flanges & Fittings | Trishul Metals & Alloys"
- `description`: "Mumbai-based supplier and exporter of Corrosion-Resistant Alloy (CRA) flanges and pipe fittings — Inconel, Hastelloy, Monel, duplex, super duplex and stainless steel — to ASME B16.5, B16.9, ASTM B564, B366, A182 and A815 with EN 10204 3.1 certification."
- Mirror the same text into `og:title` and `og:description` so share previews match (metadata only, not page copy).

Everything else — H1, buttons, stats, cards, other routes — unchanged.

## Verification

- `bunx tsgo --noEmit` type-check clean, build OK.
- Render `/` in the preview and confirm the new subheadline, eyebrow and head tags.
