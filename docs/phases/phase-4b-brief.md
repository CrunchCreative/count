# Phase 4B — Fixture detail · Team stats tab

## Mission

Fill the Team stats tab on the fixture detail screen. Replaces the Phase 4A `TabPlaceholder` for `tab === 'team'` with a full `TeamStatsTab` composite.

After 4B:

- The fixture detail Team stats tab renders the **signature comparative-research interaction** of the product: a sticky-left, horizontally-scrollable matrix card with home/away teams stacked vertically, scrolling in unison so the user can scan down any fixture column and compare both teams over the selected window.
- Each row's left column shows the stat name + a SafePill threshold floor that **rebases as the window changes** (Last 5 → "5/5" becomes Last 10 → "10/10" with a new floor value).
- Each cell value in the scroll region is a **tap target**: tapping the value `N` adds a leg pinned at `(N-1)+` threshold to the Note Pad. (Reasoning: a bet at `(N-1)+` would have won on a match that returned `N`.)
- The Window selector cycles Last 5 / Last 10 / Last 20 / Season (38), updating the scrollable column count and the SafePill floors deterministically.
- A "Show all stats" toggle reveals four additional stats (TACKLES, SAVES, OFFSIDES, THROW INS) below the default rows.
- Above the matrix card, a **context stats block** shows xG and xGoT per side as read-only data (no addable behaviour, because xG isn't a betting market — it's reasoning context).

## Out of scope

- Player stats tab content (Phase 4C).
- The Count tab content (Phase 5).
- Filter pill behaviour. The pill renders for visual completeness with a placeholder count badge; tapping it does nothing. The filter dimensions and the bottom-sheet UX are deferred.
- The window selector's "Season" really meaning the full season — for 4B it means 38 fixtures synthesised deterministically. Phase 8 (real data) gives "Season" actual meaning.
- The advanced opponent-adjusted block from the source design. Out — re-evaluate post-V1.
- Per-fixture real-data scoring of stats. All values are synthesised from a per-fixture-per-team-per-stat hash.
- Animation when switching windows or toggling "Show all stats". Re-render is fine.
- Sticky-column shadow / edge-fade on horizontal scroll. May be a Phase 12 polish item if it reads poorly without it.

## Vocabulary

- Tab label stays **Team stats** (sentence case, decision 11).
- Internal component naming uses **matrix** (the comparative-grid shape): `TeamStatsTab`, `MatrixCard`, `MatrixSide`, `MatrixRow`, `MatrixCell`, `MatrixFixtureHeader`. Per decision 11 the word "matrix" survives only inside the code — never as a user-facing label.
- Category labels stay uppercase but **sans, not mono**: ATTACK · SET PIECES · DISCIPLINE · GOALKEEPING (etc.). Per design system rule: section/meta labels are uppercase sans with 0.4 letter-spacing.
- Stat names stay uppercase sans: GOALS · SHOTS OT · CORNERS · FOULS · TACKLES · SAVES · OFFSIDES · THROW INS.
- Numeric values stay **mono** per decision 8: cell values, hit counts inside SafePill, scoreline numbers in the fixture column heads, threshold values like "4+" and "↓12".

## Reference design hierarchy

Same ladder as Phase 4A:

1. **Existing app conventions.** Tab strip / route header / H1 / `useNotePad` / SafePill / Kit / Icon / GlassPanel / GlassSelect / SectionHead — all from `packages/ui`. Consumed as-is.
2. **Existing primitives.** `GlassSelect` handles the window dropdown (it has `value` + `options` + `onChange` + `filteringActive` already). `SafePill` handles the threshold display in the sticky column (`tier` + `threshold` + `hits` props).
3. **Design source.** `docs/design-source/the-count-v2/project/screens/fixture.jsx` (lines 249–414 — `TeamMatrixTab` + `MatrixSide`) and `styles.css` (lines 670–801 — the entire `.matrix-*` family). **Significant divergences from the source documented inline below.** The source design predates the horizontal-scroll + cell-tap interactions and uses the older `matrix-cell::after` underline-bar treatment; 4B abandons both.

## What diverges from the source

Listing these up front so review knows what to expect:

1. **Horizontal scroll with sticky left column.** Source CSS is a fixed `56px repeat(5, 1fr)` grid that doesn't scroll. 4B replaces this with a two-region layout: ~140px sticky column + `ScrollView horizontal` for fixture columns.
2. **Cell visual treatment.** Source uses plain text + a gradient underline bar (`matrix-cell::after`). 4B uses the **PlayerValueCell-style 26×26px filled rounded box** — amber gradient fill for hit cells, grey-stripped-back box for zero cells. The underline treatment is gone. This makes cells legible as tap targets.
3. **Cell tap interaction.** Source has no cell-tap behaviour; only the SafePill in column 1 is addable. 4B makes every non-zero cell tappable. Tapping cell value `N` produces a leg at `(N-1)+`.
4. **xG / xGoT context block above the matrix.** Not in source. New for 4B.
5. **"Show all stats" toggle wired to a real second tier.** Source has the toggle UI but its handler is `() => setShowAll(s => !s)` with no consumer. 4B wires it to add four extra stat rows (TACKLES, SAVES, OFFSIDES, THROW INS) to each category as appropriate (TACKLES + OFFSIDES into DEFENCE, SAVES into GOALKEEPING, THROW INS into SET PIECES).
6. **Filter pill is non-functional.** Source has a filter pill with count "2" hardcoded; 4B renders the same shape but the count is also placeholder (display only) and tapping does nothing.

## File map

### New files

- `apps/mobile/src/components/fixture/TeamStatsTab.tsx` — top-level assembly: H2 + body paragraph + window/filter row + xG/xGoT context block + matrix card.
- `apps/mobile/src/components/fixture/MatrixCard.tsx` — the glass card containing both sides. Owns the single horizontal `ScrollView` that both sides share. Manages scroll position state if needed.
- `apps/mobile/src/components/fixture/MatrixSide.tsx` — one team's section inside the card: head row (kit + name + count), fixtures header row (sticky "SAFE @" + scrolling fixture columns), scoreline row, then per-category groups of stat rows.
- `apps/mobile/src/components/fixture/MatrixRow.tsx` — one stat row: sticky left cell (stat name + SafePill) + scrolling cells. Receives the shared scroll position via a ScrollView ref or a context so all rows in the card scroll together. **Read structure section below — this is the load-bearing piece.**
- `apps/mobile/src/components/fixture/MatrixCell.tsx` — the 26×26 tappable cell.
- `apps/mobile/src/components/fixture/XGContextBlock.tsx` — xG / xGoT read-only block, sits above the matrix card.
- `apps/mobile/src/components/fixture/FilterPill.tsx` — placeholder filter pill (one-off, internal).

