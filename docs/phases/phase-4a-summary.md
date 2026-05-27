# Phase 4A — Summary

Fills the Overview tab of the fixture-detail screen, wires tab content routing for all four tabs, and adds the deeper per-fixture data layer that downstream phases will keep extending.

## What was built

### `@count/types`

- `packages/types/src/fixture-detail.ts` — new. Exports `FixtureDetail` (extends `FixtureListItem`) plus the sub-types it composes: `FixtureWinProb`, `FixtureRefereeDetail`, `FixtureH2H`, `StrongestAngle`. No team-matrix / player-matrix / threshold slots — those are reserved for Phases 4B / 4C / 5 and not forward-declared (per the brief).
- `packages/types/src/index.ts` — re-exports the five new names alongside the existing `FixtureListItem` / `FixturesByLeague` block.

### Mobile mock layer

- `apps/mobile/src/mock/fixture-details.ts` — new. Holds `FIXTURE_DETAILS_BY_ID: Record<string, FixtureDetail>`, a `getFixtureDetail(id)` accessor, and the verbatim `MCI_CRY_OVERRIDE` block ported from `docs/design-source/the-count-v2/project/data.js` lines 126–147. Every other id in `FIXTURES_BY_ID` runs through `synthesiseDetail(fx)`. Determinism is sourced from cheap char-code hashes of stable fields (`fx.home`, `fx.away`, `fx.signal`, `fx.referee.name`) — no `Math.random`. The MCI/CRY override is applied as a shallow merge after synthesis, so its values are byte-for-byte identical to the source.

### Mobile components (new directory)

`apps/mobile/src/components/fixture/`:

- `TabPlaceholder.tsx` — small reusable card. `phase` + `tabName` props; renders inside a standard `GlassPanel` with `padding: 24` and a centred muted message ("`{tabName}` arrives in Phase `{phase}`."). Used by Team stats / Player stats / The Count branches.
- `FixtureHeroPanel.tsx` — three-column hero (home block | kickoff column | away block) + a hairline-divided win-probability bar beneath. Co-locates `SideBlock`, `KickoffColumn`, and `WinProbBar` as internal helpers (file is ~270 lines including styles — at the split threshold; kept together because they share style scope tightly and the JSX surface is small). Pull-out splits would be churn.
- `StrongestAnglesPanel.tsx` — `SectionHead` (engine-toned, meta "Last 5") above a flush-zero-padded `GlassPanel` containing a list of `AngleRow`s. Each row is a `Pressable` that toggles its `Leg` into the Note Pad on press; the right-side +/✓ glyph is visual-only (no own press handler). `SafePill` is consumed without `leg` or `addable` — the row owns the toggle, per the brief's translation rule.
- `H2HRefereePair.tsx` — two-up panel row (`flexDirection: 'row'`, `gap: 10`, `marginTop: 14`). Each panel is wrapped in an outer `<View style={{ flex: 1 }}>` so the flex carry happens on the wrapper, not via `GlassPanel.style` (gotcha #8). H2H panel has the amber-gradient progress bar (track 4pt, fill gated by `home / (home + away)`); referee panel has the conditional "Cards above avg" inline pill.
- `BuildABuilderPanel.tsx` — elevated CTA. Sparkles icon top-right, title + body left, three `BuilderButton`s underneath. Tones: `teal`, `amber` (with iOS amber halo via `shadowColor`), `neutral`. Buttons fire `onPick(risk)` — Phase 5 will route the destination; Phase 4A wires a no-op `() => {}` from `OverviewTab`.
- `OverviewTab.tsx` — top-level assembly. Single outer `<View style={{ marginTop: 24 }}>` followed by Hero → Strongest → H2H/Referee → Build a builder. Inter-section spacing is owned by each child (`SectionHead`'s baked `marginTop: 22`; H2HRefereePair and BuildABuilderPanel carry their own `marginTop: 14`).

### Route

- `apps/mobile/app/fixture/[id].tsx`:
  - Swapped `FIXTURES_BY_ID` lookup for `getFixtureDetail(params.id)`.
  - Tightened the `tab` state type to a union literal `'overview' | 'team' | 'player' | 'count'` (called `TabId` at module scope). The `TabStrip`'s `onChange: (id: string) => void` is bridged with a single-line cast `(id) => setTab(id as TabId)` — the `TABS` array's ids already match the union exactly, so the cast is safe.
  - Replaced the placeholder block + its two orphan styles (`placeholderWrapStyle`, `placeholderStyle`) with the tab-content router. Each of the four branches guards on `fixture &&`. Untouched: header row, H1, vs-inline, tab strip wrapper, all their styles.

## Decisions not explicit in the brief

1. **WinProbBar kept inline** in `FixtureHeroPanel.tsx`. Brief permitted splitting if the file exceeded ~250 lines; it lands at ~270, just over. Kept together because the bar shares the file's style scope (`microStyle`, `winProbHeadStyle` would have to be duplicated or re-exported across a split) and the JSX surface is small. If a future caller needs the bar standalone it can be lifted out then.

2. **Synthesiser h2h "last" winner heuristic.** With a 5-game tally `home + away = 5`, ties (`home == away`) are arithmetically impossible (`Math.round(0.5*5) = 3`, never 2.5). The code defends against the tie branch anyway for safety — `winnerCode` falls through to `fx.home` when both sides are zero, producing a "0-0 HOME" string. No live fixture in `FIXTURES_ALL` triggers this branch.

3. **Synthesised home-win-percent for referees uses the full display name as the hash seed.** The mock layer ships referees as e.g. `'M. Oliver'` (initial + dot + space + surname). I normalise that to `'M. Oliver'` before hashing — collapses any duplicate whitespace from the source. This keeps the per-referee value stable across renders and across the listing/detail boundary.

4. **`SideBlock` falls back to the team code** when `getTeam(code)` returns undefined. The brief flagged this for the kit only; I extended it to the team name too, since rendering an empty name underneath a kit-shaped void View would be worse than rendering `'MCI'` literal.

5. **`Text` from `react-native` is still imported in the route file.** The placeholder removal pulled out two `Text` call sites but the H1 + meta line still need it. Left the import. (TypeScript catches genuinely unused imports; this one is in use.)

6. **MCI/CRY override merge style.** Applied as a shallow `Object.assign` via spread — `{ ...detail, ...MCI_CRY_OVERRIDE }`. The brief suggested `Object.assign(record, MCI_CRY_OVERRIDE)`; I used spread because it keeps the function purely functional (no mutation of the partially-built record) and reads slightly cleaner. Same observable behaviour.

7. **Strongest-angles pool body lines** use only the allowed vocabulary (trend / consistency / floor / threshold). Bodies for the synthesised pool are generic — they don't try to express per-fixture insight, because the synthesiser doesn't have real per-fixture insight to express. The MCI/CRY override carries the source's hand-written bodies verbatim.

## Surprises in the source

1. **Source uses "Team matrix" / "Player matrix" / "AI" as tab labels.** PROJECT-STATE decision 11 locks our labels to "Team stats" / "Player stats" / "The Count". The route stub already had the renamed labels; Phase 4A inherits them.

2. **Source `OverviewTab` passes `addable={leg}` into `<SafePill>` AND wires the row's own `onClick` to `slip.toggleLeg(leg)`.** That's two press handlers stacked on the same logical element. Our `AngleRow` resolves this by passing no `leg`/`addable` to the inner SafePill — the outer row Pressable owns the toggle and the right-side glyph box renders the visual affordance. Matches the brief's translation rule.

3. **`textShadow: '0 0 16px rgba(232,181,58,0.4)'` on the kickoff time.** RN's Text `textShadow*` props are unreliable cross-platform — drop targets, miss on some Android skins. Used the brief's iOS-only `shadowColor`/`shadowRadius` on a wrapping View pattern; Android renders the amber colour without halo (Phase 1C convention).

4. **Source `winprob` uses `box-shadow: inset 0 1px 0 rgba(255,255,255,0.18)` for the home seg's top highlight.** No RN equivalent. Approximated with a 1pt-tall absolute-positioned View at the top of the seg (`winProbInsetHighlightStyle`). Renders identically.

## TODOs left in code

None. The `onPick` no-op in `OverviewTab` is intentional — Phase 5 wires it. The unused-but-reserved fields in `FixtureDetail` aren't TODOs either; they don't exist yet.

## Visual deltas to verify on device

These are intentional or anticipated divergences from the source — each is flagged so it doesn't surprise review.

- **Win-prob hairline divider visibility.** `borderTopColor: colors.border.default` is `rgba(255,255,255,0.06)` — below the ~0.20 alpha threshold for visible hairlines on iPhone (gotcha #11). If the divider vanishes on device, the fix is `borderTopColor: 'rgba(255,255,255,0.14)'` + `borderTopWidth: 1`. Same anticipated concern as Phase 3.6.2's chip rests — same fix shape.
- **Angle-row inter-row hairline dividers.** Same gotcha #11 concern. Verify on iPhone; same fix recipe if invisible.
- **Kickoff time amber glow on Android.** iOS shadow only; Android renders the amber colour but no halo.
- **H2H progress-bar amber glow on Android.** Same.
- **Build-a-builder amber button glow on Android.** Same.
- **Crystal Palace team name** in the hero side block wraps to two lines on narrow side columns. `numberOfLines={2}` is deliberate — verify it reads correctly.
- **Synthesised ranks for non-MCI/CRY fixtures** can produce unusual combinations (e.g. a top-of-table team in the same fixture as another top-of-table team in a different league). They're plausible per league, not globally consistent — acceptable for Phase 4A's "make every fixture renderable" goal.

## Anti-checks (things deliberately not done)

- No new `packages/ui` components were added.
- No existing primitives were extended with new props (no new SafePill mode, no new GlassPanel variant).
- The route file's header / H1 / tab-strip block is byte-identical to before — only the placeholder block + its two orphan styles were removed.
- No `console.log`, no emoji, no font weight 600+, no inline `borderWidth: 0.5`. All hairlines via `StyleSheet.hairlineWidth`.
- No `useSlip` / "Slip" anywhere. Hook is `useNotePad`.
- No "AI" in user-facing copy. The CTA panel body translates the source's "AI will suggest…" to "The Count will suggest…".
- `FixtureListItem` type and `FIXTURES_BY_ID` are unchanged. `FIXTURE_DETAILS_BY_ID` is purely additive.

## Verification

- `pnpm typecheck` — passes across all 6 workspace packages (`types`, `tokens`, `api`, `pattern-engine`, `ui`, `mobile`).
- `npx expo export --platform ios` — bundles cleanly. `4.08 MB` hbc (up from `4.05 MB` at Phase 3.6.2 close — consistent with the added Overview tab code).
- **Not yet verified on device.** On-iPhone checklist:
  - From Fixtures list, tap MCI vs CRY → Overview renders with values matching the source `data.js` MCI/CRY reference: 2ND·74 PTS / 15TH·44 PTS, WWDWW / WDLLL forms, 80/12/8 win-prob, 4-1 H2H, 5-2 MCI last meeting, Michael Oliver 4.2/38%/above avg, four strongest angles.
  - Tap Liv-Ars, Rma-Bar, Bay-Dor → Overview renders with synthesised values, no missing fields, no crashes.
  - Tab swap: Team stats / Player stats / The Count each render `TabPlaceholder` with their phase number.
  - Each Strongest angle row toggles into the Note Pad on tap: + → ✓, glyph box tint shifts to teal, Note Pad bar count updates. Re-tap removes.
  - Back arrow returns to listing.
  - Build-a-builder buttons render with correct tints; tap shows press feedback but goes nowhere (no-op confirmed).
  - Win-prob hairline divider visible at default alpha — if not, apply the gotcha #11 fix above and report.

## Files changed

```
A packages/types/src/fixture-detail.ts
M packages/types/src/index.ts                       (5 new type re-exports)

A apps/mobile/src/mock/fixture-details.ts
A apps/mobile/src/components/fixture/OverviewTab.tsx
A apps/mobile/src/components/fixture/FixtureHeroPanel.tsx
A apps/mobile/src/components/fixture/StrongestAnglesPanel.tsx
A apps/mobile/src/components/fixture/H2HRefereePair.tsx
A apps/mobile/src/components/fixture/BuildABuilderPanel.tsx
A apps/mobile/src/components/fixture/TabPlaceholder.tsx
M apps/mobile/app/fixture/[id].tsx                  (tab router; placeholder block removed)
```

`git status` left dirty per workflow — Claude Code stops without committing.

## Known risks

1. **Synthesiser edge cases.** Char-code hashes on the existing 40+ team codes don't produce nonsense in the values I spot-checked (LIV-ARS, RMA-BAR, BAY-DOR), but I haven't exhaustively verified every id. If a fixture renders with a visibly broken value (winProb summing to 99 or 101, h2h `0-0 HOME` last-meeting), the fix is in the synthesiser — not the consumer.

2. **Hairline visibility (gotcha #11).** Two surfaces ship at `colors.border.default` (`0.06` alpha): the win-prob divider and the angle-row inter-row dividers. If they read as faint-or-absent on iPhone, the fix is local to each style object — see "Visual deltas".

3. **`onPick` is a no-op.** The CTA buttons fire press feedback but route nowhere yet. Phase 5 wires the destination via The Count tab's risk-aware seg-control.

4. **`FixtureDetail` is locked to the Overview slice.** Phase 4B will add `matrix: { home, away }` and Phase 4C will add `players`. Both extensions are additive; existing consumers (Overview, listing card, route) won't reshape.
