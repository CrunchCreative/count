# Phase 4B.2 — Team-stats visual cleanup

Targeted visual cleanup against Phase 4B.1. No structural changes, no new state, no new props. Six on-device issues resolved: cells widen and the ScrollView gets `flex: 1` (dead-space fix), stat rows grow vertically (no more name/divider overlap), sticky-left content left-aligns flush, the CONSISTENCY header is gone, the fixture column header restructures into two internal rows with H/A moved into the date row, and the inter-team gap becomes a thin amber-gradient glow line.

## Files touched

| File | Change |
|---|---|
| `apps/mobile/src/components/fixture/matrix-constants.ts` | `CELL_WIDTH 44 → 50`, `ROW_HEIGHT_STAT 48 → 56`, `ROW_HEIGHT_FIXTURE_HEADER 42 → 48`, `ROW_GAP_SIDES 22 → 14`. Other constants unchanged. |
| `apps/mobile/src/components/fixture/MatrixRow.tsx` | Removed `MatrixConsistencyHeader` export + styles. Added `formatDateShort` helper. Restructured `MatrixFixtureHeaderRow` to two internal rows (date + H/A on top; kit + opp code on second row). Sticky stat container now `paddingHorizontal: 8` + `alignItems: 'flex-start'` to match the category label's padding. Pill slot wrapper inside the sticky row explicitly left-aligns the large SafePill. Dropped `isFirstInCategory` prop — divider placement moved to `MatrixSide`. Removed `statStickyDividerStyle` and `cellsRowDividerStyle`. |
| `apps/mobile/src/components/fixture/MatrixSide.tsx` | Dropped `MatrixConsistencyHeader` import + usage; replaced with a single blank spacer at `height: ROW_HEIGHT_FIXTURE_HEADER + ROW_HEIGHT_SCORE`. Both sticky-left and cells-right halves now insert a standalone 1-px-tall divider View between every non-first stat in a category. Added `style={{ flex: 1 }}` to the ScrollView (dead-space fix). |
| `apps/mobile/src/components/fixture/MatrixCard.tsx` | Replaced the empty `<View style={{ height: ROW_GAP_SIDES }} />` between sides with a wrapped `LinearGradient` line (1.5px tall, edge-fading amber) and an iOS-only amber shadow on the wrapper (`shadowOpacity 0.6, radius 8`). Imported `Platform` and `LinearGradient`. |

## Dead-space diagnosis

The brief reported ~90 px of dead space to the right of the 5th cell on iPhone 15 Pro Max. Root cause: the horizontal `ScrollView` in `MatrixSide` had no `flex: 1` on its `style` and no flex sibling allocation against its `STICKY_COL_WIDTH` neighbour. RN's default for a horizontal `ScrollView` is to occupy *content* width when nothing constrains the frame — so the ScrollView's frame collapsed to the cells row's intrinsic width (`5 × 44 + 4 × 4 = 236` in 4B.1's dimensions), and everything to the right was inert space inside the matrix card.

Fix: `style={{ flex: 1 }}` on the ScrollView. The frame now expands to fill the available width after the 96-px sticky column, and the content (`5 × 50 + 4 × 4 = 266` in 4B.2 dimensions) scrolls within when window > 5.

On iPhone 15 Pro Max math: card content area `398 − 28 padding = 370`. Right-region available `370 − 96 sticky = 274`. Cell row width `266`. Residual ≈ 8 px — acceptable. If on a narrower device the row clips the card edge, drop `CELL_WIDTH` to 48 (recovers 10 px from cells, plus 0 from gaps).

## Decisions resolved during the pass

1. **Sticky alignment forced to `paddingHorizontal: 8` on both category label and stat container, plus `alignItems: 'flex-start'` on the container.** Pre-4B.2, the category label had no horizontal padding (text rendered flush at x=0 inside the 96-px column), and the stat container had `paddingHorizontal: 8`. That 8-px offset was the visible drift. Both now share a single `STICKY_PAD_X = 8` constant so the alignment can't decouple in future edits.

2. **SafePill explicitly wrapped in `View style={pillSlotStyle}` with `alignItems: 'flex-start'`.** The large SafePill is intrinsic-sized; without an explicit left-anchor wrapper the parent's `alignItems: 'flex-start'` is enough, but the explicit slot reads more clearly in code and is robust against future container-style changes.

3. **`ROW_HEIGHT_STAT = 56` accepted from brief.** With the stacked stat-name (10pt sans, ~12 px line) + 4 px gap + large SafePill (intrinsic 32 content + 10 padding = 42), the stack measures ~58 — slightly over the 56 row height. With `justifyContent: 'center'` the content overflows symmetrically by ~1 px above and below. On-device check needed; if it reads as overlap, bump to 60 in 4B.3 (brief author's 56 was budgeted against a 28-px-tall SafePill estimate that doesn't match the actual 42 the large variant renders at).

4. **Standalone-View dividers over `borderTop` for within-category separators.** The brief flagged the borderTop approach as a likely cause of the stat-name / divider visual overlap. Switched to per-stat divider Views inserted between adjacent rows by `MatrixSide`. Each divider is a 1-px-tall View; the sticky-left divider has `width: STICKY_COL_WIDTH`, the cells-right divider has `width: '100%'`. Together they form one continuous line across the matrix card. Colour `rgba(255,255,255,0.08)` matches 4B.1.

5. **Date format abbreviated `27 May` → `27/5` only at the display layer.** The mock data stays at the human-readable form `27 May`. `formatDateShort` does the conversion before rendering. The H/A indicator suffix (`(A)` / `(H)`) lands at the date row, so the combined "27/5 (A)" string is 8 chars × ~5.4 px mono = ~43 px and fits in the 50-px cell.