### Extended

- `packages/types/src/fixture-detail.ts` — add `matrix` and `xg` slots to `FixtureDetail`. New sub-types `TeamMatrixData` and `TeamMatrixStat` and `XGData`. Re-export from the barrel.
- `apps/mobile/src/mock/fixture-details.ts` — extend `MCI_CRY_OVERRIDE` to include the full 38-fixture-per-side matrix dataset (synthesised but plausible) and the xG/xGoT values. Extend the synthesiser to produce matrix + xG data for the other 40 fixtures.
- `apps/mobile/app/fixture/[id].tsx` — replace the `team` branch of the tab router. Was `<TabPlaceholder phase="4B" tabName="Team stats" />`; becomes `<TeamStatsTab fixture={fixture} />`. **Two lines change.** Header / H1 / tab strip / styles / other tab branches all untouched.

### Untouched

- All other Phase 4A components.
- `packages/ui`. No new primitives. No prop additions.
- The route file's existing scaffolding.
- The Phase 4A `MCI_CRY_OVERRIDE` Overview block. The same `Object.assign` merge gets a second key — `matrix` + `xg` — but the existing Overview keys stay verbatim.

## 1. Type extension

Extend `packages/types/src/fixture-detail.ts`:

```ts
// 4B: comparative team-matrix data.
//
// Architecture note: values are ALL stored for the full 38-fixture window.
// The visible window (5/10/20/38) is a *display* concern handled in the
// component; threshold and hits are *derived* per window via
// deriveThresholdForWindow. Storing only 5 values and re-synthesising for
// larger windows would produce different floors than displaying a slice of
// the same 38, so we commit to 38 stored values per stat per team.

export interface TeamMatrixStat {
  /** Match-by-match stat values, indexed 0 = most recent. Always length 38. */
  values: number[];
  /** Direction of the betting threshold this stat supports.
   *  - 'gte': over-style (e.g. "City shots ≥ 4"). Threshold is the floor.
   *  - 'lte': under-style (e.g. "City fouls ≤ 12"). Threshold is the ceiling.
   *  Used by deriveThresholdForWindow and by the cell tap-to-add semantic.
   */
  dir: 'gte' | 'lte';
  /** Target value, only present for 'lte' stats (used to render dim cells for
   *  values that exceeded the target). For 'gte' stats, the target is implicit
   *  in the derived window floor. */
  target?: number;
  /** Whether this stat is shown by default or only when "Show all stats" is on. */
  defaultVisible: boolean;
}

/** Fixture-by-fixture column header data — opponent code, date, scoreline, W/D/L. */
export interface TeamMatrixFixture {
  /** Short date label, e.g. '09 May'. */
  date: string;
  /** Opponent team code, e.g. 'BRE'. */
  opp: string;
  /** Whether the recorded fixture was played at the opponent's home. */
  oppHome: boolean;
  /** Final scoreline as a string, e.g. '3-0'. */
  result: string;
  /** Win/draw/loss outcome for this team. */
  wdl: 'W' | 'D' | 'L';
}

export interface TeamMatrixSide {
  /** 38 historical fixtures, indexed 0 = most recent. */
  fixtures: TeamMatrixFixture[];
  /** Stats grouped by category. Order in the map is render order. */
  stats: Record<string, Record<string, TeamMatrixStat>>;
}

export interface XGData {
  /** xG value, decimal — typical range 0.5–3.5. */
  xg: number;
  /** xGoT (expected goals on target) value, decimal — typical range 0.3–2.5. */
  xgot: number;
}

export interface FixtureMatrix {
  home: TeamMatrixSide;
  away: TeamMatrixSide;
}

export interface FixtureXG {
  home: XGData;
  away: XGData;
}
```

Add to `FixtureDetail`:

```ts
export interface FixtureDetail extends FixtureListItem {
  // ... existing 4A fields ...
  matrix: FixtureMatrix;
  xg: FixtureXG;
}
```

Re-export the new types from `packages/types/src/index.ts`.

### Category structure

The stat categories and stat keys are fixed for V1 mock; declare them once in a colocated const inside `fixture-details.ts`:

```ts
const TEAM_STAT_DEFINITIONS = {
  ATTACK: {
    GOALS:      { dir: 'gte', defaultVisible: true,  range: [0, 5] },
    'SHOTS OT': { dir: 'gte', defaultVisible: true,  range: [0, 12] },
  },
  'SET PIECES': {
    CORNERS:   { dir: 'gte', defaultVisible: true,  range: [0, 14] },
    'THROW INS': { dir: 'gte', defaultVisible: false, range: [10, 30] },
  },
  DISCIPLINE: {
    FOULS:    { dir: 'gte', defaultVisible: true,  range: [4, 18] },
    OFFSIDES: { dir: 'gte', defaultVisible: false, range: [0, 6] },
  },
  DEFENCE: {
    TACKLES: { dir: 'gte', defaultVisible: false, range: [8, 24] },
  },
  GOALKEEPING: {
    SAVES: { dir: 'gte', defaultVisible: false, range: [0, 10] },
  },
} as const;
```

The brief uses `dir: 'gte'` for every stat in V1. FOULS as an over-style market (fouls 5+) is the realistic mock; if you want FOULS as `lte` for "Player avoids fouls" markets, that's a player-stats concern not a team-stats one. Keep `lte` out of 4B's mock — the column reads identically since dim cells need a `target`, which we don't have when every value is over-style.

Note: this means the source's `matrix-cell.dim` treatment (red underline bar for values that exceeded the under-target) is unreachable in 4B mock and the visual code path doesn't need to exist for 4B. The brief notes this in the cell rendering section.

## 2. Mock data — synthesiser

### MCI/CRY override

The Phase 4A `MCI_CRY_OVERRIDE` gets two new keys: `matrix` and `xg`. Use these values verbatim (port from source `data.js` lines 167–210 for the 5-fixture seed, then extend with synthesised entries 5–37 using the synthesiser below; xG values are new):

```ts
const MCI_CRY_OVERRIDE = {
  // ... existing 4A overview keys ...
  xg: {
    home: { xg: 2.4, xgot: 1.6 },
    away: { xg: 0.9, xgot: 0.5 },
  },
  matrix: synthesiseMatrixForFixture('mci-cry', 'MCI', 'CRY'), // see below
  // BUT for MCI/CRY, override the FIRST 5 fixtures of each side with source-verbatim entries:
  // (apply this override AFTER the synthesise call, mutating fixtures[0..4] and the first 5 values of each stat)
};
```

