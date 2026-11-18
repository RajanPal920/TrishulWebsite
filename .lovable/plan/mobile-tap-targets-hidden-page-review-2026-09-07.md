# Mobile tap targets + hidden-page review

## Check 1 — pages hidden from search

Only two kinds of pages carry a "hide from search" tag, and both look deliberate:

- The customer portal page — hidden on purpose (private login area).
- The "not found" fallback message shown when someone opens a grade, product, industry or article address that does not exist. Real grade/product/industry/article pages are not hidden.

No ordinary page is accidentally hidden. Nothing here changes search visibility unless you decide the portal should be findable.

Proposed: leave the not-found fallbacks as they are, and leave the portal hidden. Nothing to publish for search timing. If you want the portal listed in search, say so and it becomes a one-line change.

## Check 2 — tap targets on phones (what fails)

Measured on a 390px-wide phone screen across the home, tools, materials, products, quote and contact pages. These are smaller than the ~44px minimum:

- The MENU button in the header — 35px tall.
- Top breadcrumb links (HOME, MATERIALS, …) — 17px tall.
- Grade finder: the search box and the grade dropdown — 37-38px tall.
- Size selector: the six form buttons (Flange, Pipe/Tube, Sheet/Plate, Ring, Circle, Round Bar) — 30px tall; the size, class, schedule and face dropdowns — 37px tall.
- Grade finder product links (Weld Neck Flanges, Slip-On, Blind, …) — 30px tall.
- Tools page filter chips (ALL, NICKEL ALLOY, DUPLEX, …) — 31px tall.
- Quote form: text fields and the unit dropdown — 37-38px; the "Add another line" button — 38px; all testing chips (PMI, HYDROSTATIC, UT/ET, …) — 33px tall.
- Footer and in-page text links (phone number, grade lists, "All CRA grades", section links) — 17px tall.
- Inline "→" links inside sections — 17-38px tall.

## Fix approach

Raise the touch area to at least 44px on phone widths only; desktop spacing stays exactly as it is today.

- Buttons, chips, form fields and dropdowns: increase their height on small screens so each reaches 44px, keeping the same text size and gold styling.
- Text links in lists, footers and breadcrumbs: add vertical breathing room around each link so the tappable area reaches 44px without visibly changing the text or the layout rhythm.
- The header MENU button gets a slightly larger hit area.

No wording, pricing, specification, image or personnel content is touched. Purely spacing and sizing on phone widths.

## Technical notes

- Add small-screen minimum-height and padding utilities to the shared button/chip/input primitives in `src/components/site/parts.tsx` and the form controls in the size selector, grade finder, tools filters and RFQ form, rather than per-instance patches where a shared primitive exists.
- For inline text links, apply a `py` bump gated to the mobile breakpoint (`max-sm`) so desktop line spacing is unchanged.
- Verify by re-running the Playwright measurement pass at 390x1400 across `/`, `/tools`, `/materials/duplex-2205`, `/products`, `/rfq`, `/contact`, `/clients` and confirming the under-44px list is empty (or only decorative non-tap elements remain), plus a desktop screenshot check at 1280 to confirm no visual regression.
