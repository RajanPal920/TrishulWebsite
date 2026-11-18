# Purposeful interaction motion

## Goal
Add one restrained B2B interaction language across the requested catalogue cards, primary gold calls-to-action, and buyer configuration results, while preserving every link, value, form behavior, and the existing native scroll reveals.

## Changes

### 1. Shared card hover treatment
- Add an opt-in premium interaction treatment to the shared catalogue-card component and enable it for:
  - material-family cards
  - industry cards
  - homepage buyer-tool cards
- Use Motion for React for a smooth `1.02` hover scale over roughly `275ms`.
- Add a subtle gold gradient border sweep and soft token-based glow, keeping the effect restrained and consistent.
- Keep the existing card imagery, text, links, keyboard focus, and native scroll-entry reveal intact by separating the entry-animation wrapper from the hover-motion element.
- Apply hover motion only on hover-capable pointers; touch interaction remains stable.

### 2. Magnetic primary calls-to-action
- Create a reusable magnetic CTA treatment using Motion values/springs.
- Apply it to the prominent gold quotation and catalogue actions, including the homepage hero actions, shared quotation band, grade finder quote action, and the cut-to-size quote handoff.
- Cursor movement will pull the CTA by no more than 12px and return it smoothly to rest on pointer exit.
- Add a restrained soft gold glow pulse while hovered; preserve click targets, navigation, focus rings, disabled behavior, and all RFQ search/hash data.
- Do not apply the effect to small utility controls, filter chips, destructive actions, or mobile/coarse-pointer interactions.

### 3. Configurator result cross-fades
- In the controlled size selector / equivalent grade finder, cross-fade these independently when relevant selections change:
  - designation cross-reference table
  - calculated dimensions / weight / rating result table
  - matching product-page links
- Key the result animation from the selected grade, product form, dimensions, pressure class, schedule, and facing so updates visibly correspond to the buyer’s change.
- Use a short opacity transition with minimal vertical movement and stable layout, avoiding a blank or distracting intermediate state.
- Apply the same concise cross-fade to the standalone Grade Equivalency Lookup results when its search or family filter changes.

### 4. Accessibility and verification
- Use `prefers-reduced-motion` throughout: no magnetic movement, no card scaling/sweep, and near-instant result changes with final content shown immediately.
- Retain visible keyboard focus and ensure keyboard users do not receive pointer-only displacement.
- Verify card hover, CTA cursor response and reset, selector cross-fades, RFQ navigation/prefill integrity, and reduced-motion behavior.
- Check 390, 768, 1280, and 1536px widths for overflow, and confirm no console errors and a clean build.

## Scope protection
- No copy, SEO, data, RFQ logic, team/employee/staff content, imagery, or page structure changes.
- Existing bento/configurator interaction motion and native CSS scroll-entry animation remain unchanged except where composition is required to prevent transform conflicts.
