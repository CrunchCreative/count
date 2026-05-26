# @count/ui

Shared React Native component library for Count.

This is the implementation of the design-system vocabulary documented at `docs/design-source/the-count-v2/project/`. Every reusable primitive in the Count app lives here — Safe @ pills, signal badges, form/score/status pills, glass dropdowns, segmented controls, glowing tab underlines, tug-of-war charts, the slip bar, the bottom nav, and the chart family.

## How it relates to the source

The source design system uses JSX with web CSS. This package re-implements those primitives using React Native's `View`, `Text`, `Pressable`, and SVG primitives, styled via NativeWind utility classes that resolve to design tokens from `@count/tokens`. Visual output should match the source pixel-for-pixel; internal structure is rewritten to suit native idioms.

## Adding a component

1. Read the corresponding source file in `docs/design-source/the-count-v2/project/components/`.
2. Read the relevant `preview/` HTML for the same component as a single-component visual reference.
3. Write the React Native version under `src/components/<ComponentName>.tsx`.
4. Export it from `src/index.ts`.
5. Cross-check against the non-negotiables in `docs/DESIGN.md` before committing.
