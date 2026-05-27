# Phase 4B.1 — Team-stats refinement pass

Visual + typographic correction layered over the Phase 4B matrix scaffolding. Scroll-sync, type model, mock synthesiser, and tab routing are untouched. Six fixes shipped: matrix grid resized, sticky-left restructured, `SafePill` gains a `size='large'` variant, `GlassSelect` gains an optional prefix `label`, `XGContextBlock` redrawn compact, and the H/A indicator moved from the scoreline to the fixture header.

## Files touched

| File | Change |
|---|---|
| `packages/ui/src/components/SafePill.tsx` | Size enum renamed `'std' \| 'mini'` → `'small' \| 'large'`. `mini` rendering path removed (unused). New `large` variant: mono numerics, bigger paddings, iOS tier-tinted shadow on teal/amber. |
| `packages/ui/src/components/GlassSelect.tsx` | Optional `label?: string` prop. Renders before the value with a small dot separator. Independent of `filteringActive`. |
| `packages/ui/src/components/FixtureListCard.tsx` | 2× `size="std"` → `size="small"` (forced consequence of the rename). |
| `packages/ui/src/components/NotePadLegRow.tsx` | 1× `size="std"` → `size="small"`. |
| `apps/mobile/src/components/fixture/matrix-constants.ts` | `STICKY_COL_WIDTH 140 → 96`, `CELL_WIDTH 26 → 44`, `CELL_GAP 6 → 4`, `ROW_HEIGHT_STAT 40 → 48`. Other row heights unchanged. |
| `apps/mobile/src/components/fixture/MatrixCell.tsx` | New `CELL_BOX_SIZE = 36` (cell-internal). Cell now renders a `CELL_WIDTH × ROW_HEIGHT_STAT` slot with the 36×36 box centred. Text scaled 11pt → 13pt. |
| `apps/mobile/src/components/fixture/MatrixRow.tsx` | Sticky-left stat row now stacks vertically (stat name above, large SafePill below) instead of side-by-side. New `MatrixConsistencyHeader` export. Both row halves accept `isFirstInCategory: boolean` to gate a within-category hairline divider on the top of every non-first stat row. `MatrixFixtureHeaderRow` opp code now renders `BRE (A)` / `BRE (H)`. |
| `apps/mobile/src/components/fixture/MatrixSide.tsx` | Replaced the two blank spacers above the sticky-left stat rows with `<MatrixConsistencyHeader />`. Threads `isFirstInCategory={si === 0}` to both halves. |
| `apps/mobile/src/components/fixture/XGContextBlock.tsx` | Full rewrite. Compact two-line layout per panel: kit + name on line 1, `XG : 2.4 \| XGOT : 1.6` on line 2. All metric-line text shares one `METRIC_FONT_SIZE`; iOS adds `textShadow` glow to values. |
| `apps/mobile/src/components/fixture/TeamStatsTab.tsx` | One-line addition: `label="WINDOW"` on `GlassSelect`. |

## Decisions resolved during the pass

1. **`oppHome` interpretation.** Brief flagged ambiguity. Resolved as: `oppHome: true` means the opponent was at home → our team played away → suffix `(A)`. `oppHome: false` → our team home → `(H)`. The verbatim MCI source data has `oppHome: true` for the BRE fixture, which under this reading renders as `BRE (A)` — consistent with MCI travelling to the Brentford fixture, where the scoreline `3-0` reads as MCI's perspective (we 3, them 0, a win away).

2. **Rename rather than alias for `SafePill.size`.** Brief implied a clean `'small' | 'large'` rename. Existing call sites used `size="std"` in three places (`FixtureListCard` × 2 and `NotePadLegRow`). Updated all three to `size="small"` — necessary for the type to compile, not "while we're here" refactoring. The unused `'mini'` rendering path was deleted (no caller used it; keeping deprecated dead code would just add noise).

