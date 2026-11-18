# Trim homepage meta descriptions to under 155 characters

## What we will change
Update only the meta tags in `src/routes/index.tsx`:
- `name: "description"`
- `property: "og:description"`
- `name: "twitter:description"` (new entry)

## Exact copy
Use this single sentence (153 characters):

```text
Mumbai-based exporter of Corrosion-Resistant Alloy (CRA) flanges & pipe fittings - Inconel, duplex, super duplex, stainless - to ASTM/ASME, EN 10204 3.1.
```

## What we will NOT change
- Any visible on-page copy, headings, body text, or CTAs.
- The existing `title`, `og:title`, `og:type`, `og:image`, `twitter:image`, `og:url`, or canonical link.
- Any other routes or data files.

## Verification
- `bunx tsgo` type-check.
- Inspect page source to confirm the three description tags match and are ≤ 155 characters.
