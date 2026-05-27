# Phase 4A.1 — Pressable array-style regressions + Tab structural rewrite

Surgical fix pass against the Phase 4A delivery. Three on-device rendering
bugs, one shared root cause (gotcha #10 — RN's `Pressable` silently drops
layout/visual properties from array-form `style` props), plus one structural
rewrite of `Tab.tsx` whose visual divergence from the design source had
gone unnoticed until the device check.

## On-device symptoms (pre-fix)

1. **Tab strip unreadable.** Four tab labels rendered run-on
   ("OverviewTeam statsPlayer statsThe Count"). No active underline. Active
   label colour was wrong (white, source calls for amber).
2. **Strongest Angles rows collapsed vertically.** SafePill stretched
   full-width across the top, title/body/glyph stacked below it. `flexDirection: 'row'`
   et al. were dropped by Pressable's array-style flattening.
3. **Build-a-builder buttons had no tinted fill.** Text colours rendered,
   gradients/borders did not. Same root cause — Pressable array style.

## Root cause (gotcha #10, expanded)

Phase 4A's brief asserted the `Pressable` array form was safe when all array
elements were module-scope static objects. That was wrong. The correct rule
is stricter: **any Pressable whose `style` carries layout or visual props
must receive a SINGLE merged static `ViewStyle` object, never an array.**
The opacity-only conditional pattern (`pressed ? opacityStyle : null` inside
an array) survives RN's flattening because `opacity` happens to be one of
the few properties that does — but every Pressable in Phase 4A's output
had paddings, gaps, flexDirection, or borders mixed into the array, all of
which were silently lost. Canonical correct pattern: `DateChip.tsx` (Phase
3.6.2 fix).

## Files changed (4)

| File | Lines | Notes |
|---|---|---|
| `packages/ui/src/components/Tab.tsx` | 112 (full rewrite, 99 lines changed) | Single static Pressable style; children-as-function inner View; corrects 3 source divergences |
| `packages/ui/src/components/TabStrip.tsx` | 44 (11 lines changed) | `marginTop: 6` per source `.tabs`; bottom hairline bumped to 1pt @ 0.14 alpha |
| `apps/mobile/src/components/fixture/StrongestAnglesPanel.tsx` | 183 (~35 lines changed inside the AngleRow + styles block) | Pressable owns only the conditional border-top; layout + opacity move to inner View |
| `apps/mobile/src/components/fixture/BuildABuilderPanel.tsx` | 211 (~50 lines changed inside the BuilderButton + styles block) | Tone-keyed pre-merged style records; gradient + opacity on inner View |

Touched nothing else. `SafePill.tsx` and `IconButton.tsx` keep their array
form because their arrays contain only an opacity conditional (safe). The
route file `apps/mobile/app/fixture/[id].tsx`, the mock layer, the type
extension, and every other Overview component were left alone.

## Structural divergences corrected in Tab.tsx

The Pressable bug was only one of three problems with the previous Tab. The
rewrite also corrected:

1. **Equal-width segments.** Old: `marginRight: 20` between tabs (so the
   four labels left-aligned with growing gap on the right). New: `flex: 1`
   on each Tab so the parent TabStrip's `flexDirection: 'row'` divides
   width equally — matches source `grid-template-columns: repeat(4, 1fr)`
   (styles.css line 378).
2. **Active label colour.** Old: `colors.text.primary` (white). New:
   `colors.amber.bright` per styles.css line 394
   (`.tab.active { color: var(--amber-bright); }`).
3. **Underline geometry.** Old: 3px height, 0%→100% full-width. New: 1.5px
   height, inset 15% on each side, per source `.tab.active::after`
   (styles.css line 395). Source has a `box-shadow` amber glow that RN
   doesn't reliably render on `LinearGradient` — skipped for this fix, the
   underline reads clearly without it.

## Press-feedback pattern chosen — Option C

The Pressable's own `style` is now always a single static object. Press
feedback moves to a children-as-function child View: the Pressable receives
`children={({ pressed }) => <View style={pressed ? pressedInner : inner}>…</View>}`.
The inner View's own static style swaps between two pre-merged objects on
press. This matches gotcha #9's "paint visuals on a child `<View>` whose
own style is deterministic" rule and keeps the Pressable's style prop
unconditional.

Same pattern applied to all four affected pressables:
- `Tab` — inner View carries padding, position context, opacity-on-press.
- `AngleRow` — inner View carries `flexDirection: 'row'`, gap, padding,
  opacity-on-press; Pressable owns only the conditional border-top.
- `BuilderButton` — inner View carries padding, centring, position context
  for the absolute gradient, opacity-on-press; Pressable owns flex + border
  + rounded corners + iOS amber shadow.

## Gotcha #11 follow-through

The brief flagged `colors.border.default` (`rgba(255,255,255,0.06)`) as
invisible on iPhone dark backgrounds. While in the same files, replaced
every hairline-at-default-alpha border with 1pt @ 0.14:

- `TabStrip` bottom border
- `AngleRow` top divider
- `addGlyphBox` border
- `BuilderButton` (neutral tone) border

Teal/amber tones already used 0.30 alpha — left as-is.

## Verification

- `pnpm typecheck` — clean across all six workspace packages.
- `npx expo export --platform ios` from `apps/mobile/` — bundled cleanly,
  4.08 MB hbc, no warnings.
- On-device check via Expo Go: not performed in this fix pass; expected
  outcomes per the brief's §5 checklist.

## What the agent surfaced

The previous `Tab.tsx` was an outright design miss, not just a `Pressable`
bug — `marginRight: 20`, white active label, 3px underline were all
divergences from the source that survived the Phase 3 implementation and
the Phase 4A review. The Pressable rewrite was the trigger to look at it
again; the geometry/colour fixes are independent and would have been
needed even if the array bug never existed.

The `addGlyphBox` styles in `StrongestAnglesPanel.tsx` were inside a plain
`View`, not a `Pressable`, so the array form wasn't unsafe there. Still
collapsed to a single ternary between two pre-merged objects for file-level
consistency — one pattern across the codebase reads more cleanly than
two.

No new gotchas surfaced; #10 and #11 covered everything seen here.