3. **SafePill `small` is byte-identical to the pre-rename `std` rendering.** Same paddings (`paddingVertical: 4, paddingHorizontal: 8`), same border-radius (6), same fonts (sans 12pt threshold / sans 9pt hits), same `deriveTier` defaults, same `inPad` overlay. The hits-text was previously conditionally rendered (suppressed when `isMini`); since `mini` is gone, the conditional collapsed to "always render," which matches the historical `std` output.

4. **SafePill `large` shadow lives on the outer Pressable style.** Shadows in RN need to sit on the layout-paint surface so they bleed outside the border-radius. The existing SafePill outerStyle (which already carries the soft tier glow when applicable) accepts the additional iOS-only large-variant shadow via spread. Pre-merging the platform-conditional shadow into the static `outerStyle` object before render avoids the gotcha #10 trap. Pressable's child-as-function pattern carries the pressed-tone branch separately on the inner wrapping View — array-form `style={({pressed}) => [outerStyle, pressed && pressedStyle]}` replaced with `style={outerStyle}` + `{({pressed}) => <View style={pressed ? pressedWrapStyle : staticWrapStyle}>}`.

5. **`CELL_BOX_SIZE = 36` declared inside `MatrixCell.tsx`, not in `matrix-constants.ts`.** Per the brief's distinction: the 36 is a cell-internal paint dimension (what the visible box reads as), not a grid layout constant (which the constants file owns). Keeping it local makes the slot/box separation explicit and prevents the constants file from accumulating "stuff that lives inside one component."

6. **Within-category divider uses `borderTopWidth: 1` at `'rgba(255,255,255,0.08)'`.** Slightly softer than the matrix-card footer divider's `0.14` — the within-card hairline reads as a sub-grouping cue rather than a region boundary. Per gotcha #11, explicit `borderWidth: 1` is needed (StyleSheet.hairlineWidth at this alpha vanishes inside the elevated panel).

7. **The divider crosses the sticky-scroll boundary.** Both halves of a non-first stat row (sticky-left and right-region cells) get the same `borderTopWidth: 1`. The line reads as one continuous hairline across the matrix card even though the right half is inside a horizontal ScrollView — because the ScrollView doesn't scroll vertically, the visual continuity holds. If on-device review shows the line breaking awkwardly when the right region is scrolled horizontally, the fallback is per-half independent dividers. Not pre-applied.

8. **`MatrixConsistencyHeader` placed flush-bottom of the combined fixture-header + scoreline space.** `justifyContent: 'flex-end'` + `paddingBottom: 8` puts the "CONSISTENCY" label at the bottom of the 70px combined-header column — directly above the first stat row's SafePill. Reads as a column header for the SafePill column rather than floating in empty space.

9. **`textShadow` chosen for XG values over the wrapping-View-shadow pattern.** Text shadow is simpler and renders on iOS at small sizes adequately. The brief's note about the kickoff-time fallback (wrapping each value in a `View` with shadow props) is kept as a known follow-up if the textShadow reads too subtly on device.

## iOS-only effects + Android fallbacks

| Effect | iOS | Android |
|---|---|---|
| `SafePill` large-variant teal glow | `shadowColor: teal.bright, opacity 0.30, radius 6` | Falls back to the existing `glows.teal.pillSoft` via `AndroidGlowUnderlay` (unchanged from default). |
| `SafePill` large-variant amber glow | `shadowColor: amber.bright, opacity 0.25, radius 6` | Same — Android underlay supplies a softer halo. |
| `XGContextBlock` value text shadow | `textShadow` (color, offset, radius) on the Text style | Ignored — `textShadow` not honoured. Values render flat amber. |
| `MatrixCell` amber halo (unchanged from 4B) | `shadowColor: amber.bright, opacity 0.10, radius 4` | None — accepts flat amber. |
| `MatrixCell` in-pad teal halo | `shadowColor: teal.bright, opacity 0.18, radius 4` | None — accepts teal border alone. |

## Grid dimensions landed

