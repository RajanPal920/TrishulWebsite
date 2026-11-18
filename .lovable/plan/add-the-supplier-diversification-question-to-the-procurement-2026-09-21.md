# Add the supplier-diversification question to the Procurement FAQ

## Summary

Add one new question-and-answer to the Procurement FAQ page (`/faq`), inside the "Commercial & RFQ workflow" group, using your wording with the third-party inspection line qualified so it matches the rest of the site. The page's search-engine data and its visible question count update automatically once the entry exists, so this stays a single, contained change.

## What appears on the page

The new entry, last in the "Commercial & RFQ workflow" group (it becomes the 6th question there, and the page 21st overall):

**Q:** Does sourcing from Trishul help us diversify our supplier base beyond a single country?

**A:** Many buyers are diversifying sourcing as part of standard supply-chain risk management. Trade-remedy measures and duty treatment vary by product, grade, and destination market, and change through periodic government review — we'd always recommend confirming current classification with your customs or trade compliance team for your specific specification. What we can offer directly: heat-traceable EN 10204 documentation, third-party witnessed inspection available for every consignment when specified, a sample MTC before you order, and sub-6-hour RFQ turnaround — across our full range of CRA and supporting grades.

The only edit to your wording is the third-party inspection line, per your choice. Everything else — the "confirm with your own customs team" honesty, the absence of tariff figures and country-vs-country claims — stays exactly as you wrote it.

## How it is built

- **One new entry in the shared FAQ list.** The FAQ page, its four category groups, and the question counts shown above each group are all generated from a single list, so the new answer appears in the right group and the "6 questions" label updates on its own.
- **Search-engine data picks it up automatically.** The page already publishes every entry in that list as structured FAQ data for Google, so the new question becomes eligible for rich results with no extra step.
- **The hard-coded word "Twenty" becomes a live count.** The page title, the main heading and the search-result description currently say "Twenty" in three places. Those will be derived from the list itself, so the copy reads "21" now and stays correct whenever a question is added or removed later.
- **No other pages or sections touched.** The homepage supply-diversification section, the regional export cards, the Grade Finder, the bento, the RFQ flows and all team/employee content are left exactly as they are.

## Technical details

- `src/data/faq.ts`: append one object to `faqMatrix` with `category: "commercial"`, placed after the existing payment-terms entry (the group's order in the array is the order rendered).
- `src/routes/faq.tsx`: replace the three literal "Twenty" strings (the `<title>`/`og:title` description at the top of the file, the `SectionHead` title, and the `description`/`og:description` meta) with values interpolated from `faqMatrix.length`. The `FAQPage` JSON-LD block already maps over `faqMatrix`, so it needs no change.
- No new components, no new dependencies, no database or backend changes.
- Claim hygiene held: no tariff percentages, no anti-dumping or duty-avoidance figures, no country-vs-country cost comparisons, and no mention of Russia, Iran or any other sanctioned destination.

## Verification

- Typecheck and a clean build, with the build log checked for new errors.
- A browser pass at desktop (1280) and phone (390) widths confirming: the question renders under "Commercial & RFQ workflow" and expands to the full answer; that group's eyebrow reads "6 questions"; the page heading and browser tab read "21"; the published FAQ data contains 21 questions including the new one with the qualified inspection wording; no horizontal overflow; no console errors.

## One thing I noticed while checking (your call)

The "FAQ" item in the top menu is currently only shown on very wide screens — the same hidden-menu behaviour that made the Quality page hard to find, which you asked me to fix. I can drop that restriction so FAQ is visible in the menu at normal desktop widths too. Say the word and I'll include it; otherwise I'll leave the menu untouched.