Verbatim source for MCI fixtures 0–4 (per `data.js` 168–175):
```ts
const MCI_HOME_5 = [
  { date: '09 May', opp: 'BRE', oppHome: true,  result: '3-0', wdl: 'W' as const },
  { date: '04 May', opp: 'EVE', oppHome: false, result: '3-3', wdl: 'D' as const },
  { date: '25 Apr', opp: 'SOU', oppHome: true,  result: '2-1', wdl: 'W' as const },
  { date: '22 Apr', opp: 'BUR', oppHome: false, result: '0-1', wdl: 'L' as const },
  { date: '19 Apr', opp: 'ARS', oppHome: true,  result: '2-1', wdl: 'W' as const },
];
```

Verbatim seed values for MCI ATTACK.GOALS first 5: `[3,3,2,1,2]`. SHOTS OT first 5: `[10,4,6,9,5]`. SET PIECES.CORNERS first 5: `[10,9,10,11,8]`. DISCIPLINE.FOULS first 5: `[8,5,9,12,5]`. (See `data.js` lines 178–186.)

CRY equivalents per `data.js` lines 189–209: opponents `[EVE, WOL, BOU, NFO, LIV]`, GOALS `[2,2,0,3,1]`, SHOTS OT `[8,5,1,7,7]`, CORNERS `[5,1,1,1,8]`, FOULS `[5,8,11,13,10]`.

Everything beyond index 4 in MCI/CRY uses the synthesiser. The mock keeps real values where they exist in source and synthesises the rest.

### Synthesiser

```ts
function synthesiseMatrixForFixture(
  fixtureId: string,
  homeCode: string,
  awayCode: string,
): FixtureMatrix {
  return {
    home: synthesiseSide(fixtureId, homeCode, 'home'),
    away: synthesiseSide(fixtureId, awayCode, 'away'),
  };
}

function synthesiseSide(fixtureId: string, teamCode: string, side: 'home' | 'away'): TeamMatrixSide {
  const seed = stringHash(`${fixtureId}::${teamCode}::${side}`);
  const fixtures = synthesiseFixtures(seed, teamCode);
  const stats: Record<string, Record<string, TeamMatrixStat>> = {};
  for (const [catName, catStats] of Object.entries(TEAM_STAT_DEFINITIONS)) {
    stats[catName] = {};
    for (const [statName, def] of Object.entries(catStats)) {
      stats[catName][statName] = {
        values: synthesiseStatValues(seed + stringHash(statName), def.range),
        dir: def.dir,
        defaultVisible: def.defaultVisible,
      };
    }
  }
  return { fixtures, stats };
}
```

`stringHash(s)` is a small deterministic 32-bit hash — char-code sum × 31 modulo 2³¹ is sufficient. No `Math.random` anywhere.

`synthesiseFixtures(seed, teamCode)` produces 38 plausible fixtures. Opponent code rotates through a fixed list of EPL teams excluding the team itself. Dates count back monthly from today's date. Results: scorelines biased toward 1-1 / 2-1 / 2-0 / 1-2; W/D/L derived from the scoreline.

`synthesiseStatValues(seed, [min, max])` produces 38 integers in `[min, max]` using a fast deterministic PRNG seeded by the hash (e.g. mulberry32 — 12 lines, included in the brief below). Distribution is slightly biased toward the middle of the range so values don't cluster at the extremes.

```ts
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function synthesiseStatValues(seed: number, range: readonly [number, number]): number[] {
  const rng = mulberry32(seed);
  const [min, max] = range;
  const out: number[] = [];
  for (let i = 0; i < 38; i++) {
    // bias toward middle via average of two draws
    const v = (rng() + rng()) / 2;
    out.push(Math.round(min + v * (max - min)));
  }
  return out;
}
```

### xG synthesiser

```ts
function synthesiseXG(fixtureId: string, homeCode: string, awayCode: string): FixtureXG {
  const rng = mulberry32(stringHash(`${fixtureId}::xg::${homeCode}::${awayCode}`));
  // xG typical range 0.5–3.5; xGoT typical 0.3–2.5 (less than xG by definition).
  const homeXG = 0.5 + rng() * 3.0;
  const homeXGoT = Math.min(homeXG, 0.3 + rng() * 2.2);
  const awayXG = 0.5 + rng() * 2.5;
  const awayXGoT = Math.min(awayXG, 0.3 + rng() * 1.8);
  return {
    home: { xg: Math.round(homeXG * 10) / 10, xgot: Math.round(homeXGoT * 10) / 10 },
    away: { xg: Math.round(awayXG * 10) / 10, xgot: Math.round(awayXGoT * 10) / 10 },
  };
}
```

Round to one decimal place. Display format: `"2.4"`.

### Threshold derivation

This is the function the matrix component calls every render to compute the SafePill display for each row given the current window. Pure, no side effects, deterministic on `(values, window, dir)`.

```ts
/**
 * Given a stat's 38 values, a window size, and a direction, derive the
 * SafePill displayed for that row.
 *
 * For 'gte': returns the floor — the minimum value the team hit across all
 *   N matches in the window. SafePill threshold = "Xth+", hits = N, total = N.
 *   If the floor is 0, threshold = "—" and tier = "muted" (no addable leg).
 *
 * For 'lte': returns the ceiling — the maximum value the team's stat
 *   stayed under across all N matches. SafePill threshold = "↓X", hits = N,
 *   total = N. (Unused in 4B mock since all stats are 'gte'.)
 */
export function deriveThresholdForWindow(
  values: number[],
  window: number,
  dir: 'gte' | 'lte',
): { threshold: string; hits: number; total: number; tier: 'teal' | 'amber' | 'muted' } {
  const slice = values.slice(0, window);
  if (dir === 'gte') {
    const floor = Math.min(...slice);
    if (floor <= 0) {
      return { threshold: '—', hits: 0, total: window, tier: 'muted' };
    }
    return {
      threshold: `${floor}+`,
      hits: window,
      total: window,
      tier: 'teal', // floor across all N is a 5/5-equivalent = teal
    };
  } else {
    const ceil = Math.max(...slice);
    return {
      threshold: `↓${ceil}`,
      hits: window,
      total: window,
      tier: 'amber',
    };
  }
}
```

This lives in `apps/mobile/src/mock/fixture-details.ts` and is exported for component consumption. Phase 7+ (real data) might promote it to `@count/pattern-engine` but for 4B it stays colocated with the mock.

**Note on the tier:** the source design uses `tier: 'teal'` whenever `hits === total` (the team hit the threshold in every match in the window). For our derived floor that's *always true by construction*. So the floor-pill is always teal. If the floor is 0 the pill becomes muted "—" instead. There is no path that produces an amber-pill in 4B's `gte` setup. This is correct — the safe anchor is, definitionally, always 5/5 or 10/10 or 20/20. If we want stats with weaker pills (e.g. "hit in 4 of 5") that's a follow-up feature, not 4B's job.

## 3. Tab routing change in route file

