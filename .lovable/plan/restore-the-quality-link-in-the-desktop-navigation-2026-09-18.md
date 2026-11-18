# Restore the Quality link in the desktop navigation

## Diagnosis

The Quality page itself is fine: `/quality` exists, builds cleanly, and returns HTTP 200. The problem is the header link — in `src/components/site/Header.tsx` the "Quality" nav item is marked `xxl: true`, which hides it below the 2xl breakpoint (1536px). That gating was added during the earlier header overflow fix. So on laptop screens (1024–1535px) the link never appears; it only shows in the mobile menu and the footer.

## Fix

- Remove the `xxl` gate from the "Quality" nav item so it is visible at all desktop widths.
- To keep the nav from overflowing at 1024–1440px (the reason the gating existed), demote one lower-priority link instead: keep "Landed cost" and "FAQ" gated (they are also reachable from the footer and Tools), Quality is a core trust page and should be first-class.
- Verify in the browser at 1024, 1280, 1366, 1440 and 1536px: Quality visible, no horizontal overflow, other links still intact.
- Mobile menu and footer already include Quality — no change needed there.

## Not changing

- The `/quality` page content, credentials section, downloads — untouched.
- No team/employee content touched.
