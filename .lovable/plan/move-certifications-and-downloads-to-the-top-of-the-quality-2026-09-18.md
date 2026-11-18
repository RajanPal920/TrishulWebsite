# Move Certifications and Downloads to the top of the Quality page

Both sections currently sit near the bottom of the Quality page, after the FAQ. They will move up so buyers see the verifiable credentials and the catalogue / technical guide downloads straight after the page heading.

## New order on /quality

```text
1. Page heading (breadcrumb + title)          stays first
2. Certifications & registrations             moved up
3. Downloads & resources                      moved up
4. Certification package & available test scope
5. Sample mill test certificate
6. PMI and third-party inspection specimens
7. MTC batch verification
8. Export packing
9. NORSOK M-630
10. FAQ
11. Standards and approvals
12. "Request a quote" band
```

Everything else keeps its current position and wording.

## What stays untouched

- All six credential cards: names, issuers, certificate numbers, validity dates, "Verify" links and the gated "Download certificate (PDF)" action.
- The catalogue and technical guide cards and their contact-form gate.
- Section headings and intro text — no copy changes.
- Any other page.

## Technical notes

- Single file change: `src/routes/quality.tsx`. The two `<Section>` blocks (Certifications & registrations, Downloads & resources) are cut from their current position and re-inserted directly after the opening heading section, in that order.
- The moved Certifications block loses its `border-t border-border` class because the heading section above it already carries `border-b`, avoiding a doubled rule line; the Downloads block keeps its top border.
- No data, registry, storage or component changes — `credentials`, `DOCUMENT_REGISTRY`, `DownloadCard` and `DownloadLink` are reused as-is.
- Verify: build clean, both sections render directly under the page title with no doubled divider, one certificate download and one catalogue download still complete end to end through the contact form, and the remaining sections appear in the order above.