Two lines change in `apps/mobile/app/fixture/[id].tsx`:

1. Add `import { TeamStatsTab } from '../../src/components/fixture/TeamStatsTab';`
2. Replace the team-tab branch:

```tsx
{tab === 'team' && fixture ? (
  <TeamStatsTab fixture={fixture} />
) : null}
```

The `TabPlaceholder` import stays — Player stats and The Count branches still use it.

## 4. `TeamStatsTab` — top-level

`apps/mobile/src/components/fixture/TeamStatsTab.tsx`:

```tsx
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { FixtureDetail } from '@count/types';
import { GlassSelect } from '@count/ui';
import { colors, typography } from '@count/tokens';
import { MatrixCard } from './MatrixCard';
import { XGContextBlock } from './XGContextBlock';
import { FilterPill } from './FilterPill';

export type WindowSize = 5 | 10 | 20 | 38;

export interface TeamStatsTabProps {
  fixture: FixtureDetail;
}

const WINDOW_OPTIONS = [
  { id: '5', label: 'Last 5 matches' },
  { id: '10', label: 'Last 10 matches' },
  { id: '20', label: 'Last 20 matches' },
  { id: '38', label: 'Season' },
];

export function TeamStatsTab({ fixture }: TeamStatsTabProps) {
  const [windowSize, setWindowSize] = useState<WindowSize>(5);
  const [showAll, setShowAll] = useState(false);

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={h2Style}>Team stats</Text>
      <Text style={bodyStyle}>
        Match-by-match research across the selected window. The threshold pill on each row shows the highest value the team hit in every fixture — a safe anchor for builder legs.
      </Text>

      <View style={selectorRowStyle}>
        <View style={{ flex: 1 }}>
          <GlassSelect
            value={String(windowSize)}
            options={WINDOW_OPTIONS}
            onChange={(id) => setWindowSize(Number(id) as WindowSize)}
          />
        </View>
        <FilterPill count={2} />
      </View>

      <XGContextBlock xg={fixture.xg} homeCode={fixture.home} awayCode={fixture.away} />

      <MatrixCard
        matrix={fixture.matrix}
        homeCode={fixture.home}
        awayCode={fixture.away}
        fixtureId={fixture.id}
        windowSize={windowSize}
        showAll={showAll}
        onToggleShowAll={() => setShowAll((v) => !v)}
      />
    </View>
  );
}
```

### Style objects

```ts
const h2Style = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 22,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.3,
};
const bodyStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.regular,
  marginTop: 6,
  lineHeight: 13 * 1.5,
};
const selectorRowStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 8,
  marginTop: 14,
};
```

## 5. `FilterPill` — placeholder

`apps/mobile/src/components/fixture/FilterPill.tsx`:

Source design `fixture.jsx` lines 268–275 has filter as a `glass-select` with icon + label + count badge + chevron. 4B builds an equivalent shape but as a non-functional Pressable. Tapping does nothing.

```tsx
import type { ReactElement } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { Icon } from '@count/ui';
import { colors, typography } from '@count/tokens';

export interface FilterPillProps {
  /** Display-only count badge. */
  count?: number;
}

export function FilterPill({ count }: FilterPillProps): ReactElement {
  return (
    <Pressable
      onPress={undefined}
      accessibilityRole="button"
      accessibilityLabel="Filters"
      accessibilityHint="Filter options will be available in a future update"
      style={containerStyle}
    >
      {({ pressed }) => (
        <View style={pressed ? innerPressedStyle : innerStyle}>
          <Icon name="filter" size={13} color={colors.text.muted} />
          <Text style={labelStyle}>Filters</Text>
          {typeof count === 'number' ? (
            <View style={countBadgeStyle}>
              <Text style={countBadgeTextStyle}>{count}</Text>
            </View>
          ) : null}
          <Icon name="chevron-down" size={13} color={colors.text.muted} />
        </View>
      )}
    </Pressable>
  );
}

const containerStyle: ViewStyle = {
  borderRadius: 10,
  overflow: 'hidden',
};

const innerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  paddingHorizontal: 12,
  paddingVertical: 10,
  backgroundColor: 'rgba(255,255,255,0.02)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  borderRadius: 10,
};

const innerPressedStyle: ViewStyle = {
  ...innerStyle,
  opacity: 0.85,
};

const labelStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
};

const countBadgeStyle: ViewStyle = {
  paddingHorizontal: 6,
  paddingVertical: 1,
  borderRadius: 999,
  backgroundColor: 'rgba(232,181,58,0.10)',
  borderWidth: 1,
  borderColor: 'rgba(232,181,58,0.25)',
};

const countBadgeTextStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.medium,
};
```

Same Pressable pattern as 4A.1 fix: single static `containerStyle` on the Pressable; layout lives on a children-as-function inner View.

## 6. `XGContextBlock`

`apps/mobile/src/components/fixture/XGContextBlock.tsx`:

A read-only block above the matrix card. Two side-by-side panels, one per team. Each panel: team code label + xG value + xGoT value, all stacked simply.

**This is new design — no source reference.** The shape mirrors the H2H/Referee paired panels from Phase 4A's Overview: two GlassPanels in a row, `flex: 1` each, gap 10, with the GlassPanel-flex-wrapping pattern (decision 8 / gotcha #8) per Phase 4A.

Visual: each panel shows the team code (e.g. "MCI") top-left muted, then on one line "XG · 2.4" and below it "XGOT · 1.6". Or similar. **Numbers in mono, labels in sans, labels uppercase tracking 0.4.**

```tsx
import type { ReactElement } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import type { FixtureXG } from '@count/types';
import { GlassPanel } from '@count/ui';
import { colors, typography } from '@count/tokens';

export interface XGContextBlockProps {
  xg: FixtureXG;
  homeCode: string;
  awayCode: string;
}

export function XGContextBlock({ xg, homeCode, awayCode }: XGContextBlockProps): ReactElement {
  return (
    <View style={wrapStyle}>
      <View style={{ flex: 1 }}>
        <GlassPanel variant="standard" style={panelInnerStyle}>
          <XGSide code={homeCode} data={xg.home} />
        </GlassPanel>
      </View>
      <View style={{ flex: 1 }}>
        <GlassPanel variant="standard" style={panelInnerStyle}>
          <XGSide code={awayCode} data={xg.away} />
        </GlassPanel>
      </View>
    </View>
  );
}

function XGSide({ code, data }: { code: string; data: { xg: number; xgot: number } }) {
  return (
    <View>
      <Text style={teamLabelStyle}>{code}</Text>
      <View style={metricRowStyle}>
        <Text style={metricLabelStyle}>XG</Text>
        <Text style={metricValueStyle}>{data.xg.toFixed(1)}</Text>
      </View>
      <View style={[metricRowStyle, { marginTop: 4 }]}>
        <Text style={metricLabelStyle}>XGOT</Text>
        <Text style={metricValueStyle}>{data.xgot.toFixed(1)}</Text>
      </View>
    </View>
  );
}

const wrapStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 10,
  marginTop: 14,
};

const panelInnerStyle: ViewStyle = {
  padding: 12,
};

const teamLabelStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 10,
  fontWeight: typography.weight.medium,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
  marginBottom: 6,
};

const metricRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 8,
};

const metricLabelStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontSans,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const metricValueStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontMono,
  fontSize: 18,
  fontWeight: typography.weight.medium,
};
```

