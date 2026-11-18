# Contextual Hero Image System for Every Generated Page

## Goal
Give every generated Trishul Metals content URL its own context-relevant cinematic hero while preserving the existing graphite-and-gold identity, technical credibility, readability, and page speed.

## Scope
The site currently has 23 route templates and a sitemap containing roughly 1,300 URLs. This implementation will cover every user-facing content URL, including dynamic material, product, industry, technical, and material × product pages. Utility pages will also receive task-relevant imagery, while non-visual machine routes such as `/sitemap.xml` remain unchanged.

## Implementation

1. **Create a complete hero manifest**
   - Enumerate all static and generated content URLs from the existing datasets and route patterns.
   - Assign a unique hero ID, prompt, subject, crop direction, alt text, and focal position to every URL.
   - Use the page’s actual grade, product form, industry, standard, or workflow data so each image is context-specific rather than randomly decorative.

2. **Generate a coherent industrial image library**
   - Produce cinematic, high-resolution images in controlled batches with one unique final hero per generated URL.
   - Keep a consistent photographic language: real alloy components, machining, inspection, warehouses, export packing, process plants, marine/offshore settings, and engineering workflows.
   - Preserve technically credible geometry and materials; exclude logos, unsafe handling, fake document text, impossible fittings, and unsupported certification claims.
   - Maintain visual variety through subject, lens, composition, setting, and production stage without leaving the established graphite, steel, and gold visual direction.

3. **Use route-aware image selection**
   - Add a central typed hero registry keyed by canonical route or dynamic page identity.
   - Material pages will depict the specific alloy family and relevant service context.
   - Product pages will depict the exact component form.
   - Material × product pages will combine the named alloy cues with the exact product geometry.
   - Industry pages will depict their real operating environment.
   - Technical, quality, CAD, stock, logistics, RFQ, client, contact, and company pages will use imagery tied to the workflow shown on that page.
   - Add a safe family-level fallback so a missing asset can never leave a broken hero.

4. **Build a reusable page-hero component**
   - Introduce a shared full-width hero with responsive `<picture>` support, breadcrumbs, eyebrow, single H1, summary text, and optional page-specific actions or metadata.
   - Apply a controlled dark graphite overlay and restrained gold treatment so text contrast remains strong across every image.
   - Keep heroes shallower than the homepage hero so the page’s primary tables, forms, or tools remain visible quickly.
   - Replace the existing text-only opening sections across route templates and promote existing product/detail photography into the same system.

5. **Optimize and host all assets**
   - Create desktop and mobile-friendly WebP derivatives with stable dimensions and tuned focal points.
   - Upload generated binaries through the Lovable asset pipeline and retain only `.asset.json` pointers in the repository.
   - Preload only the current page hero; lazy-load all other images and keep generated hero data split or lookup-driven so the large manifest does not inflate every page bundle.

6. **Accessibility and social metadata**
   - Provide specific alt text describing the represented component, material, operation, or industry.
   - Add the resolved absolute hero URL to each leaf route’s Open Graph and Twitter metadata where supported.
   - Preserve unique titles, descriptions, canonical URLs, and the single-H1 structure already used across routes.

7. **Quality-control batches**
   - Generate and integrate assets in route-family batches so technical and visual issues can be corrected consistently before moving to the next family.
   - Validate representative desktop and mobile pages from every family, then automatically check the complete route manifest for missing mappings, duplicate assignments, broken requests, metadata omissions, and invalid dimensions.
   - Run type checks, the application build, route smoke tests, and browser checks for contrast, crop quality, layout overlap, and first-content visibility.

## Technical notes
- The homepage already establishes the intended responsive photographic hero pattern; the shared implementation will extend that pattern without redesigning the gold/graphite theme.
- Existing product photographs and first-party MTC/packing visuals will be retained where they are the most accurate source, but each generated URL will still resolve to a unique hero asset rather than sharing one final image.
- Because this is a very large media set, generation and review will be performed in deterministic batches with a resumable manifest; the final code path remains one unified hero system.
