# Phase 4B — Summary

Fills the Team-stats tab of the fixture-detail screen. Replaces the Phase 4A `TabPlaceholder` for `tab === 'team'` with the full comparative-research interaction: an xG/xGoT context block above a sticky-left, horizontally-scrollable matrix card with home/away teams stacked and scrolling in unison.

## What was built

### `@count/types`

- `packages/types/src/fixture-detail.ts` — extended (60 → 136 lines). Added `TeamMatrixStat`, `TeamMatrixFixture`, `TeamMatrixSide`, `FixtureMatrix`, `XGData`, `FixtureXG`. `FixtureDetail` now also carries `matrix: FixtureMatrix` and `xg: FixtureXG`. The architectural note inline above `TeamMatrixStat` explains why 38 values are stored per stat rather than 5: window switching is a *display* concern handled by `deriveThresholdForWindow`, so storing 5 and synthesising tails for L10/L20/Season would produce floors inconsistent with displaying a slice.
- `packages/types/src/index.ts` — re-exports the six new names alongside the existing 4A block.

### Mobile mock layer

- `apps/mobile/src/mock/fixture-details.ts` — extended (271 → 543 lines). Adds:
  - `TEAM_STAT_DEFINITIONS` constant — fixed categories and stats for V1 mock (ATTACK / SET PIECES / DISCIPLINE / DEFENCE / GOALKEEPING) with `dir`, `defaultVisible`, and `range` per stat.
  - `stringHash`, `mulberry32`, `synthesiseStatValues` — deterministic PRNG plumbing. The brief's "char-code sum × 31 modulo 2³¹" pattern lives in `stringHash`; per-row randomness routes through `mulberry32` seeded by stable hashes of `${fixtureId}::${teamCode}::${side}` (with stat-name XOR for per-stat divergence). No `Math.random` anywhere.
  - `OPPONENT_POOL`, `PLAUSIBLE_SCORES`, `synthesiseFixtures` — opponent rotation excludes the team's own code; scoreline pool is duplication-weighted toward low-scoring outcomes for plausibility.
  - `synthesiseSide`, `synthesiseMatrixForFixture`, `synthesiseXG` — the per-fixture entry points.
  - `MCI_HOME_5`, `MCI_HOME_5_VALUES`, `CRY_AWAY_5`, `CRY_AWAY_5_VALUES`, `applyMciCryOverlay` — the verbatim source-design overlay applied on top of synthesised matrix data for `mci-cry`. Fixtures and named-stat values at indices 0–4 get overwritten; everything from index 5 onward stays synthesised.
  - `deriveThresholdForWindow` — exported. Pure, deterministic on `(values, window, dir)`. Returns `{ threshold, hits, total, tier }`. Centralised here rather than colocated with the components because it's the contract between the data layer and any future consumer (`@count/pattern-engine` will likely promote it when Phase 7+ ships).
- `MCI_CRY_OVERRIDE` — extended to include the verbatim `xg: { home: { xg: 2.4, xgot: 1.6 }, away: { xg: 0.9, xgot: 0.5 } }` block from the brief. The matrix data uses `applyMciCryOverlay` to mutate indices 0–4 in place after `synthesiseMatrixForFixture` returns.
- `synthesiseDetail` — now always synthesises matrix + xG. The `mci-cry` branch additionally applies the overlay and merges the override (which still includes the xG verbatim block).

### Mobile components (new in `apps/mobile/src/components/fixture/`)

