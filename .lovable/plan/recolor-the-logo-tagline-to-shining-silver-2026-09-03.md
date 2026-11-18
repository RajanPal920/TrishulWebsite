# Recolor the logo tagline to shining silver

## Goal
In the Trishul Metals & Alloys logo image, the small line "Sourcing & Procurement Solutions" below "TRISHUL METALS & ALLOYS" is currently dark grey (~#595D62) and hard to read. Change it to a polished, shining silver metallic gradient while leaving the gold wordmark, trident mark, and layout untouched.

## Scope
- Only the logo bitmap changes. No code text, layout, PDF code, or favicon changes — the header, footer, and all generated PDFs import the same logo asset pointer, so they all update automatically.

## Steps

1. **Recolor the tagline (deterministic, pixel-precise)**
   - Source: current logo (408x142 PNG, served from the existing brand asset).
   - Using Python/PIL, select only the low-saturation grey pixels in the tagline's bounding region and remap their luminance onto a vertical silver gradient (bright #F2F4F7 → mid #C6CBD2 → deep #8E959E), preserving the anti-aliased letter shapes exactly.
   - Leave the gold letters, trident, and background pixels untouched by restricting the mask to the tagline region and grey hue range.
   - Fallback if the region mask proves unreliable: use `imagegen--edit_image` on the current logo with an instruction to recolor only the tagline to a silver metallic gradient, then verify all text survives the edit.

2. **Upload and swap the asset pointer**
   - `lovable-assets create --file <new-logo.png> --filename trishul-metals-logo.png` and overwrite `src/assets/brand/trishul-metals-logo.png.asset.json` with the new pointer.
   - No component or `datasheet.ts` edits needed — they all read the pointer file.

3. **Verify**
   - Header (desktop + mobile) and footer show the logo with the silver tagline legible on the graphite background.
   - Generate one specimen MTC PDF from /quality and confirm the silver tagline renders on the PDF header.
   - Favicon unchanged (it uses the trident mark only).
   - `bunx tsgo --noEmit` and build log show OK.
