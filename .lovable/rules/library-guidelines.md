# Trishul Metals Upgrade — Guidelines

## Components

The design system exports these components — import them from `@ws-bxqp4k5fqniqioguno2n/a9824e86-34c6-4567-a628-dc2a361d227f` and compose them before building anything from scratch:

`AskTrishul`, `BrandLogo`, `Breadcrumbs`, `BulletList`, `CardLink`, `CompareTray`, `Constants`, `CtaBand`, `Eyebrow`, `FacilityGallery`, `FaqList`, `Footer`, `GradeEquivalency`, `GradeFinder`, `Header`, `HeatVerify`, `MtcSample`, `PmiSample`, `Prose`, `RouteHero`, `SectionHead`, `Section`, `ShortlistButtons`, `ShortlistCount`, `ShortlistProvider`, `SpecTable`, `TpiSample`

Per-component details (import stanzas, props, variants, examples) live in `.lovable/rules/libraries/{slug}/components.md` — on disk, not auto-loaded. Read that file or the component source when the name alone isn't enough.

## Theme Files

The design system's theme is delivered through the following files. The author's original source files carry the full wiring the design system needs — variable declarations, framework-specific directives, provider objects, etc. — and are the canonical import target.

- `@ws-bxqp4k5fqniqioguno2n/a9824e86-34c6-4567-a628-dc2a361d227f/styles.css` (source — preferred import)
- `@ws-bxqp4k5fqniqioguno2n/a9824e86-34c6-4567-a628-dc2a361d227f/dist/tokens.css` (auto-generated flat list of CSS custom properties — a raw-values fallback only; does NOT carry framework-specific wiring that the source files above provide)