- `matrix-constants.ts` (22 lines) — `WindowSize` type + the ROW_HEIGHT_* / STICKY_COL_WIDTH / CELL_WIDTH / CELL_GAP constants. Sits in its own module so MatrixCell / MatrixRow / MatrixSide / MatrixCard can all import without an import cycle (TeamStatsTab owns `WindowSize` state but every leaf needs the type).
- `FilterPill.tsx` (90 lines) — non-functional placeholder pill matching the GlassSelect look (icon + label + amber count badge + chevron). `onPress` is `undefined`; the accessibility hint flags this to screen readers explicitly. Pressable follows gotcha #10.
- `XGContextBlock.tsx` (102 lines) — two side-by-side standard `GlassPanel`s, `flex: 1` each, gap 10, mounted in a wrapper `<View style={{ flex: 1 }}>` per the gotcha #8 flex-carry pattern. Each panel: team code (muted sans uppercase) + xG and XGOT rows (mono numbers, sans labels uppercase). Values render via `.toFixed(1)` to anchor at one decimal.
- `MatrixCell.tsx` (196 lines) — the 26×26 tappable cell. Zero cells: flat grey, white 0.10 border, '0' in `text.faint` mono, non-tappable. Non-zero cells: amber gradient fill (0.18 → 0.08), amber 0.30 border, iOS amber shadow at opacity 0.10. In-pad cells reuse the amber gradient but switch the border to teal 0.60 and tint the iOS shadow teal. Tap toggles a leg with `id = ${fixtureId}::team::${teamCode}::${statName}::cell-${matchIndex}::value-${value}` at threshold `(value − 1)+`, with `hits` computed from `rowValues.slice(0, windowSize).filter(v => v >= threshold).length`.
- `MatrixRow.tsx` (332 lines) — exports the per-row primitives consumed by MatrixSide:
  - `MatrixCategoryLabel` + `MatrixCategoryGap` — sticky-left category header + right-side spacer at `ROW_HEIGHT_CATEGORY`.
  - `MatrixRowSticky` — sticky-left half of a stat row: stat name (uppercase sans 10pt) + `SafePill` consuming `deriveThresholdForWindow(stat.values, windowSize, stat.dir)`. The SafePill receives a `leg` only when tier isn't `muted`; muted floor (zero in window) renders as `—` with no addable affordance, per the brief.
  - `MatrixRowCells` — right-side half: row of `MatrixCell`s at `ROW_HEIGHT_STAT` matching the sticky-left height exactly.
  - `MatrixFixtureHeaderRow` — fixture column heads inside the right scroll region. Each column at `CELL_WIDTH = 26` stacks date (mono 8pt hint), opponent mini-kit (8×9), opponent code (mono 8pt muted).
  - `MatrixScorelineRow` — uses the existing `ScorePill` primitive from `@count/ui` directly, centred inside each `CELL_WIDTH`-wide column. ScorePill's intrinsic width adapts to result strings like "3-0" or "3-3" comfortably within 26px without overflow.
  - `MatrixSideHead` — standalone full-width row above the row-aligned grid: kit (shirt variant, size 20) + team name + `LAST X OF 38` count text on the right.
- `MatrixCell.tsx`, `MatrixRow.tsx` heights all reference the same `ROW_HEIGHT_*` constants, so the two regions never desync regardless of what content they happen to render.
- `MatrixSide.tsx` (182 lines) — one team's section. Composition: `MatrixSideHead` above a horizontal flex row that splits into a 140px-wide sticky View on the left and a horizontal `ScrollView` on the right. Both iterate the same `groups` array (built by `buildCategoryGroups(stats, showAll)`) so the rows stay aligned. Scroll syncing uses the per-side `ownFlag` / `syncFlag` mutable ref pair owned by `MatrixCard`: a manual scroll calls `syncRef.current.scrollTo({ x, animated: false })`, sets `syncFlag.current = true`, and the receiving side reads its flag, resets it, and returns early instead of re-syncing. `bounces={false}` keeps the two sides from desyncing at the edges via differing overscroll behaviour.
- `MatrixCard.tsx` (169 lines) — the elevated `GlassPanel` outer shell. Owns the two `useRef<ScrollView | null>(null)` refs and two `useRef(false)` flags; threads them as `scrollRef`/`syncRef`/`ownFlag`/`syncFlag` to each `MatrixSide`. Footer below the two sides shows the amber arrows-h icon + scroll-hint text on the left and the show-all toggle Pressable on the right. Footer top border at `rgba(255,255,255,0.14)` per gotcha #11 (the lower-alpha defaults read as invisible inside the elevated panel).
- `TeamStatsTab.tsx` (95 lines) — top-level assembly. Owns `windowSize` (`useState<WindowSize>(5)`) and `showAll` (`useState(false)`). Composes H2 + body + (`GlassSelect` window selector + `FilterPill` placeholder) row + `XGContextBlock` + `MatrixCard`. Outer wrapper `marginTop: 24` mirrors Phase 4A's `OverviewTab`.

### Route

- `apps/mobile/app/fixture/[id].tsx` — two lines change. Added the `TeamStatsTab` import; replaced `<TabPlaceholder phase="4B" tabName="Team stats" />` with `<TeamStatsTab fixture={fixture} />`. Header, H1, tab strip, other tab branches all untouched. `TabPlaceholder` import stays — Player stats and The Count branches still use it.

## Decisions not explicit in the brief

1. **Shared `matrix-constants.ts` for `WindowSize` + layout dimensions.** The brief described `WindowSize` exported from `TeamStatsTab.tsx` and the dimension constants exported from `MatrixCard.tsx`. That creates a `TeamStatsTab → MatrixCard → MatrixSide → MatrixRow → MatrixCell → (back to TeamStatsTab for WindowSize)` import chain — type-only imports erase at runtime and TS handles cycles, but bundlers occasionally don't. Moved both to a dedicated leaf module. No component depends on another component for these symbols.