| Constant | Pre-4B.1 | 4B.1 |
|---|---:|---:|
| `STICKY_COL_WIDTH` | 140 | 96 |
| `CELL_WIDTH` | 26 | 44 |
| `CELL_GAP` | 6 | 4 |
| `ROW_HEIGHT_STAT` | 40 | 48 |
| `ROW_HEIGHT_HEAD` | 36 | 36 |
| `ROW_HEIGHT_CATEGORY` | 28 | 28 |
| `ROW_HEIGHT_FIXTURE_HEADER` | 42 | 42 |
| `ROW_HEIGHT_SCORE` | 28 | 28 |
| `ROW_GAP_SIDES` | 22 | 22 |
| `CELL_BOX_SIZE` (cell-internal) | n/a (was identical to CELL_WIDTH = 26) | 36 |

5-cell Last-5 inner width: `96 + 5 × 44 + 4 × 4 = 332`. Matches the inner card width on iPhone 15 Pro (≈333). Verify on iPhone SE — if the right cell clips the card edge, drop `CELL_WIDTH` to 42 (recovers 10 px).

## Anti-checks

- `SafePill size='small'` byte-identical to the pre-rename `std` rendering. ✓ Strongest angles, Note Pad, fixture-list cards unaffected.
- No regression in `GlassSelect` functionality. Dropdown still opens, selects, fires `onChange`. The new `label` prop is opt-in. ✓
- Filter pill (`FilterPill.tsx`) untouched. Still placeholder. ✓
- Scroll-sync logic in `MatrixCard` + `MatrixSide` unchanged — the `useRef`/flag-pair pattern stays. ✓
- Mock data shape unchanged. `oppHome` still a boolean on `TeamMatrixFixture`. ✓
- No new state in `TeamStatsTab` or `MatrixCard`. ✓
- Phase 4A surfaces (Overview, Strongest angles, H2H/Referee, Build-a-builder) untouched. ✓
- Root layout (`apps/mobile/app/_layout.tsx`), `BottomNav`, `NotePadBar`, `AppHeader` — all untouched. ✓
- No new primitives. Only existing ones extended (`SafePill`, `GlassSelect`). ✓

## Verification

- `pnpm -r typecheck` — passes across all 6 packages.
- `npx expo export --platform ios` — bundles cleanly (4.12 MB Hermes bytecode).
- On-device check via Expo Go: not run in this pass. Per-feature checklist for the verifier:
  - Window selector reads `WINDOW · Last 5 matches ▾`. Mono "WINDOW" label, hint colour, separator dot, value in primary text colour.
  - xG block panels noticeably more compact. Each panel: kit + team name on line 1, `XG : 2.4 | XGOT : 1.6` on line 2. iOS should show subtle amber halo on `2.4` and `1.6`.
  - Matrix card: "CONSISTENCY" label visible at the bottom of the sticky-column's fixture-header space, aligned with the bottom of the scoreline row.
  - GOALS row (first in ATTACK): no top divider; stat name "GOALS" 10pt uppercase sans above a large SafePill `1+ / 5/5` teal — iOS should show a teal halo.
  - SHOTS OT row (second in ATTACK): hairline top divider visible across the full row width.
  - CORNERS row (first in SET PIECES): no divider.
  - Cells: 36×36 amber boxes in a 44-wide slot; 13pt mono numerics; no clipping at the card edge on iPhone 15 Pro / 13 Pro size class.
  - Scoreline cells read `3-0`, `3-3`, `2-1` — no H/A suffix.
  - Fixture header columns read `09 May` / kit / `BRE (A)` for the MCI source-verbatim window.
  - Scroll the home team's row — away scrolls in lock step.
  - Tap a cell — teal border + Note Pad bar count increments. Tap again to remove.
  - Tap the GOALS SafePill — Note Pad count increments, SafePill enters in-pad state.
  - Switch window to Last 10 — fixture columns expand, cells extend, SafePill rebases to new floor, scroll-hint text updates.
  - Tap "Show all stats" — THROW INS (with divider above) joins SET PIECES; OFFSIDES (divider) joins DISCIPLINE; DEFENCE / TACKLES and GOALKEEPING / SAVES appear at the bottom (no dividers — both are first-in-category).
  - Strongest angles on the Overview tab visually unchanged.
