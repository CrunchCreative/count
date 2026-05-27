# Phase 4B.3 — Team-stats surgical vertical-spacing fixes

Four targeted fixes against the 4B.2 device build. Three landed as specified; one was a no-op against the existing code and revealed a separate vertical-alignment issue flagged for 4B.4.

## Fix 1 — fixture column cluster

| Before | After |
|---|---|
| `justifyContent: 'space-between'` on `fixtureHeaderColStyle` | `justifyContent: 'flex-start'` + `gap: 3` |

`fixtureHeaderColStyle` previously pushed the two internal items (date row, kit+code row) to the top and bottom of the 48 px fixture-header column. Switched to `flex-start` with a 3 px gap so they cluster at the top with empty space at the bottom of the column.

**Caveat:** the scoreline pill is rendered in a separate `MatrixScorelineRow` below the fixture-header row, not inside `fixtureColStyle`. So the brief's description of "all three clustered into the top ~40 px" only achieves the date + kit+code clustering — the scoreline pill remains its own row, separated by the fixture-header column's residual ~17 px of empty space plus the scoreline row's own internal centring. Moving the scoreline into the column would be a structural change the brief explicitly disallowed. If on-device review wants the scoreline pulled up into the cluster, that's a 4B.4 structural touch-up.

## Fix 2 — divider breathing slot

| Before | After |
|---|---|
| `stickyDividerStyle` / `cellsDividerStyle` — bare 1 px tall View | `stickyDividerSlotStyle` / `cellsDividerSlotStyle` — 17 px tall slot containing a 1 px centred `dividerLineStyle` |

The previous 1 px divider had zero vertical margin, so the stat name on the row below started at y = divider top + 1. Wrapped each divider line in a 17 px slot (8 px above + 1 px line + 8 px below) with `justifyContent: 'center'`. The line still reads at the same colour (`rgba(255,255,255,0.08)`) and still spans full width; the slot just gives the stat name room to breathe before its content begins.

Both sticky-left and right-cells halves use the same 17 px slot height, so the home + away vertical alignment stays consistent row-for-row regardless of how many dividers a category renders.

## Fix 3 — cells row vertical centre (no-op against current code)

| Before | After |
|---|---|
| `cellsRowStyle` already has `height: ROW_HEIGHT_STAT, alignItems: 'center'` | unchanged |

The brief's diagnosis assumed `cellsRowStyle` was "missing height + vertical centre" and prescribed adding them. Audit of the 4B.2 implementation shows both fields are already present. The brief's literal fix is a no-op.

**Separate issue surfaced during diagnosis (flagged, not fixed):** the cell box and the SafePill don't share a vertical centre in the current layout. Math: the sticky container has `paddingVertical: 8` and `justifyContent: 'center'` with two children — stat name (~12 px line height) + 4 px gap + large SafePill (~42 px) = 58 px content stack. Container interior is 56 − 16 = 40 px. The content overflows the interior and centres around y = 28, so the stat name spans y = −1 to y = 11 and the SafePill spans y = 15 to y = 57 (centre at y ≈ 36). Cells, meanwhile, centre at y = 28 in their 56 px row. Net effect: cells sit 8 px *above* the SafePill's vertical centre, not at the same y.

The brief explicitly disallows adding `paddingTop` or `marginTop` to `cellsRowStyle`, which is the most direct way to shift cells down to y = 36. Two ways out:

1. Add `paddingTop: 16` to `cellsRowStyle` (overrides the brief's explicit constraint).
2. Restructure the sticky-left so the SafePill sits at the row's natural centre (e.g. drop the stat name, or render it side-by-side instead of stacked above).

Both are structural touch-ups; neither was applied in 4B.3. **4B.4 should pick one.**

## Fix 4 — team separator position

| Before | After |
|---|---|
| `ROW_GAP_SIDES = 14` | `ROW_GAP_SIDES = 24` |

`matrix-constants.ts` one-line bump. The amber gradient line in `MatrixCard` is centred in this gap with `justifyContent: 'center'` on `sideSeparatorWrapperStyle`. Pre-4B.3, the line sat at y ≈ 6.25 within the 14 px wrapper, meaning visually it landed ~14 px below the FOULS row's bottom but only ~8 px above the Crystal Palace head row — felt like a divider belonging to FOULS.

After: line at y ≈ 12 within the 24 px wrapper. Roughly 20 px below FOULS and ~12 px above Crystal Palace. Closer to symmetric — still 8 px asymmetric (caused by the trailing 8 px padding inside the home side's last sticky stat row, which isn't trimmed since that'd be a per-row vs per-side decision). Should read as a team boundary now rather than a row continuation.

## Constants final state

```ts
export const STICKY_COL_WIDTH = 96;
export const CELL_WIDTH = 50;
export const CELL_GAP = 4;

export const ROW_HEIGHT_HEAD = 36;
export const ROW_HEIGHT_CATEGORY = 28;
export const ROW_HEIGHT_FIXTURE_HEADER = 48;
export const ROW_HEIGHT_SCORE = 28;
export const ROW_HEIGHT_STAT = 56;
export const ROW_GAP_SIDES = 24;    // ← changed (was 14)
```

Only `ROW_GAP_SIDES` moved; the rest hold from 4B.2.

## Files touched

| File | Change |
|---|---|
| `apps/mobile/src/components/fixture/MatrixRow.tsx` | `fixtureHeaderColStyle`: `space-between` → `flex-start` + `gap: 3`. |
| `apps/mobile/src/components/fixture/MatrixSide.tsx` | Divider lines wrapped in 17 px-tall slots (sticky + cells halves). Replaced `stickyDividerStyle`/`cellsDividerStyle` with `stickyDividerSlotStyle`/`cellsDividerSlotStyle` + shared `dividerLineStyle`. |
| `apps/mobile/src/components/fixture/matrix-constants.ts` | `ROW_GAP_SIDES`: 14 → 24. |

No primitive changes. No type changes. No mock changes. No new components. Scroll-sync, show-all toggle, window selector, xG block, filter pill, GlassSelect label, SafePill `size` variants — all untouched.

## Issues flagged for 4B.4 (per brief: don't fix, flag)

1. **Cell box vs SafePill vertical centres misaligned by ~8 px.** See Fix 3 above. The brief's stated fix doesn't address this; the root cause is the SafePill being pushed into the lower half of the row by the stat name above it. Fix options (pick one): paddingTop:16 on `cellsRowStyle`, or sticky-left restructure.

2. **Scoreline pill remains separated from the fixture-header cluster.** Even with Fix 1 applied, the scoreline sits in its own `MatrixScorelineRow` ~24 px below the kit+code row. Moving it into the fixture-column would be a structural change.

3. **Separator line still 8 px asymmetric** (closer to home side than away head). The home side's last stat row carries 8 px of `paddingVertical` inside its sticky container; that trailing padding isn't subtracted from the gap. Trimming it per-row would require either a "last row" prop or a different approach to vertical spacing in the sticky container.

## Verification

- `pnpm -r typecheck` — passes across all 6 packages.
- `npx expo export --platform ios` — bundles cleanly (4.12 MB Hermes bytecode).
- On-device check: not run in this pass. Verifier checklist:
  - **Fixture column:** "09/5 (A)" at top, "[kit] BRE" immediately below it (3 px gap), then a visible gap, then the scoreline pill at the start of the row below.
  - **Stat row dividers:** clearly visible as horizontal lines between rows with ~8 px breathing above and below the line. "SHOTS OT" name has clear vertical space above it; the divider doesn't touch the text.
  - **Cell vertical centre:** likely still 8 px above the SafePill centre (see flagged issue). Won't be resolved by 4B.3.
  - **Separator line:** sits between FOULS row and Crystal Palace head with comparable padding on each side (roughly 20 vs 12 px).
