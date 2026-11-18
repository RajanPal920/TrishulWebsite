# Cinematic Industrial Photography Upgrade

## Goal
Raise Trishul Metals’ visual credibility with a small, cohesive set of high-resolution industrial photographs while preserving the established graphite-and-gold identity and keeping pages fast.

## What will change

1. **Source and license-check the visual set**
   - Select commercially usable, high-resolution imagery from Unsplash or Pexels for: alloy pipe inventory, flange/component macro detail, CNC machining or dimensional inspection, and offshore/export-industry context.
   - Prefer technically believable scenes without visible competitor branding, unsafe practices, implausible materials, or misleading certification claims.
   - Download and host selected files through the project asset pipeline rather than hotlinking external URLs.

2. **Build a cinematic homepage hero**
   - Replace the current grid-only hero background with a full-bleed industrial stockyard or alloy-pipe image.
   - Add a controlled dark image overlay and subtle gold treatment so the existing headline, CTAs, and procurement metrics remain highly legible.
   - Preserve the current content hierarchy and ensure the next homepage section remains visible at common desktop and mobile heights.

3. **Add strategic visual proof**
   - Use the flange/component macro and machining/inspection images in the most relevant product, quality, or operations surfaces.
   - Keep the existing MTC dossier and export-packing imagery where it provides stronger first-party operational proof.
   - Avoid decorative duplication: each new image will communicate product reality, inspection capability, inventory, or end-use context.

4. **Optimize delivery and responsiveness**
   - Prepare responsive WebP/AVIF-friendly source assets with appropriate crops and dimensions.
   - Preload only the homepage hero; lazy-load below-the-fold photography.
   - Use stable aspect ratios, explicit dimensions, responsive `sizes`, and object-position tuning to prevent layout shift and awkward mobile crops.

5. **SEO and accessibility**
   - Write specific alt text tied to the represented product or operation.
   - Add the homepage hero as the homepage social-sharing image if the final hosted asset has an absolute production-safe URL.
   - Keep one H1 and all existing technical content/routes unchanged.

6. **Verification**
   - Check the homepage, product detail, quality, and about/operations views at desktop and mobile widths.
   - Confirm text contrast, crop quality, no overlap, no broken media requests, and a clean application build.

## Technical notes
- Current audit: the homepage hero has no photographic asset; operational images are 1536×1024; product images are 1024×768.
- The visual direction remains graphite, steel, and Trishul gold—no palette redesign.
- Free commercial-use sources are the default; paid stock will not be purchased or introduced without supplied licensed files.