(The `[metricRowStyle, { marginTop: 4 }]` array on a `View` is safe — gotcha #10 only affects `Pressable`.)

## 7. `MatrixCard` — sticky-left + shared horizontal scroll

This is the load-bearing piece. **Read this section twice before coding.**

### Conceptual layout

The card is a `GlassPanel variant="elevated"` containing, in order, a single horizontal flex layout:

```
┌─ outer card (GlassPanel) ──────────────────────────────────────────┐
│ ┌─ STICKY LEFT REGION (~140px) ─┐  ┌─ SCROLLABLE RIGHT REGION ──┐  │
│ │                               │  │ ┌─────────────────────────┐│  │
│ │   home head row               │  │ │ home fixtures header    ││  │
│ │   home scoreline label        │  │ │ home scoreline pills row││  │
│ │   ATTACK category label       │  │ │ (blank)                 ││  │
│ │   ┌─ row: GOALS + SafePill ─┐ │  │ │ GOALS cells × N         ││  │
│ │   ┌─ row: SHOTS OT + Pill ──┐ │  │ │ SHOTS OT cells × N      ││  │
│ │   SET PIECES                  │  │ │ (blank)                 ││  │
│ │   ┌─ row: CORNERS + Pill ───┐ │  │ │ CORNERS cells × N       ││  │
│ │   DISCIPLINE                  │  │ │ (blank)                 ││  │
│ │   ┌─ row: FOULS + Pill ─────┐ │  │ │ FOULS cells × N         ││  │
│ │                               │  │ │ ... away mirror below   ││  │
│ │   away head row               │  │ │                         ││  │
│ │   ...                         │  │ │                         ││  │
│ │                               │  │ └─────────────────────────┘│  │
│ └───────────────────────────────┘  └────────────────────────────┘  │
│ ┌─ footer (scroll hint + show-all toggle) ─┐                       │
│ └────────────────────────────────────────────                      │
└─────────────────────────────────────────────────────────────────────┘
```

### The two regions must align row-by-row

This is the crucial structural constraint. For every "thing" on the left there's a corresponding "thing" on the right at the same vertical offset, regardless of whether one or both happens to be visually empty (a "category label" on the left corresponds to a blank gap on the right; the right's "scoreline pills row" corresponds to a blank gap on the left).

**The way to achieve this reliably is to give every row a fixed height.** Each row type gets a constant exported by the component:

```ts
const ROW_HEIGHT_HEAD = 36;         // team head row (kit + name)
const ROW_HEIGHT_CATEGORY = 28;     // category label like "ATTACK"
const ROW_HEIGHT_FIXTURE_HEADER = 42; // date + opp kit + opp code stacked
const ROW_HEIGHT_SCORE = 28;        // scoreline pills row
const ROW_HEIGHT_STAT = 40;         // stat name + SafePill on the left, cells on the right
const ROW_GAP_SIDES = 22;           // gap between home and away sides
```

Every left-region row and every right-region row hardcodes its own height to one of these constants. If a row is "blank" on one side, render a `<View style={{ height: ROW_HEIGHT_CATEGORY }} />` spacer — never let content size determine row height.

### Component structure

```tsx
import { useRef } from 'react';
import { Animated, ScrollView, Text, View, type ViewStyle } from 'react-native';
import type { FixtureMatrix } from '@count/types';
import { GlassPanel, Icon } from '@count/ui';
import { colors, typography } from '@count/tokens';
import { MatrixSide } from './MatrixSide';
import type { WindowSize } from './TeamStatsTab';

export interface MatrixCardProps {
  matrix: FixtureMatrix;
  homeCode: string;
  awayCode: string;
  fixtureId: string;
  windowSize: WindowSize;
  showAll: boolean;
  onToggleShowAll: () => void;
}

export function MatrixCard({
  matrix,
  homeCode,
  awayCode,
  fixtureId,
  windowSize,
  showAll,
  onToggleShowAll,
}: MatrixCardProps) {
  // One ScrollView ref drives both sides' right-region scroll. Each MatrixSide
  // gets its own ScrollView (so cells can render inside it) but they share a
  // ref so scrolling either scrolls both. See "Scroll syncing" below.
  const scrollRef = useRef<ScrollView | null>(null);

  return (
    <View style={{ marginTop: 16 }}>
      <GlassPanel variant="elevated" style={glassInnerStyle}>
        <MatrixSide
          side="home"
          teamCode={homeCode}
          data={matrix.home}
          windowSize={windowSize}
          showAll={showAll}
          fixtureId={fixtureId}
        />
        <View style={{ height: ROW_GAP_SIDES }} />
        <MatrixSide
          side="away"
          teamCode={awayCode}
          data={matrix.away}
          windowSize={windowSize}
          showAll={showAll}
          fixtureId={fixtureId}
        />
        <View style={footerStyle}>
          {/* Scroll hint left, show-all toggle right */}
          <View style={footerLeftStyle}>
            <Icon name="arrows-h" size={13} color={colors.amber.bright} />
            <Text style={scrollHintTextStyle}>
              {windowSize > 5 ? `Scroll to see fixtures 6–${windowSize}` : 'Last 5 matches'}
            </Text>
          </View>
          <Pressable
            onPress={onToggleShowAll}
            style={toggleStyle}
            accessibilityRole="button"
          >
            {({ pressed }) => (
              <View style={pressed ? toggleInnerPressedStyle : toggleInnerStyle}>
                <Text style={toggleTextStyle}>
                  {showAll ? 'Show less' : 'Show all stats'}
                </Text>
                <Icon name={showAll ? 'chevron-up' : 'chevron-down'} size={13} color={colors.text.muted} />
              </View>
            )}
          </Pressable>
        </View>
      </GlassPanel>
    </View>
  );
}

const glassInnerStyle: ViewStyle = {
  padding: 14,
};

const footerStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 14,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.14)', // gotcha #11 strong alpha
};

// ...remaining styles as needed...

export const ROW_HEIGHT_HEAD = 36;
export const ROW_HEIGHT_CATEGORY = 28;
export const ROW_HEIGHT_FIXTURE_HEADER = 42;
export const ROW_HEIGHT_SCORE = 28;
export const ROW_HEIGHT_STAT = 40;
export const ROW_GAP_SIDES = 22;

export const STICKY_COL_WIDTH = 140;
export const CELL_WIDTH = 26;
export const CELL_GAP = 6;
```

