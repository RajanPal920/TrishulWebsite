# Technical icon set for the homepage cards

## Audit result

The site currently uses **no icons** in any page or section. Every card in "Why Trishul", "Where we export", the buyer-tools grid and the credential badge row is built from typography, thin gold rules, small gold squares and dashes. There are no generic consumer-app icons anywhere to clean up.

The only stock icon in the whole project is the small close cross inside the download pop-up window.

## What gets built

A small custom SVG icon set drawn in the site's own visual language: thin 1.5px lines, no rounded consumer-app shapes, square ends, technical-drawing feel. Icons sit at about 20px above each card label, in gold where the card is a feature and muted slate elsewhere. They read as quiet technical annotations, not decoration.

### Where they appear

**Why Trishul (4 cards)** — one mark per trust point, drawn from the actual subject matter: a certificate sheet, an inspection/measurement mark, a heat-number tag, a stock-rack profile.

**Where we export (4 cards)** — Middle East & GCC, Europe, Africa, Worldwide: each gets a restrained geographic/technical mark rather than a flag or a generic globe, keeping the region cards visually parallel.

**Buyer tools (6 cards)** — CAD & BIM, landed cost, live stock, proof of supply, client portal, calculators: one purpose-drawn mark each, matched to what the tool does.

### Consistency rules applied

- One shared icon component so size, stroke width and colour are set in a single place.
- Two contexts only: card icons at 20px, and the pop-up close cross at 16px — no third size introduced.
- Gold accent on feature cards, muted slate on secondary cards, matching the existing card hierarchy.
- Hover shifts the icon from muted to gold using the same 250-300ms easing already used on card hovers; no movement, no bounce.
- Reduced-motion visitors get the colour change instantly with no transition.
- All icons are decorative and hidden from screen readers, since each already sits beside a text label.

### The one existing stock icon

The download pop-up's close cross is restyled to the same thin-line, gold-on-hover treatment so it no longer looks like a default component.

## Technical notes

- New `src/components/site/icons.tsx` exporting a shared `TechIcon` wrapper (`strokeWidth={1.5}`, `currentColor`, `aria-hidden`, fixed 20px box) plus the named path components.
- Icons rendered inside `src/routes/index.tsx` for the three card groups; `CardLink` in `src/components/site/parts.tsx` gains an optional icon slot rendered above the eyebrow, so cards without an icon are unchanged.
- Colour via `text-primary` / `text-muted-foreground` tokens only; no hardcoded hex.
- Hover handled with existing `group-hover:` colour transition classes on the card, consistent with the current interaction language.
- `src/components/ui/dialog.tsx` close icon gets stroke width and token colour treatment.
- No changes to copy, links, layout, SEO, the bento section, Grade Finder, RFQ flows, or any team/employee content.

## Verification

Screenshots at 390 and 1280, check for horizontal overflow at 390/768/1280/1536, confirm keyboard focus and reduced-motion behaviour are unaffected, and confirm a clean build.

## Report back

A list of every icon added and where, plus the one stock icon restyled.