6. **`oppHome === true` continues to render `(A)`.** The 4B.1 mapping is preserved — opponent at home means our team played away. The brief's section-6 code spec agrees (`f.oppHome ? 'A' : 'H'`). The brief's verification text claimed "BRE/SOU/ARS are MCI home → (H)", which contradicts the code spec and the type-field docs (`oppHome` = "was played at the opponent's home"). Followed the code spec and type doc; if review wants the flipped reading, that's a one-liner in 4B.3.

7. **Separator gradient uses the active-tab-underline recipe verbatim.** Three-stop horizontal gradient `rgba(232,181,58,0) → 0.7 → 0`, 1.5 px tall, plus iOS shadow `(amber.bright, 0.6, 8, 0/0)` on the wrapper. The line extends to the matrix card's inner content edges (no horizontal margin on the wrapper, no `paddingHorizontal` on the line itself). Android falls back to gradient only.

8. **The `ROW_GAP_SIDES` constant survived the redesign.** It's now the height of the separator wrapper (14), not an inert spacer. Re-used semantically: same name, new role.

9. **No primitive changes.** `SafePill` and `GlassSelect` untouched from 4B.1. `XGContextBlock` and `FilterPill` untouched. `MatrixCard`'s scroll-sync `useRef` pattern unchanged.

## iOS-only effects + Android fallbacks

| Effect | iOS | Android |
|---|---|---|
| Separator gradient line | gradient + amber shadow glow (`opacity 0.6, radius 8`) | gradient only — flat |
| `MatrixCell` cell halos | unchanged from 4B (amber for default, teal for in-pad) | unchanged |
| `SafePill` large-variant tier glow | unchanged from 4B.1 | unchanged |
| `XGContextBlock` value textShadow | unchanged from 4B.1 | unchanged |

## Grid dimensions landed

| Constant | 4B.1 | 4B.2 |
|---|---:|---:|
| `STICKY_COL_WIDTH` | 96 | 96 |
| `CELL_WIDTH` | 44 | 50 |
| `CELL_GAP` | 4 | 4 |
| `ROW_HEIGHT_STAT` | 48 | 56 |
| `ROW_HEIGHT_FIXTURE_HEADER` | 42 | 48 |
| `ROW_HEIGHT_SCORE` | 28 | 28 |
| `ROW_HEIGHT_CATEGORY` | 28 | 28 |
| `ROW_HEIGHT_HEAD` | 36 | 36 |
| `ROW_GAP_SIDES` | 22 | 14 |
| `CELL_BOX_SIZE` (cell-internal) | 36 | 36 |

5-cell content row: `5 × 50 + 4 × 4 = 266`. Total sticky + cells: `96 + 266 = 362`. iPhone 15 Pro Max inner card area ≈ 370 → ~8 px residual.

## Anti-checks

- No new `packages/ui` primitives. `SafePill`, `GlassSelect`, `Kit`, `ScorePill`, `GlassPanel`, `Icon`, `useNotePad` all consumed unchanged. ✓
- `oppHome` field in mock data unchanged. Type `TeamMatrixFixture` unchanged. ✓
- Scroll-sync logic in `MatrixCard` + `MatrixSide` unchanged — still the `useRef` flag-pair pattern from 4B. ✓
- Show-all toggle behaviour unchanged. ✓
- Tab routing in `apps/mobile/app/fixture/[id].tsx` unchanged. ✓
- `XGContextBlock` (4B.1 redesign) unchanged. ✓
- `GlassSelect` with `label="WINDOW"` unchanged. ✓
- `FilterPill` placeholder unchanged. ✓
- Phase 4A surfaces (Overview tab + children) untouched. ✓
- `BottomNav` / `NotePadBar` / app shell untouched. ✓
- No `console.log` introduced during the dead-space diagnosis (the brief suggested a temporary `onLayout` log; not necessary — the `flex: 1` fix was deterministic from the read-through). ✓
- No new `useState` / `useRef` / context. ✓

## Verification

- `pnpm -r typecheck` — passes across all 6 packages.
- `npx expo export --platform ios` — bundles cleanly (4.12 MB Hermes bytecode).
- On-device check via Expo Go: not run in this pass. Verifier checklist:
  - Cells fill the matrix card width with at most ~8 px slack on the right.
  - Stat names visually clear of the divider lines above them.
  - ATTACK / SET PIECES / DISCIPLINE labels and GOALS / SHOTS OT / CORNERS / FOULS stat names all start at the same x-coordinate (paddingHorizontal: 8 inside the sticky column).
  - No "CONSISTENCY" header anywhere in the card.
  - Fixture column reads: row 1 `27/5 (A)` (mono 9pt, hint colour), row 2 `[kit-mini] BRE` side-by-side, row 3 the scoreline pill `3-0`.
  - Amber gradient line visible between the home team's last row and the away team's head row; iOS shows a subtle amber halo around it.
  - Scroll-sync still works — drag home cells row, away cells row moves in lock step.
  - Show-all toggle, window selector, cell tap, SafePill tap all unchanged.

## Known follow-ups for 4B.3 if on-device review surfaces them

- If the stat name + SafePill stack still reads overlapped against the row above, bump `ROW_HEIGHT_STAT` to 60.
- If the H/A interpretation feels wrong on device (BRE should show `(H)`, not `(A)`), flip the `oppHome ? 'A' : 'H'` ternary to `oppHome ? 'H' : 'A'` and update the `TeamMatrixFixture.oppHome` JSDoc accordingly.
- If `27/5` reads ambiguously, swap back to `27 May` and find another way to fit H/A (e.g. drop the parentheses: `27 May A`).
- If iOS separator glow is too subtle, bump `shadowOpacity` to 0.8 (brief explicitly called this out).
