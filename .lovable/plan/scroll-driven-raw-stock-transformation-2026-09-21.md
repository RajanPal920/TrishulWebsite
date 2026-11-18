# Scroll-driven raw-stock transformation

## Goal
Turn the existing six-card “From raw stock to finished sub-components” homepage section into a focused scroll story: each card begins with raw stock, then transitions to the representative finished component as the card moves through the viewport.

## Experience
- Preserve the current asymmetric grid, Railway hero cell, section copy, six applications, card spans, link to `/processing`, and gold/graphite styling.
- Give every card two stacked, fixed-size visual states:
  - **Raw stock:** representative pipe, bar, forged, or heavy-wall stock image with the existing raw-stock description.
  - **Finished component:** representative finished-part image with the existing finished-component description.
- Cross-fade and subtly transform the two image/text states from raw to finished according to each card’s scroll progress. Use a restrained industrial feel: slight image scale/position change, gold divider progress, and coordinated label transition rather than theatrical movement.
- Keep titles and sector names stable so the reader never loses context.
- Do not pin the page or create artificial scroll length; each card responds naturally as it passes through the viewport.

## Implementation
- Add GSAP and ScrollTrigger only; register and initialize them in the browser after hydration so server rendering remains safe.
- Scope all selectors, timelines, and cleanup to `SubcomponentBento`; no other page section receives GSAP behavior.
- Replace the current one-time Motion entrance animation for these cards with per-card scrubbed ScrollTrigger timelines. Retain the existing restrained pointer hover treatment where it does not conflict with scroll transforms.
- Curate existing local, optimized project imagery into raw/finished pairs. Reuse the cohesive homepage alloy images where appropriate and mark every image as representative rather than documentary proof.
- Keep both states in the rendered markup, with descriptive alt text, reserved dimensions, lazy loading, async decoding, object-cover cropping, and clipped overflow.
- Add only section-specific styling needed for stacked visual states, legibility overlays, and the gold progress cue, using existing semantic tokens.
- Skip Lenis: site-wide scroll smoothing would exceed this section-only scope, alter native scrolling everywhere, and is not required for ScrollTrigger.

## Accessibility and fallback
- Detect `prefers-reduced-motion` before creating timelines.
- For reduced motion, render a static before/after presentation with both raw-stock and finished-component states visible and no opacity, transform, scrub, pinning, or smooth-scroll behavior.
- Keep all content readable and complete before JavaScript initializes; GSAP progressively enhances the already-visible markup.
- Ensure keyboard focus, links, and touch scrolling remain unaffected.

## Verification
- Confirm all six cards visibly progress from raw stock to finished component while scrolling forward and reverse correctly when scrolling back.
- Confirm the section remains the only GSAP-driven scroll story and existing site-wide CSS reveals, hero motion, selectors, RFQ flow, and other interactions are unchanged.
- Check reduced-motion static before/after output and JavaScript-disabled/base markup completeness.
- Check 390, 768, 1280, and 1536 widths for stable card dimensions, no overlap or horizontal overflow, and no broken images.
- Verify browser console/runtime output, ScrollTrigger cleanup across navigation, and a clean project build.
- Do not modify team, employee, or staff content.