2. **`MatrixRow.tsx` exports the split row halves rather than a single component.** The brief's final layout pattern iterates category groups twice — once on the left and once inside the ScrollView. A single `MatrixRow` component can't own both halves because they live inside different parents. The file exports `MatrixCategoryLabel` + `MatrixCategoryGap` + `MatrixRowSticky` + `MatrixRowCells` + the head + fixture-header + scoreline primitives. `MatrixSide` iterates the same groups array twice with the same keys.

3. **SideHead is a fully-standalone block above the row-aligned grid.** The brief flagged this as a sub-question (the source's "5 OF 12" sat inside the right scrolling region, which doesn't have a natural "where" when scroll is added). Settled on the full-width head with kit + team name on the left and `LAST X OF 38` on the right. The head doesn't share row constraints with the grid below; alignment between left and right starts at the fixture-header row.

4. **`ScorePill` reused at intrinsic width.** Brief allowed an inline replacement if `ScorePill` was too large at 26×22. ScorePill ships with `paddingVertical: 3, paddingHorizontal: 5, fontSize: 10` — measured to ~24–28px wide depending on the result string, and ~16–18px tall. Fits inside the 28pt scoreline row centred in a 26pt column comfortably. Used directly; no inline replacement. Saves duplicating the W/D/L gradient + colour-coding logic.

5. **Scroll syncing flag pair lives on `MatrixCard`, not inside each `MatrixSide`.** Each side's onScroll needs access to its own flag (read + reset) AND the sibling's flag (set before initiating a scrollTo). Owning them in the parent and threading them down is cleaner than a context, and matches the brief's "scrollRef / syncRef" prop pair pattern.

