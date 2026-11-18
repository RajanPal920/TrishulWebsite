# Site-wide scroll reveal motion

## Goal
Add one restrained, native CSS reveal language for major section headings and the requested card groups: fade from transparent while moving upward about 20px as each item enters the viewport.

## Implementation
- Add a reusable reveal class to the shared `SectionHead` wrapper so major headings across the site inherit the same treatment without changing their content or hierarchy.
- Add the same reveal class to the shared `CardLink`, covering material-family cards, failure-mode cards, industry cards, and buyer-tool cards wherever those shared cards are used.
- Mark the four custom “Where we export” articles with the reveal class because they do not use `CardLink`.
- Define the effect in `src/styles.css` with `animation-timeline: view()` and a consistent roughly 450ms ease-out reveal over the viewport entry range.
- Place hidden/translated starting styles inside an `@supports (animation-timeline: view())` guard, so browsers without scroll-driven animation support simply show final content rather than hiding it.
- Add a `prefers-reduced-motion: reduce` override that removes the animation and guarantees full opacity and zero translation immediately.
- Leave the hero count-up/load reveal, configurator interaction, and existing animated bento behavior unchanged; do not layer the new card reveal onto the bento cards.

## Verification
- Check representative homepage, Materials, and Industries views at phone and desktop sizes.
- Confirm headings and requested cards reveal on entry, then remain visible.
- Confirm reduced-motion and unsupported-animation behavior show final states immediately.
- Confirm no horizontal overflow, interaction regressions, console errors, or build errors.
- Do not modify team, employee, or staff content.