### Scroll syncing across home + away sides

**The user must be able to scroll the home fixtures row, and the away fixtures row scrolls in lock step.** Same for any other row inside the card with cells.

Three approaches, ranked:

**A. Single ScrollView wrapping all right-region rows.** Both sides' right-region content lives inside one horizontal ScrollView. Conceptually clean. Problem: the left region's sticky column is a separate vertical layout, so you can't put both inside one ScrollView and one outer flex row without breaking sticky-column behaviour.

**B. Two ScrollViews (one per side) synced via animated scrollX.** Each `MatrixSide` has its own ScrollView. They share a single `Animated.Value` for `scrollX` via context or prop. When one scrolls, it pushes scrollX; the other watches scrollX and calls `scrollTo({ x, animated: false })`. This is a known RN pattern.

**C. One ScrollView per side, no syncing.** Reject. Defeats the comparison interaction.

**Use Path B.** Implementation note in `MatrixCard`:

```tsx
const scrollX = useRef(new Animated.Value(0)).current;
const homeScrollRef = useRef<ScrollView | null>(null);
const awayScrollRef = useRef<ScrollView | null>(null);

// Pass to each MatrixSide:
<MatrixSide
  scrollX={scrollX}
  scrollRef={homeScrollRef}
  syncRef={awayScrollRef}
  ...
/>
<MatrixSide
  scrollX={scrollX}
  scrollRef={awayScrollRef}
  syncRef={homeScrollRef}
  ...
/>
```

In each side:

```tsx
const onScroll = Animated.event(
  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
  {
    useNativeDriver: false,
    listener: (e) => {
      syncRef.current?.scrollTo({ x: e.nativeEvent.contentOffset.x, animated: false });
    },
  },
);
```

This creates a two-way sync without infinite loops because `scrollTo({ animated: false })` does NOT fire `onScroll` again on either side. Verify on device — if it does infinite-loop, gate the sync with a tiny isProgrammaticScroll flag.

### Sticky column inside each MatrixSide

Each MatrixSide renders as a **horizontal flex row**:

```
[ left sticky column View ][ ScrollView horizontal ]
```

The left View is fixed width (`STICKY_COL_WIDTH`). The ScrollView's contentContainer width is `windowSize * (CELL_WIDTH + CELL_GAP)`. Inside the ScrollView, content stacks vertically (rows of cells). Each row matches the corresponding left-side row by sharing the same fixed height constant.

```tsx
<View style={{ flexDirection: 'row' }}>
  <View style={{ width: STICKY_COL_WIDTH }}>
    {/* Left column — head + category labels + stat rows (stat name + SafePill) */}
  </View>
  <ScrollView
    ref={scrollRef}
    horizontal
    showsHorizontalScrollIndicator={false}
    onScroll={onScroll}
    scrollEventThrottle={16}
    contentContainerStyle={{ paddingHorizontal: 0 }}
  >
    <View>
      {/* Right region — fixture header + scoreline pills row + cell rows */}
    </View>
  </ScrollView>
</View>
```

