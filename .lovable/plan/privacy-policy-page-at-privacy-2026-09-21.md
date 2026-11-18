# Privacy Policy page at /privacy

## Summary

Add a new content route at `/privacy` carrying the twelve-section Privacy Policy you supplied, styled with the same layout components used by `/faq` and `/about` (breadcrumbs, eyebrow + heading type, section rules, gold accents). Add a "Privacy Policy" link in the footer next to the existing LinkedIn link. No existing content is removed or reworded, and no team/employee content is touched.

## What you'll see

- A page at `https://www.trishulmetal.com/privacy` (and in the preview at `/privacy`) with:
  - Breadcrumb row: Home / Privacy Policy
  - H1 "Privacy Policy" with a small uppercase eyebrow and the line **Last updated: 21-09-2026**
  - Twelve numbered sections, each with a clear heading, body text at the same reading width as the rest of the site, and bullet rows for the data-collection list
  - A closing contact row with a clickable `contactustrishul@gmail.com` link, the Durgadevi Street postal address, and a link to `/contact`
- A "Privacy Policy" entry in the footer's Company column, directly below the LinkedIn entry, in the same link style.

## Page structure

```text
Section (border-b)
  Breadcrumbs: Home / Privacy Policy
  Eyebrow: Legal
  H1: Privacy Policy
  Last updated: 21-09-2026   (mono, uppercase, muted)

Section  1. Who we are
Section  2. What personal data we collect      -> 4 bullet rows
Section  3. How we use your data
Section  4. Who we share data with
Section  5. International data transfers
Section  6. Data retention
Section  7. Your rights
Section  8. Cookies
Section  9. Security
Section 10. Children's data
Section 11. Changes to this policy
Section 12. Contact us                          -> email + address + /contact link
```

Sections are held in one typed list in the route file (number, title, paragraphs or bullets) and rendered through the shared `Section`, `SectionHead`-style headings and `BulletList` components, so the type scale, muted body colour, gold accents and max reading width match the rest of the site exactly. Thin rules and alternating background tones follow the same rhythm used on `/faq`.

## Technical details

- **New file:** `src/routes/privacy.tsx` with `createFileRoute("/privacy")` — the filename maps to the route ID, so `routeTree.gen.ts` regenerates automatically and the footer `Link to="/privacy"` typechecks.
- **Shared components reused:** `Section`, `Breadcrumbs`, `BulletList` from `src/components/site/parts.tsx`. No new CSS, no new dependencies.
- **`head()` metadata on the route:** title "Privacy Policy — Trishul Metals & Alloys", a unique meta description, `og:title` / `og:description` / `og:type: website` / `og:url`, `twitter:card`, and a `canonical` link to `/privacy` — matching the pattern on `/faq` and `/about`. No `og:image`, since the page shows no hero image (the rule is to only tag an image a page actually displays).
- **Copy fidelity:** all twelve sections reproduce your text verbatim. The office address and the privacy email match what the site already publishes (`company.address`, `company.email` = `contactustrishul@gmail.com`), so the page stays consistent with the footer and Contact page.
- **Footer edit:** one new `<li>` in `src/components/site/Footer.tsx`, in the Company column immediately after the LinkedIn item, using the same `Link` styling as the other footer entries. Nothing else in the footer changes.
- **Deliberately out of scope** (say the word and I'll add either): the page is not listed in `sitemap.xml` or in the `llms.txt` "Key pages" block, and it is not added to the top navigation. Legal pages are commonly excluded from both.
- **Untouched:** `src/routes/clients.tsx`, `src/routes/portal.tsx`, all team/employee/staff content, and every existing route.

## Verification

- Typecheck (`bunx tsgo --noEmit`) and dev build; confirm `build-errors.log` shows a clean build.
- Drive the running preview: click the footer "Privacy Policy" link, confirm it lands on `/privacy`, all twelve headings render in order, the bullet list shows four items, and the email link resolves to `mailto:contactustrishul@gmail.com`.
- Confirm served HTML contains the real copy (SSR, not client-only), and the page `<title>` / description / canonical appear correctly.
- Screenshots at 390, 768 and 1280 CSS px; confirm no horizontal overflow and visible keyboard focus on the footer and contact links.
