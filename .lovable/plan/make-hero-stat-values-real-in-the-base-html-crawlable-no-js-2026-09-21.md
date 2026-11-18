# Make hero stat values real in the base HTML (crawlable, no-JS safe)

## Problem

In `src/components/site/HomeHero.tsx`, the `CountUp` component initializes its state to `0`:

```tsx
const [value, setValue] = useState(reduceMotion ? end : 0);
```

Server-side render (and first paint, no-JS, crawlers, slow connections) therefore emit `0`, `0 – 0`, and `0.0` for all four stats instead of the real values 28, 18, 150 – 2500, and 3.1. The real numbers only appear after JavaScript hydrates, `useInView` fires, and the rAF count-up runs.

## Fix (single file: `src/components/site/HomeHero.tsx`)

Rework `CountUp` as progressive enhancement:

1. **Initial state is the real value**: `useState(end)` — the SSR/prerendered HTML and first paint always contain 28, 18, 150 – 2500, 3.1. Crawlers, no-JS users, and slow connections see the truth immediately and permanently.
2. **Animation starts only after hydration and only when the animation actually triggers**: inside `useEffect`, if `prefers-reduced-motion` is not set and the element scrolls into view, reset the displayed value to the animation start and run the existing rAF eased count-up back to `end`. The "0" state can therefore never appear in the served HTML or before the animation triggers — it exists only momentarily on-screen for motion-enabled JS users while the effect runs.
3. **Reduced motion unchanged**: with `prefers-reduced-motion: reduce`, no reset and no rAF — the final value simply stays on screen (already the behavior, preserved).
4. Guard the effect with a `hasAnimated` ref so the reset-to-animate happens at most once (`useInView` already uses `once: true`).

The `divisor`/`suffix` formatting, the `useHydrationSafeReducedMotion` hook, the stat labels, layout, and every other part of the hero stay exactly as they are. No content, links, team content, or other sections touched.

## Verification

- Fetch the prerendered homepage HTML (no JS) and confirm the markup contains `28`, `18`, `150 – 2500`, and `EN 10204 3.1` — no `>0<` stat values.
- Playwright at 1280 and 390, normal motion: count-up still animates on view, ends on the real values.
- Playwright with reduced-motion emulated: final values present instantly, no animation.
- No console/hydration errors, no horizontal overflow, clean build.
