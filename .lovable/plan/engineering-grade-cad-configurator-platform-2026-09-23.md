# Engineering-Grade CAD Configurator Platform

Upgrade the CAD library from a download form into an interactive, high-trust component platform for EPC and OEM buyers.

## 1. Interactive 3D component viewer

- Add a lightweight React Three Fiber canvas that renders the geometry already generated for the STL download, so the preview and the file are always the same shape.
- Rotate, pan and zoom with a dark slate studio background, gold key light, soft grid floor and a subtle auto-spin that stops on interaction.
- Placed on the CAD configurator, on every new per-part page, and on flange/fitting product pages (loaded only when scrolled into view so page speed holds).
- Static shaded image fallback for reduced-motion users and any device where 3D fails.

## 2. Engineering drawing generator

- Replace the plain outline with a proper drawing sheet drawn on canvas/SVG: front and section views with dimension lines and leaders.
- Formal title block: Trishul logo, part code, ASTM/ASME standard, material grade, nominal size and class, units, first-angle projection symbol, scale, date, drawn-by and a tolerance/verification note.
- "Download drawing (PDF)" produces the same sheet as a branded A3 PDF alongside the existing DXF and STL.

## 3. Lead gate on every CAD download

- Every download (3D model, 2D block, drawing PDF, and requested STEP packs) opens a compact modal asking for professional work email and company phone, with optional name and company.
- Free-mail domains are flagged with a polite "use your work email" hint; details are remembered for the rest of the visit so repeat downloads are one click.
- Each unlock is logged as a high-intent lead with the exact part code, size, class, material and format, and emailed to the Mumbai desk — reusing the existing download-lead pipeline and its logging table.

## 4. Expanded matrix and per-part SEO pages

- Dimensional data extended to Classes 900, 1500 and 2500, schedules 5S/10S/20/30/40/60/80/120/160/XXS, and new families: short-radius 90/45 elbows, reducing tee, lateral, cross, stub end (Type A/B), eccentric reducer, long weld-neck, blind and socket-weld flanges.
- Facing types RF, RTJ and FF selectable on flange families, affecting the drawing, the viewer and the part code.
- Programmatic pages at `/cad/{family}/nps-{size}/class-{class}` (and `/sch-{schedule}` for buttweld families), each with its own title, description, dimension table, viewer, drawing and downloads, plus breadcrumbs and Product structured data.
- Full matrix published: an index at `/cad/library` with family and size filters, cross-links to the matching grade x product pages, and the sitemap extended to cover every generated page.

## Design and motion

Dark slate/charcoal sheet backgrounds with gold accents, accordion configurator sections that expand smoothly, bento-style family grid with hover elevation, and fast cross-fades when size or class changes. All motion respects reduced-motion settings.

## Technical details

- New deps: `three`, `@react-three/fiber`, `@react-three/drei` (React 19 majors), loaded client-side only via `ssr: false` / lazy chunks so server rendering is unaffected.
- `src/data/cad.ts` expanded (new class tables, schedule tables, new family definitions, facing data); `src/lib/cadgen.ts` extended for new kinds plus a shared geometry builder consumed by both the STL writer and the viewer.
- New files: `src/components/cad/PartViewer.tsx`, `src/components/cad/DrawingSheet.tsx`, `src/components/cad/CadDownloadGate.tsx`, `src/lib/cad-drawing-pdf.ts` (jsPDF, reusing the logo and brand styling from the quotation PDF), `src/routes/cad.library.tsx`, `src/routes/cad.$family.nps-$size.$spec.tsx`.
- Lead capture reuses `documents.functions.ts` / `documents.server.ts` patterns with a new `cad_downloads` migration including GRANTs and RLS (insert via server only, no public reads).
- Sitemap route extended to enumerate matrix pages.

## Out of scope

No changes to any team, employee or staff bios, photos or personnel pages. No changes to grade data, RFQ workflow or existing product copy.
