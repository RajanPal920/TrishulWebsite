# Fix logo contrast

## Update
- Create a corrected version of the existing logo artwork, preserving its exact dimensions, transparent background, trident mark, typography, spacing, and proportions.
- Change only the dark “TRISHUL” lettering to the site’s established bright gold so it remains clearly visible on the graphite header, footer, and PDF mastheads.
- Replace the current shared logo asset with the corrected version so the website and every generated PDF update together; keep the existing gold theme and all logo placements unchanged.

## Verification
- Check the logo at desktop and mobile header sizes and in the footer.
- Generate representative portrait and landscape PDFs and visually confirm the complete logo is legible without overlap or distortion.
- Confirm the favicon remains unchanged and verify the app build is clean.

## Technical details
- Edit the existing source image rather than regenerating the logo, then upload the corrected transparent PNG through the project asset flow.
- The shared `BrandLogo` component and PDF header already consume one asset pointer, so the correction will propagate consistently without duplicating presentation logic.
