# Repair the raw-stock transformation section

## Goal
Make the six homepage transformations read as credible before/after stories, with visually matched imagery and text that remains clean at every scroll position. Keep the existing section title, six applications, asymmetric grid, `/processing` link, graphite/gold styling, and section-only scroll behavior.

## Matched before/after imagery
- Create a dedicated matched pair for each application: Railway Spring Pots, Offshore firewater headers, Subsea connector rings, Valve stem blanks and adapter rings, Cryogenic valve body rings, and Desalination RO headers.
- For each pair, generate the raw-stock view first, then derive the finished-component view from that same scene so camera angle, crop, lighting, metal grade, scale, and background remain consistent.
- Ensure the finished image actually depicts the named component rather than a generic flange or pipe bundle.
- Use one restrained industrial art direction across all twelve images: graphite workshop/studio setting, realistic alloy surfaces, warm edge light, no people, text, logos, or certification marks.
- Optimize the final assets as appropriately sized WebP files and retain descriptive “representative” alt text.

## Card and transition repair
- Replace the current ambiguous split-image presentation with one stable, full-width image stage per card. Raw stock appears first and transitions into the matched finished view as the card moves through the viewport.
- Keep a compact state label anchored consistently within the image stage and use the gold progress rule to clarify transition progress.
- Restructure the copy area into one reserved-height stage. Fade the raw description fully out before revealing the finished description, eliminating the midpoint where both paragraphs overlap.
- Give smaller cards enough fixed responsive height for their longest copy; keep the larger Railway card as the visual anchor without excess empty space.
- Preserve reverse scrolling, lazy loading, asynchronous decoding, reserved image dimensions, and clipped overflow.

## Reduced motion and fallback
- With reduced motion, show an explicit static before/after layout with two clearly separated image-and-copy states rather than stacked animated layers.
- Keep all content readable when JavaScript is unavailable; GSAP remains progressive enhancement only for this section.

## Verification
- Confirm each of the six raw/finished pairs represents the same material journey and named application.
- Scroll forward and backward through every card and verify that no labels or paragraphs overlap at any transition point.
- Check normal motion, reduced motion, and JavaScript-free presentation.
- Verify at 390, 768, 1280, and 1536 px with no horizontal overflow, broken images, layout shift, runtime errors, or build errors.
- Do not change any other homepage section or any team, employee, or staff content.