6. **`bounces={false}` on both sides' ScrollViews.** Without it, an iOS overscroll on one side would create a position the sibling can't match (the sibling's content width might end at the same point but bounce ranges differ). With it, the two sides stop at the same exact contentOffset on edges. The Android side stops at edges by default.

7. **Stat-name SafePill `leg.id` is suffixed with `::w${windowSize}`.** A row-floor leg derived from L5 is *not* the same leg as the same row's floor derived from L10 — they have different thresholds. Suffixing the window in the leg id means switching the window cleanly invalidates any in-pad floor legs from the previous window: SafePill's `inPad` check sees a different id and falls back to its non-in-pad visual. The cell legs already differ across windows because their `hits` change with window.

8. **`PLAUSIBLE_SCORES` is duplication-weighted instead of using a per-entry probability.** Repeating `[1,1]` three times in the array is functionally identical to a discrete-probability distribution but reads inline more clearly than a separate weights table. The synthesiser uses `Math.floor(rng() * pool.length)` directly.

9. **Date baseline anchored to `2026-05-27`.** The system supplied `currentDate` as `2026-05-27`. Hardcoded into `TODAY_BASELINE`; the synthesiser counts back 6 days per fixture so 38 fixtures span ~225 days — roughly a season's spread. Phase 8 (real data) replaces this with actual fixture dates.

10. **`OPPONENT_POOL` is a flat EPL list of 18 codes.** The synthesiser filters out the team's own code at runtime. For non-EPL fixtures (La Liga, Serie A, etc.), opponents still come from the EPL pool — purely a mock convenience until Phase 8 supplies the real per-league fixture lists.

11. **Show-all toggle empty-category handling.** When `showAll = false`, `DEFENCE` and `GOALKEEPING` have zero visible stats. `buildCategoryGroups` filters those categories out entirely so we don't render an "ATTACK" label above zero stat rows. When `showAll = true`, all five categories return; the toggle reflects the expansion.

## Surprises in the source

1. **The source `MatrixRow` doesn't have row-level taps.** The source treats each row's SafePill as the only addable surface; each cell is just a number with an underline-bar treatment. The brief explicitly rewrites this: every non-zero cell becomes a tap target, with the dedicated `MatrixCell` component carrying the leg construction. The underline-bar `matrix-cell::after` treatment is gone — cells are filled boxes via `PlayerValueCell`'s visual treatment scaled to 26×26.

2. **No `lte` direction surfaces in 4B's V1 stat set.** Every team stat (GOALS, SHOTS OT, CORNERS, FOULS, TACKLES, SAVES, OFFSIDES, THROW INS) is `gte` in the brief's `TEAM_STAT_DEFINITIONS`. The `lte` code path in `deriveThresholdForWindow` is still implemented for future player-stats parity, but it's dead-code in 4B mock. The "matrix-cell.dim" treatment that source ships for over-target `lte` cells is correspondingly unreachable — no rendering code for it exists in `MatrixCell`.

3. **`SafePill` already supports the `leg`-driven add interaction natively.** The 4A SafePill carries a `leg?: Leg` prop that wires its own Pressable to `notePad.toggleLeg` and switches its glyph from `+` to `✓` when in-pad. No row-level Pressable wrapper is needed in 4B — `MatrixRowSticky` is just a `View`, with SafePill as its own tap target. Confirmed in `SafePill.tsx` line 167–180 — the leg branch self-handles `Pressable`.

## TODOs left in code

None explicit. The unused `'lte'` direction in `deriveThresholdForWindow` is reachable behaviour (just not exercised by 4B mock); it stays for Phase 4C / 7+.

## Visual deltas from source / new visual choices

- **Cell visual treatment.** Source: plain text + gradient underline bar. 4B: 26×26 amber-gradient-filled rounded boxes, teal border + teal shadow when in-pad. Intentional departure — the underline treatment was non-tappable, and 4B's design promotes every non-zero cell to a tap target. **Verify on device:** non-zero cells should read as obvious tap targets in the amber accent; tapping one should switch its border to teal and tick up the Note Pad bar count.
- **Sticky-left + horizontal scroll layout.** Source: fixed 5-column `grid-template-columns: 56px repeat(5, 1fr)`. 4B: ~140px sticky View + horizontal ScrollView. **Verify on device:** swiping the home team's fixtures row should scroll the away team's fixtures row in lock step; the SafePill column should stay pinned.
- **xG / xGoT context block.** New in 4B; no source reference. Two side-by-side standard GlassPanels, each with team code + xG + XGOT rows. Mono numbers in `colors.amber.bright`, sans labels in `colors.text.hint`. **Verify on device:** MCI shows `XG 2.4 / XGOT 1.6`, CRY shows `XG 0.9 / XGOT 0.5` in the mci-cry fixture.
- **Show-all toggle exposes 4 additional stat rows.** Source has the toggle UI but no handler wiring. 4B wires it to `showAll` state: SET PIECES.THROW INS, DISCIPLINE.OFFSIDES, DEFENCE.TACKLES, GOALKEEPING.SAVES all appear. **Verify on device:** tapping "Show all stats" should reveal these four rows; button label flips to "Show less".
- **Filter pill is visually present but non-functional.** Renders the same icon + label + count + chevron shape as source, with count "2" hardcoded. Tap does nothing. Accessibility hint announces this explicitly.
- **No sticky-column shadow / edge-fade.** Not added. Phase 12 polish if it reads poorly.
- **`SideHead` placement.** Brief flagged ambiguity about source's "5 OF 12" placement. Resolved by treating the head as a full-width block above the row-aligned grid (kit + name left, count right), so it's never trying to align with a scrolling column.

## Anti-checks (verifying the brief's "Anti-checks" list)

- No new `packages/ui` components. All new components live in `apps/mobile/src/components/fixture/`. ✓
- No primitives extended. SafePill / Kit / GlassPanel / GlassSelect / Icon / ScorePill used as-is. ✓
- `FixtureListItem` type unchanged. ✓
- `FIXTURES_BY_ID` lookup unchanged. ✓
- No `console.log`, no emoji. Font weights all in `typography.weight.regular | medium` — no 600+. ✓
- Hairlines: matrix-cell borders use explicit `borderWidth: 1` at strong alpha (per gotcha #11), so they remain visible inside the elevated card. ✓
- Every Pressable follows gotcha #10: single static container style on the Pressable, layout/tone branches on inner View via children-as-function. Verified on FilterPill, MatrixCell, MatrixCard toggle. ✓
- xG values rendered via `.toFixed(1)`. ✓
- Numeric values mono, labels sans throughout. ✓
- `useState` only in `TeamStatsTab` (window + showAll); `useRef` only in `MatrixCard` (refs + flags). No state in MatrixSide / MatrixRow / MatrixCell. ✓

## Verification

- `pnpm typecheck` — passes across all 6 packages.
- `npx expo export --platform ios` — bundles cleanly, 1495 modules in ~49s. Single 4.12 MB Hermes bytecode artifact.
- On-device verification: not performed in this pass. The interaction surfaces to verify (per the brief's checklist) are:
  - MCI/CRY first-five fixture columns: BRE / EVE / SOU / BUR / ARS with scorelines 3-0 W, 3-3 D, 2-1 W, 0-1 L, 2-1 W.
  - Cell values for MCI GOALS row: [3, 3, 2, 1, 2]; SHOTS OT: [10, 4, 6, 9, 5]; CORNERS: [10, 9, 10, 11, 8]; FOULS: [8, 5, 9, 12, 5].
  - CRY equivalents: opponents EVE / WOL / BOU / NFO / LIV; GOALS [2, 2, 0, 3, 1] etc.
  - Scroll-sync between home and away ScrollViews.
  - Window selector dropdown changes cell count + SafePill floor values.
  - Show-all toggle reveals 4 additional rows.
  - Cell tap toggles teal border + Note Pad bar count.
