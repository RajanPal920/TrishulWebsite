# Gated certificate downloads on the Quality page

All six certificate PDFs are now readable, so each credential card on the Quality page gets its own gated download — the same contact form already used for the catalogue and technical guide.

## Documents to add

| Credential card | File |
| --- | --- |
| ISO 9001:2015 | TRISHUL_ISO.pdf |
| Importer-Exporter Code (IEC) | IEC_Code.pdf |
| GST Registration | Gst_Certificate.pdf |
| MSME / Udyam Registration | MSME_Udyam_Registration.pdf |
| Startup India — DPIIT Recognition | StartUp_India.pdf |
| CIFFA — International Freight Forwarding | CIFFA_Certified_International_Freigt_Forwarder.pdf |

Each is stored in the existing private documents area — no public link, and the file is only released through a short-lived link after the form is completed.

## What changes on the page

- Each of the six credential cards gains a "Download certificate (PDF)" action below its existing text, next to the current "Verify" link where one exists.
- Clicking it opens the same contact form used elsewhere (name and company optional, email and phone required). Details already entered in this browser session are pre-filled, so a buyer collecting several certificates only types once.
- Every download is recorded against the specific certificate, so you can see exactly which document each lead took.
- Card text, credential numbers, validity dates, wording, layout and the Downloads & resources section stay exactly as they are.
- Notification emails will keep degrading gracefully until sending from your own domain is set up.

## Not touched

- No team, staff or personnel content anywhere.
- No changes to the catalogue and technical guide cards, or to any other page.

## Technical notes

- Upload the six PDFs to the private `documents` bucket under `certificates/<key>.pdf` using the storage upload tool.
- Extend `DOCUMENT_REGISTRY` in `src/lib/documents.server.ts` with six new keys (`iso-9001`, `iec-code`, `gst-certificate`, `udyam-registration`, `dpiit-recognition`, `ciffa-certificate`). Server-side key validation and the 120-second signed URL flow are unchanged.
- Add an optional `documentKey` to the `Credential` type in `src/data/company.ts` and set it on the six entries.
- Add a small `DownloadLink` export in `src/components/site/DownloadGate.tsx` (reuses `DownloadGate`, renders a text-style trigger rather than a card) and render it in the credentials cards in `src/routes/quality.tsx` when `documentKey` is present.
- Verify: each of the six returns a valid PDF through the signed URL, the direct public object URL stays blocked, lead rows record the right `document_key`, test leads deleted, type-check and build clean.
