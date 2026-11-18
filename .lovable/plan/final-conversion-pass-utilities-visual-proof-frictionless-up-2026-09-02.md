# Final conversion pass: utilities, visual proof, frictionless uploads

Current state confirmed by reading the code: the equivalent-grade / size finder exists but only on `/tools` and the homepage; the quality page carries the MTC specimen plus one dossier photo but no packaging visuals; the RFQ form already has a drag-and-drop zone accepting XLSX/CSV/PDF/DWG/DXF/DOC/ZIP/images, max 6 files at 10 MB. These three areas get tightened rather than rebuilt.

## 1. Quick lookup everywhere, not just on /tools

- Add a compact variant of the Controlled Size Selector & Equivalent Grade Finder to every alloy grade page, pre-selected to that grade, so an engineer landing from Google checks UNS/Werkstoff/DIN/JIS and NPS/class/facing without scrolling.
- Add the same compact finder to grade x product (matrix) pages, pre-filled with grade and product form.
- Add a persistent "Quick lookup" entry in the header utility bar that opens the finder in a dialog from any page.
- Let the finder deep-link and be deep-linked: reading `?grade=&nps=&class=&facing=` from the URL and updating it as selections change, so results are shareable in procurement email threads.

## 2. Visual proof on quality and export packing

- New "Export packing standards" section on `/quality`: photography of ISPM-15 fumigated plywood cases with stencilled shipping marks, VCI-wrapped and end-capped pipe bundles, banded flange stacks on pallets, and a close macro of hard-stamped heat numbers. Generated as new industrial photography in the existing gold/graphite look.
- Add a packing-and-marking specification panel next to the photos (case construction, moisture barrier, marking format, container stuffing, ISPM-15 statement).
- Add a redacted specimen Packing List / Marking sheet document laid out like the existing MTC/PMI/TPI specimens, with a branded PDF download using the current generator.
- Surface the same packing visuals on the shipping/procurement section so the proof appears where logistics objections arise.

## 3. Frictionless bulk uploads on the RFQ

- Raise capacity to 10 files at 25 MB each and widen accepted CAD/MTO types to `.step/.stp/.iges/.igs/.dwf/.xlsm/.rar/.7z` alongside the current set.
- Whole-form drop target: dragging files anywhere over the RFQ page highlights and accepts the drop, not just the dashed box.
- Explicit feedback when a file is rejected (wrong type, too large) instead of silent drop, plus per-file upload progress and a clear queued/uploaded state.
- Support paste-from-clipboard for screenshots and drag from Outlook/Explorer, and show total payload size against the limit.
- Confirmation screen keeps the reference number and lists every attachment received, so the buyer has proof the MTO landed.

## Technical notes

- Finder gets an optional compact layout and controlled URL-state props; no duplicate component.
- New packing specimen data module and a `downloadPackingSpecimen` generator alongside the existing MTC/PMI/TPI PDF helpers.
- Upload limits raised in both the client form and the Zod schema in `src/lib/rfq.server.ts`, keeping the extension allow-list in sync on both sides.
- New photography stored as project assets and rendered lazily with explicit dimensions; existing gold/graphite tokens only, no new colours.
