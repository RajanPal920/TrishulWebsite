# Add Project Snapshots Section to the Client Trust Feed

Add a "Project Snapshots" section near the existing "Proof of supply" trust feed on `/clients`. The section will surface 2–3 anonymized project case studies, each clearly marked as a placeholder until real project data is confirmed.

## What to build

1. **Data** — Extend `src/data/clients.ts` with a new `ProjectSnapshot` type and a `projectSnapshots` array of 2–3 entries. Each entry contains:
   - `sector` (e.g., Offshore Oil & Gas)
   - `project` (e.g., Offshore platform project, Middle East)
   - `product` (e.g., Super Duplex 2507 weld-neck flanges)
   - `orderSize` (e.g., ~2.3 t)
   - `outcome` (e.g., Witnessed TPI inspection, zero NCRs)
   - `placeholder: true` flag

2. **UI** — Add a new "Project Snapshots" section to `src/routes/clients.tsx`, placed after the existing "Proof of supply" dispatch-stats block and before the "Dispatch records" case-card section. Use the existing `surface-panel` card style, `eyebrow` labels, and muted typography so it matches the rest of the page.

3. **Placeholder marker** — Render a prominent `[PLACEHOLDER — confirm with real project data]` badge/label on every snapshot card so it is obvious the data is illustrative and must be replaced before going live.

4. **Anonymization** — Do not include specific client company names, project names, or locations that could identify a customer. Use generic sector/region descriptors only.

5. **Meta** — Optionally update the `/clients` page meta description to mention anonymized project snapshots, staying under 160 characters.

## Files to change

- `src/data/clients.ts` — add `ProjectSnapshot` type and `projectSnapshots` array.
- `src/routes/clients.tsx` — render the new section using the snapshot data.

## Validation

- Run `bunx tsgo` to confirm type safety.
- Verify the placeholder badge is visible on every snapshot card in the preview.
- Confirm no client names appear in the placeholder copy.