**Critical:** every "row" inside the left View must match by index and height the corresponding row inside the ScrollView. If the left View has 8 rows (head + category-A + stat-1 + stat-2 + category-B + stat-3 + category-C + stat-4), the right View also has 8 rows (head's right-side blank + category's right-side blank + fixture header + scoreline pills row + ...wait, that's not parallel).

Re-examining: head row, fixture header, scoreline pills row, then alternating category labels and stat rows. Counting carefully (default visible stats: GOALS, SHOTS OT, CORNERS, FOULS):

```
Row | Left content                  | Right content                    | Height
1   | team head (kit + name)        | "5 OF 38"-style count             | ROW_HEIGHT_HEAD
2   | (blank)                       | fixture header columns (date+opp) | ROW_HEIGHT_FIXTURE_HEADER
3   | (blank)                       | scoreline pills row               | ROW_HEIGHT_SCORE
4   | category label "ATTACK"       | (blank)                           | ROW_HEIGHT_CATEGORY
5   | "GOALS" + SafePill            | GOALS cells × N                   | ROW_HEIGHT_STAT
6   | "SHOTS OT" + SafePill         | SHOTS OT cells × N                | ROW_HEIGHT_STAT
7   | category label "SET PIECES"   | (blank)                           | ROW_HEIGHT_CATEGORY
8   | "CORNERS" + SafePill          | CORNERS cells × N                 | ROW_HEIGHT_STAT
9   | category label "DISCIPLINE"   | (blank)                           | ROW_HEIGHT_CATEGORY
10  | "FOULS" + SafePill            | FOULS cells × N                   | ROW_HEIGHT_STAT
[ if showAll: add categories DEFENCE + GOALKEEPING with TACKLES/SAVES/OFFSIDES/THROW INS as appropriate ]
```

(Sub-question worth flagging: row 1's right side. Source has `<div className="count">5 OF 12</div>` on the head — for our model this is `windowSize OF 38` or `Last X of 38 fixtures`. Place this in the right region's first row, vertically aligned with the team name on the left. Caveat: it's not a per-fixture column thing; it should stay aligned to the right edge of the visible scroll viewport, which doesn't have a natural "where" — recommend placing it on the **left** alongside the team name, taking the `ROW_HEIGHT_HEAD` whole-width span via a `space-between` layout that puts kit+name left and count right within the sticky region. Simpler. The source's intent of "count on the right" was for the non-scrolling 5-column grid; with scroll, "right" is ambiguous. Put it in the left sticky region.)

Updated row 1 plan:

```
1   | team head (kit + name) + "5 OF 38" right-aligned   | (blank)   | ROW_HEIGHT_HEAD
```

This means the sticky region per side is wider than just the row 5+ stat-name + SafePill content — it spans the whole "head" row. Manage this with a clean `flexDirection: 'row'` between left and right at the `MatrixSide` level: every row inside the side is `flexDirection: 'row'` with a fixed-width left part and a flex-1 right ScrollView. The head row's left part renders kit + name + count (width unconstrained inside that part). Subsequent rows' left parts are `STICKY_COL_WIDTH` wide.

Implementation tip: easier to just make the head a special non-row block above the scrolling sub-table, separate from the column-aligned rows below it. Pattern:

```tsx
<View style={{ marginBottom: 4 }}>
  <SideHead teamCode={teamCode} windowSize={windowSize} />
</View>
<View style={{ flexDirection: 'row' }}>
  <View style={{ width: STICKY_COL_WIDTH }}>
    {/* (blank for fixture header) */}
    <View style={{ height: ROW_HEIGHT_FIXTURE_HEADER }} />
    {/* (blank for scorelines) */}
    <View style={{ height: ROW_HEIGHT_SCORE }} />
    {/* category + stat rows */}
    {categoryGroups.map(...)}
  </View>
  <ScrollView ... >
    <View>
      <FixtureHeaderRow fixtures={data.fixtures.slice(0, windowSize)} />
      <ScorelineRow fixtures={data.fixtures.slice(0, windowSize)} />
      {categoryGroups.map(...)}  // same iteration as left, but rendering cells
    </View>
  </ScrollView>
</View>
```

`SideHead` is a standalone block at the top of each side, full-width (sticky-left col + scroll region overlap doesn't matter for it). The two regions only need to align starting from the fixture header row.

This keeps the layout simpler and the head can show "Last 10 of 38" without juggling column widths.

## 8. `MatrixSide` and helpers

I'm going to stop dictating every component and trust the agent to compose `MatrixSide`, `MatrixRow`, `MatrixCell`, `FixtureHeaderRow`, `ScorelineRow`, and `SideHead` based on the structure above. Key rules they must follow:

### MatrixRow

- Sticky-left part: width `STICKY_COL_WIDTH`, contains `[stat name uppercase sans] + [SafePill]`. Stat name is `fontSize: 10, letterSpacing: 0.4, color: text.hint, textTransform: uppercase`. SafePill consumes the derived threshold/hits/tier from `deriveThresholdForWindow(stat.values, windowSize, stat.dir)`. SafePill is **addable** (tapping toggles the floor-anchor leg) — use SafePill's existing `leg` prop with a leg constructed as:
  ```ts
  const leg = {
    id: `${fixtureId}::team::${teamCode}::${statName}`,
    fixtureId,
    threshold: derived.threshold,
    hits: derived.hits,
    total: derived.total,
    tier: derived.tier,
    title: `${TEAMS[teamCode].name} ${statName.toLowerCase()}`,
    reason: `Threshold ${derived.threshold} hit in every match across L${windowSize}`,
  };
  ```
- Right scrolling part: `windowSize` × `MatrixCell` components in a `flexDirection: 'row'` with `gap: CELL_GAP`. Each cell receives the value and a per-cell `leg` for the cell-tap-add interaction (see below).

### MatrixCell — the 26×26 tappable box

Visual treatment ported from source `PlayerValueCell` (lines 571–596) at 26×26 instead of 22×22:

- **Zero cells**: `width: 26, height: 26, borderRadius: 4`, background `rgba(255,255,255,0.02)`, border `1px solid rgba(255,255,255,0.10)`, text `'0'` mono 11 muted faint. Not tappable.
- **Non-zero cells**: same dimensions, amber linear gradient background (`rgba(232,181,58,0.18)` → `rgba(232,181,58,0.08)`), border `1px solid rgba(232,181,58,0.30)`, text mono 11 amber-bright, iOS shadow `shadowColor: amber.bright, shadowOpacity: 0.10, shadowRadius: 4`. Tappable.
- **Cells in Note Pad**: same shape but **border becomes teal** `rgba(93,202,165,0.60)` and the iOS shadow tints teal. This is the visual feedback from your decision.

```tsx
import { useNotePad } from '@count/ui';

export function MatrixCell({
  value,
  fixtureId,
  teamCode,
  statName,
  windowSize,
  matchIndex,
}: MatrixCellProps) {
  const notePad = useNotePad();
  const isZero = value === 0;
  const legId = `${fixtureId}::team::${teamCode}::${statName}::cell-${matchIndex}::value-${value}`;
  const inPad = !isZero && notePad.isInPad(legId);

  if (isZero) {
    return (
      <View style={cellZeroStyle}>
        <Text style={cellZeroTextStyle}>0</Text>
      </View>
    );
  }

  const onPress = () => {
    notePad.toggleLeg({
      id: legId,
      fixtureId,
      threshold: `${value - 1}+`,
      hits: countAtThreshold(value - 1, windowSize, fixtureId, teamCode, statName), // see note below
      total: windowSize,
      tier: 'teal',
      title: `${TEAMS[teamCode].name} ${statName.toLowerCase()} ${value - 1}+`,
      reason: `Value ${value} from fixture ${matchIndex + 1} of ${windowSize} — bet at ${value - 1}+ would win here`,
    });
  };

  return (
    <Pressable onPress={onPress} style={cellPressableStyle} accessibilityRole="button">
      {({ pressed }) => (
        <View style={inPad ? cellInPadStyle : pressed ? cellPressedStyle : cellAmberStyle}>
          <Text style={cellAmberTextStyle}>{value}</Text>
        </View>
      )}
    </Pressable>
  );
}
```

**`countAtThreshold` note:** computing how many cells in the window have value ≥ `(N-1)` requires access to the whole row's values. Simplest: pass `rowValues: number[]` into MatrixCell rather than reaching back through props for fixtureId/statName lookups. Refactor the leg construction to use `rowValues.slice(0, windowSize).filter(v => v >= value - 1).length`. This is cleaner than the lookup pattern above.

Final MatrixCell props:

```ts
interface MatrixCellProps {
  value: number;
  matchIndex: number;
  /** Used to construct the per-cell leg id and compute hits-at-threshold. */
  rowValues: number[];
  windowSize: WindowSize;
  fixtureId: string;
  teamCode: string;
  statName: string;
  teamName: string;
}
```

### SafePill consumption (sticky-left)

Use SafePill's existing `leg` prop so the row-level threshold add behaves consistently with Strongest angles in Overview. Tapping the SafePill toggles the floor leg.

**Note:** SafePill's whole-pill press handler conflicts with making the SafePill *inside* a row Pressable's tap target. In 4B, the sticky-left part is **not** a Pressable — only the SafePill within it is, via its `leg` prop. The row itself does nothing. Different from Strongest angles, where the whole row was the Pressable. Make sure no parent Pressable wraps the SafePill in 4B.

## 9. Fixture header row + scoreline row

These are the two horizontal rows at the top of each side's scrolling region, before the stat rows begin.

### FixtureHeaderRow

`flexDirection: 'row'`, width `windowSize * (CELL_WIDTH + CELL_GAP) - CELL_GAP`. Each column is `width: CELL_WIDTH`, stacks (in flex column):

- Date (e.g. "09 May") — mono 9pt hint
- Opponent kit mini (`Kit variant="mini" team={...}`)
- Opponent code (e.g. "BRE") — mono 9pt muted

Height: `ROW_HEIGHT_FIXTURE_HEADER` (42px).

### ScorelineRow

`flexDirection: 'row'`, same width. Each column is a 26×~22 score pill showing e.g. `3-0` and a small W/D/L indicator. Use `ScorePill` from `@count/ui` if it fits; otherwise inline a compact version.

Source's `<ScorePill result={...} wdl={...} />` exists in the codebase. Check the existing `ScorePill` API — if it accepts `wdl` plus a result string, use it directly. The display should be small: ~26×22, scoreline number row, W/D/L colour-coded.

If `ScorePill` doesn't fit at 26×22 (probably it's larger — original was for the overview matches), render an inline compact version:

```tsx
<View style={{
  width: CELL_WIDTH,
  height: 22,
  borderRadius: 4,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: wdlBackgroundColors[f.wdl],
  borderWidth: 1,
  borderColor: wdlBorderColors[f.wdl],
}}>
  <Text style={{
    fontFamily: typography.fontMono,
    fontSize: 9,
    fontWeight: typography.weight.medium,
    color: wdlTextColors[f.wdl],
  }}>{f.result}</Text>
</View>
```

W = teal tint, D = neutral, L = red tint. (Same colours as `FormPill` — extract to constants if not already exported from tokens.)

Height: `ROW_HEIGHT_SCORE` (28).

## 10. Verification

After everything:

- `pnpm typecheck` passes across all packages.
- `npx expo export --platform ios` bundles cleanly.
- On-device check via Expo Go:
  - Tab to "Team stats" on MCI/CRY → page renders. H2 + descriptive body visible. Window selector says "Last 5 matches".
  - Filter pill renders with count "2" badge. Tap does nothing.
  - xG block visible. MCI shows xG 2.4, xGoT 1.6. CRY shows xG 0.9, xGoT 0.5.
  - Matrix card visible. Home team head row shows "Man City · 5 OF 38". Fixture columns show BRE, EVE, SOU, BUR, ARS. Scoreline pills show 3-0 (W teal), 3-3 (D neutral), 2-1 (W teal), 0-1 (L red), 2-1 (W teal).
  - ATTACK category label visible in teal. GOALS row: SafePill "3+ · 5/5" teal in sticky left; cells [3, 3, 2, 1, 2] amber-filled. SHOTS OT row: SafePill "4+ · 5/5" teal in sticky left; cells [10, 4, 6, 9, 5] amber-filled.
  - SET PIECES → CORNERS row: SafePill "8+ · 5/5"; cells [10, 9, 10, 11, 8].
  - DISCIPLINE → FOULS row: SafePill present; cells [8, 5, 9, 12, 5].
  - Away team appears below the home team, 22px gap, with CRY data.
  - Footer below the matrix card shows "Last 5 matches" + "Show all stats" toggle.
  - Tap a cell — value 3 in SHOTS OT row, for example — the cell border turns teal, Note Pad bar count increments. Tap again — back to amber, count decrements.
  - Tap the SafePill on the GOALS row — Note Pad count increments, SafePill turns into its in-pad state (uses SafePill's existing visual for `inPad`).
  - Tap window selector → dropdown lists Last 5 / Last 10 / Last 20 / Season. Select "Last 10" — fixture columns expand to 10, cells extend, SafePill displays update (now shows "10/10" or the new floor for L10), scroll hint footer text changes.
  - Scroll the home team's fixtures row horizontally — away team's row scrolls in lock step.
  - Tap "Show all stats" → 4 extra stat rows appear: SET PIECES.THROW INS, DISCIPLINE.OFFSIDES, DEFENCE.TACKLES, GOALKEEPING.SAVES. Each addable. Button label flips to "Show less".
  - Tap "Show less" → extra rows disappear, default rows remain.
  - Navigate to a synthesised fixture (e.g. Liv-Ars) → matrix renders with synthesised data, no crashes, plausible values.

### Visual deltas to flag

- The matrix-cell underline-bar treatment from source is **gone**. Cells are filled boxes only. Document this in the summary as an intentional departure.
- The xG block is **new** to 4B with no source reference. Document the visual choices made.
- Sticky-column shadow/edge-fade on horizontal scroll — not added. If reads poorly during review, Phase 12 polish.

### Anti-checks

- No new `packages/ui` components added. Everything new lives in `apps/mobile/src/components/fixture/`.
- No primitives extended. SafePill / Kit / GlassPanel / GlassSelect / Icon / ScorePill used as-is.
- The `FixtureListItem` type stays unchanged.
- The `FIXTURES_BY_ID` lookup stays unchanged.
- No `console.log`, no emoji, no font weight 600+. All hairlines either `StyleSheet.hairlineWidth` (for true 0.5px) or explicit `borderWidth: 1` at strong alpha (for visible separators per gotcha #11).
- Every `Pressable` follows gotcha #10: single static `ViewStyle` on the Pressable; layout and tone branches on the children-as-function inner View.
- xG values use `.toFixed(1)` for display — never raw decimals like "2.4000000001".
- All numeric values rendered in `typography.fontMono`. All labels rendered in `typography.fontSans`.
- No `useState` anywhere except `TeamStatsTab` (window, showAll) and `MatrixCard` if scroll syncing needs local state.

## 11. Summary doc

Write `docs/phases/phase-4b-summary.md` covering:

1. **What was built** — file-by-file, with line counts.
2. **Decisions not explicit in the brief** — anywhere ambiguity was resolved in code. Particularly: the sticky/scroll sync implementation choice; the SideHead placement; any structural calls made about `ScorePill` reuse vs inline.
3. **Surprises in the source** — places where the source design conflicted with itself or with the brief's interaction model.
4. **TODOs left in code** — flagged for future phases.
5. **Honest visual deltas** — every divergence from source design and screenshots, with reasoning and verify-on-device note.
6. **Verification** — typecheck + bundle + on-device observations.

Match the Phase 1C / 2B / 4A summary doc style.

## What to do if you get stuck

- **Scroll syncing infinite-loops on Android (or iOS).** Gate the cross-call with a tiny `isProgrammaticScroll` boolean ref. Set true before calling `scrollTo` on the sibling, reset to false on next tick.
- **Sticky-column height doesn't match scroll-region height row-for-row.** This means a row's left and right parts disagree on height. Re-check the constants, force every row to its declared height with an explicit `style={{ height: ROW_HEIGHT_X }}` on both sides. Don't let content drive height.
- **`deriveThresholdForWindow` returns "—" for a row in the default window.** Means the synthesised data produced a zero in the first 5 fixtures. That's plausible mock behaviour; the SafePill should render in `muted` tier and be non-addable. Don't try to hide the row.
- **`Show all stats` makes the page taller than expected.** Expected behaviour — extra rows extend the matrix vertically. Don't try to scroll-inside-the-card; the outer ScrollView in the route file handles vertical scroll.
- **A primitive needs a new prop and you're tempted to extend it.** Stop. Surface in the summary doc.