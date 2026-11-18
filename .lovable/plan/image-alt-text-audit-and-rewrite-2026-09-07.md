# Image alt text audit and rewrite

Every photo on the site already has alt text, but several places reuse a name or heading instead of describing what the photo actually shows. The stockyard / export-crate / dossier photos set the house style: concrete objects, material, markings, setting. This pass brings the rest up to that standard.

## Already good — leave unchanged

- Stockyard, export packing and dispatch dossier photos (facility gallery)
- Quality page caliper and certificate-dossier photos
- Export packing trio (seaworthy cases, VCI bundles, IPPC stamp)
- Homepage inventory photo

## To fix

1. **Product photos on product pages** — currently "<Product name> supplied by Trishul Metals & Alloys", which repeats the heading rather than describing the picture. Replace with a per-product descriptive line built from the product's own form, standard and finish, e.g. "Forged stainless steel weld neck flanges with raised face and machined bore, stacked for dimensional inspection".

2. **Product cards on the products index** — the card image currently uses the card title as its alt. Add an optional description on the card so each product photo carries the same specific line as the product page, instead of duplicating the visible link text.

3. **CAD library part photos** — currently just the part family name. Replace with a description of the rendered/photographed part, including form and standard.

4. **Page banner photos (all Materials, Products, Industries, Technical and grade x product pages)** — these are generated from templates like "<Product> represented in <Material> alloy for industrial supply", which is vague. Rewrite the templates so each describes the scene actually shown: racked pipe and tube stock, a metallurgical inspection bench with specimens, machined flange faces under measurement, an export consignment staged for loading, process piping in an operating plant.

5. **Logo** — state that it is the company logo rather than only the company name, so screen readers do not read a bare brand string twice in the header and footer.

## Explicitly out of scope

- Any team, staff or personnel page, image, caption or bio. Nothing on those pages will be touched.
- No visible copy, specifications, pricing or layout changes anywhere. Alt text only (plus one optional card prop needed to carry it).

## Technical notes

- Add a small helper (e.g. `src/lib/imageAlt.ts`) that produces a descriptive alt line for a product, a grade x product combination and a CAD part family, derived from existing product/material data so all 40+ generated pages stay consistent without hand-writing each string.
- `CardLink` in `src/components/site/parts.tsx` gains an optional `imageAlt` prop, defaulting to today's behaviour so no other caller changes.
- Update the alt templates in `src/components/site/RouteHero.tsx`, the image in `src/routes/products.$slug.tsx`, and the part image in `src/routes/cad.tsx`.
- Verify with a type-check and a spot check of rendered alt attributes on a grade page, a grade x product page, an industry page and the products index.
