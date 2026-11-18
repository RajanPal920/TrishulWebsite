# Update homepage CRA grade count from 36 to 28

Adjust only the hero stat counter and CTA button on the homepage to reflect the established CRA / supporting-grade split. No grade data, family card counts, or personnel content is changed.

## Scope

- File: `src/routes/index.tsx` only.
- No changes to `src/data/materials.ts` or any material dataset.
- No changes to team/employee/staff content.

## Changes

1. **Hero stat counter** (currently `"36" / "CRA grades documented"`):
   - Change primary value to `"28 CRA grades documented"`.
   - Add a smaller secondary line beneath the first stat reading `"+ 8 supporting stainless grades"` using the existing muted small text style.

2. **Hero CTA button** (currently `"Browse 36 CRA grades"`):
   - Change label to `"Browse 28 CRA grades"`.

## Verification

- `bunx tsgo` type-check.
- Playwright screenshot of the homepage hero to confirm the stat and button labels render correctly and the secondary line does not break the 4-column stat grid.
