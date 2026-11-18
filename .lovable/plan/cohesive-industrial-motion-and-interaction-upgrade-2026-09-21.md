# Cohesive industrial motion and interaction upgrade

## Goal
Apply one restrained, high-performance motion language to the homepage, product and industry directories, grade/product configurators, and RFQ experience. Preserve the existing graphite/gold identity, content, imagery, routes, data, SEO, and quotation workflow. Do not modify employee, staff, or team content.

## 1. Shared motion system
- Extend the existing reusable Motion utilities rather than introducing another animation library.
- Add a hydration-safe scroll-reveal wrapper supporting short stagger groups, approximately 16–20px travel, subtle opacity/blur resolution, and durations below 400ms.
- Standardize card interaction timing, easing, border sweep, soft gold glow, 1–2% elevation, and directional arrow movement.
- Keep keyboard focus states equally clear and make touch interactions stable without hover-dependent information.
- Disable transforms, blur, stagger, count-up, and height animation for `prefers-reduced-motion`; final content remains visible immediately.

## 2. Homepage
- Refine the existing hero sequence into a fast hierarchy: eyebrow, headline blur-to-focus/slide, gold rule, supporting copy and CTAs, then the existing real-value stat counters.
- Keep the current hero image, wording, CTAs, capabilities, stats, and server-rendered final counter values unchanged.
- Apply staggered reveals only to major section headers and grouped card collections, avoiding duplicate animation on the GSAP raw-stock transformation story.
- Preserve the current before/after bento behavior and all homepage section order and links.

## 3. Product and industry directories
- Use the existing card component as the single source for crisp highlighted borders, restrained glass depth, slight elevation, soft glow, image treatment, and arrow translation.
- Apply consistent staggered entry to material-family, product, industry, technical-resource, and buyer-tool collections while retaining each page’s existing layout and hierarchy.
- Keep dense catalogue information readable and avoid converting every section into identical cards.

## 4. Grade, size, and cut-to-size configurators
- Preserve existing result cross-fades and make selector focus, selected chips, checkboxes, and matching-page links follow the same fast interaction language.
- Retain the cut-to-size panel’s animated expansion, tightening it to the shared sub-400ms timing and instant reduced-motion fallback.
- Animate only dynamic result and disclosure regions; do not shift stable labels, tables, or surrounding page layout unnecessarily.

## 5. RFQ experience
- Add restrained staged entry to the major RFQ groups without delaying interaction.
- Animate newly added/removed line items and dynamically appearing file/rejection/confirmation rows with short height-and-opacity transitions.
- Improve field focus, processing-chip selection, checkbox, upload-zone drag state, and primary action feedback using the shared graphite/gold treatment.
- Preserve all validation, prefill parameters, supported files, limits, submission behavior, and the single existing submission path.

## Technical notes
- Continue using `motion/react`, Tailwind utilities, and semantic tokens in `src/styles.css`; no second general-purpose motion dependency.
- Keep GSAP/ScrollTrigger scoped only to the existing raw-stock transformation section.
- Introduce small shared wrappers/variants to avoid repeated animation definitions and hydration differences.
- Do not alter data, backend logic, team/staff pages, or unrelated routes.

## Verification
- Confirm hero animation order, section/card stagger, hover and focus states, configurator expansion, RFQ line/file transitions, and the complete RFQ prefill/submission path.
- Verify reduced-motion final states and immediate usability.
- Check 390, 768, 1280, and 1536px for no overlap, layout shift, or horizontal overflow.
- Confirm no broken images, runtime errors, accessibility regressions, or build errors.
