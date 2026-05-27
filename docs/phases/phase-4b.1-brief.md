# Phase 4B.1 — Team stats refinement pass

## What this brief is

A refinement pass against Phase 4B. The matrix scaffolding, scroll-sync, type model, mock synthesiser, and tab routing all stay. The fixes here are visual and structural:

1. **Resize the matrix grid** — 96 sticky column / 44 cells / 4 gap. Eliminates cell clipping and aligns to the source design's column proportions.
2. **Restructure the sticky-left column** — vertical stack of `[stat name above, SafePill below]`, with a "CONSISTENCY" header at the top of the sticky region. Hairline dividers between adjacent stat rows within a category (not between categories — the category label is the separator there).
3. **Add `size="large"` variant to `SafePill`** — bigger pill with optional glow on teal tier. Strongest angles stays on the existing default size.
4. **Add optional `label` prop to `GlassSelect`** — leading uppercase mono micro-label, knocked back in colour, with a separator dot. Used by the window selector: "WINDOW · Last 5 matches".
5. **Redesign `XGContextBlock`** — compact, narrower panels. Per panel: `[kit] [Team name big]` line, then `XG: 2.4  |  XGOT: 1.6` on one line with consistent typography sizing and an amber glow behind the values.
6. **Drop the H/A suffix from scoreline cells.** Move the home/away indicator into the fixture header as `BRE (H)` / `EVE (A)` next to the opponent code.

Everything else from Phase 4B stays as built. No retreat from the architectural decisions; just visual + typographic correction.

## Out of scope

- Filter pill behaviour. Still placeholder.
- The Count tab and Player stats tab.
- Player matrix migrations (these would benefit from the same SafePill "large" variant but only when Phase 4C lands).
- Animation between window changes or show-all toggles.
- Sticky-column shadow on horizontal scroll — defer to Phase 12.

## Vocabulary

- Tab label stays **Team stats** (sentence case, decision 11).
- New header inside the matrix sticky column: **CONSISTENCY** (uppercase, mono, hint colour, 0.4 letter-spacing). Replaces the source design's "SAFE @" — "safe" was the wrong word per the decision-7 vocabulary rule (it implies guaranteed). "CONSISTENCY" is non-loaded and accurate: the pill shows how consistently the team has hit the threshold across the window.
- Drop "SAFE" from any other usage in this tab.

Allowed vocabulary reinforced: trend, alignment, consistency, hit rate, floor, threshold.

## Files touched

### Extended primitives (`packages/ui`)

- `packages/ui/src/components/SafePill.tsx` — add `size?: 'small' | 'large'` prop (default `'small'`). Both sizes already exist conceptually; this brief codifies the large variant and adds a teal-tier glow when `size === 'large'`. Small variant is byte-identical to current behaviour — Strongest angles and any other consumer is untouched.
- `packages/ui/src/components/GlassSelect.tsx` — add optional `label?: string` prop. When present, renders a leading uppercase mono micro-label + amber dot separator inside the trigger pill. The current `filteringActive` boolean dot prop is preserved (different behaviour — that's the green status dot for active filters; `label` adds the static separator dot between label and value).

### Modified (in `apps/mobile/src/components/fixture/`)

- `matrix-constants.ts` — update `STICKY_COL_WIDTH`, `CELL_WIDTH`, `CELL_GAP`, and likely bump some row heights to fit the stacked sticky layout.
- `TeamStatsTab.tsx` — pass `label="WINDOW"` to the GlassSelect. No other change.
- `MatrixSide.tsx` / `MatrixRow.tsx` (split as built) — restructure sticky-left content to be stacked `[stat name, SafePill]` instead of side-by-side. Add the "CONSISTENCY" header label above the stat rows in the sticky column. Add hairline dividers within-category-between-stats. SafePill now passed `size="large"`.
- `MatrixRow.tsx` (or wherever the fixture header column is rendered) — drop scoreline H/A suffix. Add `(H)` / `(A)` to the opponent code in `FixtureHeaderRow`.
- `MatrixCell.tsx` (or wherever the scoreline pills render) — strip the H/A suffix from the displayed scoreline. The `oppHome` field stays in the mock data — display only changes.
- `XGContextBlock.tsx` — full layout rewrite. Compact horizontal shape with kit + team name + XG/XGOT line + amber glow on values.

### Untouched

- Synthesiser, type model, mock data shape — no changes.
- Tab routing, route file.
- Scroll-sync logic in MatrixCard and MatrixSide.
- Show-all toggle behaviour.
- The Overview tab, Strongest angles, Build-a-builder panel — Phase 4A surfaces remain untouched.

## 1. Matrix grid dimensions

Update `apps/mobile/src/components/fixture/matrix-constants.ts`:

```ts
// Refined per Phase 4B.1 — proportional to source design's column ratios.
// Source had 56px sticky + 5 fr cells inside a 374px inner card width
// (~15% sticky, ~15.5% per cell). Scaled to iPhone 15 Pro's 333px inner
// width with the new stacked sticky-left layout that needs more room for
// stat name + large SafePill stacked vertically:
//   sticky = 96 (~29% of 333)
//   cell   = 44 (~13% of 333)
//   gap    =  4
//   5 cells visible in default Last 5 window: 96 + 4 + 5×44 + 4×4 = 336 → fits 333 with 3px room
export const STICKY_COL_WIDTH = 96;
export const CELL_WIDTH = 44;
export const CELL_GAP = 4;
```

The 3px overrun on a 333 inner width is acceptable — the matrix-card's inner padding is 14 not 16, so the actual inner width is closer to 337 (and on narrower devices like iPhone SE it would compress slightly via the ScrollView's natural overflow). Verify on device; if the right-most cell clips at the card edge, drop `CELL_WIDTH` to 42.

### Row heights

The sticky-left rows now stack `[stat name + SafePill]` vertically. Each stat row gets taller. Update:

```ts
// Sticky-left stat row: stat name 12px + 4px gap + SafePill large (24px tall) + 8px breathing = 48
export const ROW_HEIGHT_STAT = 48;  // was 40
// All other row heights unchanged
export const ROW_HEIGHT_HEAD = 36;
export const ROW_HEIGHT_CATEGORY = 28;
export const ROW_HEIGHT_FIXTURE_HEADER = 42;
export const ROW_HEIGHT_SCORE = 28;
export const ROW_GAP_SIDES = 22;
```

**Critical:** the right-region cell rows must also use `ROW_HEIGHT_STAT = 48` so home and away align row-for-row. The cell itself is still 26×26 (or whatever it currently is — check), centred vertically within the 48px row. Don't try to grow the cell to fill the row height; the row's extra vertical space is for the SafePill in the sticky-left and the cell stays its existing size, vertically centred.

The cell vertical size question: currently `MatrixCell` is sized to 26×26 (the visual treatment ported from PlayerValueCell). Keep that. The row container is 48 tall; the cell sits centred. Easier visual alignment than enlarging the cell.

Actually — reading the brief in image 2 again — the cells in the design visual appear closer to **square at ~36×36**, with proportional internal text. Let me amend:

**Cell visual size:** `width: CELL_WIDTH (44) - 8 horizontal padding = 36, height: 36`. The cell is now 36×36, centred in a 44px-wide × 48px-tall slot.

Update `MatrixCell.tsx` to declare `const CELL_INNER = 36;` and render the box at that size with 11px text → 13px text. The mono digit "10" needs to fit comfortably in 36px wide; 11pt mono is ~14px wide for two digits — fine at 36px.

```ts
// Cell visual treatment — applied to the 36×36 box centred within each
// CELL_WIDTH (44) × ROW_HEIGHT_STAT (48) slot.
const CELL_BOX_SIZE = 36;
```

This is a brief-level dimension; it lives at the top of `MatrixCell.tsx`, not in `matrix-constants.ts` (it's not a layout-grid constant, it's a cell-internal one).

## 2. Sticky-left column restructure

Currently `MatrixRow`'s sticky-left renders something like:

```tsx
<View style={[stickyStyle, { flexDirection: 'row', alignItems: 'center' }]}>
  <Text>{statName}</Text>
  <SafePill ... />
</View>
```

Restructure to:

```tsx
<View style={stickyContainerStyle}>
  <Text style={statNameStyle}>{statName}</Text>
  <View style={{ marginTop: 4 }}>
    <SafePill size="large" leg={leg} ... />
  </View>
</View>
```

Where:

```ts
const stickyContainerStyle: ViewStyle = {
  width: STICKY_COL_WIDTH,
  height: ROW_HEIGHT_STAT,
  paddingHorizontal: 8,
  paddingVertical: 6,
  justifyContent: 'center',
  // Hairline divider handled separately — see below.
};

const statNameStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontSans,    // sans, not mono (per decision)
  fontSize: 10,
  fontWeight: typography.weight.medium,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};
```

### CONSISTENCY header row

Above the first stat row in each side, add a small header row that sits in the sticky-left region only, aligned with the FixtureHeaderRow + ScorelineRow combined height (so the right region's fixture/scoreline shows opposite the empty space of the sticky column, and CONSISTENCY appears flush to the left).

Looking at the existing layout: the sticky-left for the FIXTURE_HEADER + SCORE rows is rendered as two blank spacer Views (per Phase 4B brief section 7 implementation). Replace those two spacers with **one combined sticky-left header** that spans `ROW_HEIGHT_FIXTURE_HEADER + ROW_HEIGHT_SCORE = 70px` and contains the "CONSISTENCY" label.

```tsx
<View style={consistencyHeaderStyle}>
  <Text style={consistencyHeaderTextStyle}>CONSISTENCY</Text>
</View>
```

```ts
const consistencyHeaderStyle: ViewStyle = {
  width: STICKY_COL_WIDTH,
  height: ROW_HEIGHT_FIXTURE_HEADER + ROW_HEIGHT_SCORE,
  paddingHorizontal: 8,
  justifyContent: 'flex-end',  // align label to bottom of the combined header space
  paddingBottom: 8,
};

const consistencyHeaderTextStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontSans,
  fontSize: 10,
  fontWeight: typography.weight.medium,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};
```

The `justifyContent: 'flex-end'` + `paddingBottom: 8` puts the label at the bottom of the combined 70px space, vertically aligned with the bottom of the scoreline pills row on the right. Reads as a column header for the SafePill column rather than floating in the middle.

### Within-category dividers

For each category group rendered in `MatrixSide`, when the category has more than one stat, render a hairline divider between adjacent stat rows. **Only within a category.** The category-to-category transition has its own label row that visually separates groups.

Per gotcha #11, use `borderTopWidth: 1` at `'rgba(255,255,255,0.10)'`, not `StyleSheet.hairlineWidth` at default alpha (which vanishes).

Where to render the divider: at the **top** of each non-first stat row within a category. Both the sticky-left part and the right-region cells row get the same `borderTopWidth: 1` so the line appears continuous across the matrix card.

```tsx
{categoryStats.map((stat, statIdx) => (
  <MatrixRow
    key={stat.name}
    stat={stat}
    isFirstInCategory={statIdx === 0}
    // ...
  />
))}
```

In `MatrixRow`, branch the outer style:

```ts
const rowContainerStyle: ViewStyle = {
  flexDirection: 'row',
  height: ROW_HEIGHT_STAT,
};

const rowContainerWithDividerStyle: ViewStyle = {
  ...rowContainerStyle,
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.08)',  // softer than the show-all toggle's footer divider
};
```

Then `<View style={isFirstInCategory ? rowContainerStyle : rowContainerWithDividerStyle}>`.

The divider runs the full width of the row, so it visually traverses both the sticky-left and the right-region cells. This is fine — the divider is a within-card hairline, not a region boundary. (If on review the divider crossing the sticky/scroll boundary reads awkwardly, the fallback is to put the divider only on the sticky-left and only on the cells-row independently. But the unified-line approach is cleaner.)

### Important: divider only between stats *within* a category

Example walkthrough:

- ATTACK label row
- GOALS row (no divider above — first in category)
- SHOTS OT row (divider above — second in category)
- SET PIECES label row (no divider — category label is the separator)
- CORNERS row (no divider above — first in category)
- THROW INS row (only present when showAll) — if present, divider above (second in category)
- DISCIPLINE label row (no divider — category label is the separator)
- FOULS row (no divider above — first in category)
- OFFSIDES row (only present when showAll) — divider above (second in category)
- DEFENCE label (showAll only)
- TACKLES row (first in DEFENCE)
- GOALKEEPING label (showAll only)
- SAVES row (first in GOALKEEPING)

The MatrixSide consumer can compute `isFirstInCategory` by tracking `categoryStatIndex` in its iteration.

## 3. SafePill — add `size="large"` variant

**The brief here is explicit because SafePill is a primitive and primitive changes need care.** Add the prop without removing or changing any existing behaviour.

### Current `SafePill` API (do not change)

```ts
export interface SafePillProps {
  threshold: string;
  hits: number;
  total?: number;  // default 5
  tier: 'teal' | 'amber' | 'muted';
  leg?: Leg;
  // ... addable opacity flow if it exists
}
```

### Add

```ts
export interface SafePillProps {
  // ... existing
  /** Visual size. Default 'small' preserves all existing call-site behaviour. */
  size?: 'small' | 'large';
}
```

### Behaviour

**`size='small'` (default — current behaviour):**
- Outer dimensions: matches current SafePill (roughly 32×30 with current padding)
- Threshold text 11pt medium, hits text 9pt regular
- No glow
- 100% byte-identical to current rendering. Verify by diffing the small variant against current output during typecheck.

**`size='large'` (new for matrix sticky-left):**
- Outer dimensions: ~52×34 (paddingHorizontal: 10, paddingVertical: 5, content sized accordingly)
- Threshold text 14pt medium mono, hits text 11pt regular mono — bigger, more prominent
- **Glow:** when `tier === 'teal'`, apply an iOS `shadowColor: colors.teal.bright`, `shadowOpacity: 0.30`, `shadowRadius: 6`, `shadowOffset: {0,0}`. Android: skip the glow (gotcha — shadow tint not supported). The pill itself reads at strong teal in both cases; the iOS glow is the bonus.
- When `tier === 'amber'`, apply the same shadow shape but `shadowColor: colors.amber.bright`, opacity 0.25.
- When `tier === 'muted'`, no glow.

```tsx
const pillContainerStyleLarge: ViewStyle = {
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  ...(Platform.OS === 'ios' && tier === 'teal' ? {
    shadowColor: colors.teal.bright,
    shadowOpacity: 0.30,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  } : Platform.OS === 'ios' && tier === 'amber' ? {
    shadowColor: colors.amber.bright,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  } : {}),
};
```

(The above is illustrative — the actual code would pre-compute the style per tier rather than inlining a ternary, but the shape is correct.)

### What this means for the Pressable style

SafePill is already a Pressable when `leg` is provided. Per gotcha #10 + 4A.1 lessons, the Pressable's `style` is a single static merged object. The new shadow props live on that merged object. Children-as-function inner View pattern stays the same.

**Do not** add the shadow to the inner View. Shadows in RN need to be on the outermost layout-paint surface to bleed outside the rounded corners correctly. The Pressable container is that surface.

### Other consumers of SafePill

Audit: every existing call site receives `size === 'small'` (the default). Search the codebase:

```bash
grep -rn "SafePill" packages/ui/src apps/mobile/src apps/mobile/app
```

Expected matches:
- `StrongestAnglesPanel.tsx` — small (default). Unchanged.
- `MatrixRow.tsx` (or wherever the sticky-left renders the SafePill) — change call site to pass `size="large"`.
- Possibly used in other Phase 4A surfaces — they all stay default.

## 4. GlassSelect — add `label` prop

### Current GlassSelect API (do not change)

```ts
export interface GlassSelectProps {
  value: string;
  options: GlassSelectOption[];
  onChange: (id: string) => void;
  filteringActive?: boolean;  // shows amber leading dot
}
```

### Add

```ts
export interface GlassSelectProps {
  // ... existing
  /** Optional leading uppercase micro-label, e.g. "WINDOW". Rendered before
   *  the current value with a dot separator. Knocked-back text colour. */
  label?: string;
}
```

### Visual placement

When `label` is set, the trigger pill renders, left to right:

```
[label uppercase mono, hint color] [dot separator] [current value]
[chevron-down right-aligned]
```

The `filteringActive` dot is independent and renders if true — it's the amber status dot at the very left edge. If both `label` and `filteringActive` are set, the order is `[amber-dot] [label] [separator-dot] [value] [...] [chevron]`.

For the window selector in 4B.1, only `label="WINDOW"` is passed; `filteringActive` is not set (the window selector isn't a filter, just a window selection). So the rendered order is:

```
WINDOW · Last 5 matches ▾
```

### Style

```ts
const labelStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const labelSeparatorStyle: ViewStyle = {
  width: 3,
  height: 3,
  borderRadius: 1.5,
  backgroundColor: 'rgba(255,255,255,0.20)',
  marginHorizontal: 6,
};
```

Render order in JSX inside the trigger Pressable's inner View:

```tsx
{filteringActive ? <View style={amberDotStyle} /> : null}
{label ? <Text style={labelStyle}>{label}</Text> : null}
{label ? <View style={labelSeparatorStyle} /> : null}
<Text style={triggerLabelStyle} numberOfLines={1}>{label}</Text>
{/* ... etc */}
```

(Actually, the `triggerLabelStyle` renders the *value*, not the label — be careful with naming. Existing `triggerLabelStyle` is fine for the value; the new `labelStyle` const above is for the prefix label. Don't rename existing constants.)

## 5. XGContextBlock redesign

Replace the entire `XGContextBlock.tsx` implementation. Same exports, same props interface, different rendering.

### New layout per panel

```
┌─────────────────────────────┐
│ [kit] Man City              │
│ XG: 2.4 | XGOT: 1.6         │
└─────────────────────────────┘
```

- Line 1: `[Kit variant="mini"]` + `[Team name]` — name at fontSize 14 medium, kit at 16px. Tight gap.
- Line 2: All-mono numeric line. `XG`, `:`, `2.4`, `|`, `XGOT`, `:`, `1.6` — all same size, ~12pt mono. Labels (XG, XGOT) at hint colour; values (2.4, 1.6) at amber-bright with glow; separators (`:`, `|`) at hint colour faded.
- Compact: total panel height ~64px (was significantly more with the previous stacked layout).

### Implementation

```tsx
import { Platform, Text, View, type ViewStyle } from 'react-native';
import type { FixtureXG } from '@count/types';
import { GlassPanel, Kit } from '@count/ui';
import { colors, typography } from '@count/tokens';
import { getTeam } from '../../mock/teams';

export interface XGContextBlockProps {
  xg: FixtureXG;
  homeCode: string;
  awayCode: string;
}

export function XGContextBlock({ xg, homeCode, awayCode }: XGContextBlockProps) {
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
  const team = getTeam(code);
  return (
    <View>
      <View style={nameRowStyle}>
        {team ? <Kit variant="mini" team={team} /> : null}
        <Text style={teamNameStyle} numberOfLines={1}>{team?.name ?? code}</Text>
      </View>
      <View style={metricsRowStyle}>
        <Text style={metricLabelStyle}>XG</Text>
        <Text style={metricSepStyle}>:</Text>
        <Text style={metricValueStyle}>{data.xg.toFixed(1)}</Text>
        <Text style={metricDividerStyle}>|</Text>
        <Text style={metricLabelStyle}>XGOT</Text>
        <Text style={metricSepStyle}>:</Text>
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

const nameRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginBottom: 8,
};

const teamNameStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 14,
  fontWeight: typography.weight.medium,
};

const metricsRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
};

// All metrics-row text shares the same fontSize for the consistent typography
// requirement. Only colour differs.
const METRIC_FONT_SIZE = 12;

const metricLabelStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: METRIC_FONT_SIZE,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
};

const metricSepStyle = {
  color: colors.text.faint,
  fontFamily: typography.fontMono,
  fontSize: METRIC_FONT_SIZE,
  fontWeight: typography.weight.regular,
};

const metricValueStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontMono,
  fontSize: METRIC_FONT_SIZE,
  fontWeight: typography.weight.medium,
  // iOS amber glow — same recipe as kickoff time on Overview hero
  ...(Platform.OS === 'ios' ? {
    textShadowColor: colors.amber.bright,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  } : {}),
};

const metricDividerStyle = {
  color: 'rgba(255,255,255,0.15)',
  fontFamily: typography.fontMono,
  fontSize: METRIC_FONT_SIZE,
  fontWeight: typography.weight.regular,
  marginHorizontal: 4,
};
```

### Note on the amber glow

I used `textShadowColor`/`textShadowOffset`/`textShadowRadius` here on the Text style, which is a different RN mechanism than the View shadow we used on kickoff time. **Text shadows in RN are reliable on iOS** but ignored on Android. The kickoff time on Overview used a wrapping View with shadow props for cross-platform consistency.

For 4B.1, the glow is decorative not load-bearing. **Use `textShadow` on iOS for simplicity**; Android falls back to flat amber. If on device review the iOS text shadow doesn't read (it can be subtle on small text), the fallback is to wrap each value Text in a `<View style={iosGlowStyle}><Text>...</Text></View>` — that's the kickoff-time pattern. Try `textShadow` first; document if it doesn't work.

## 6. Drop H/A from scoreline; add to fixture header

### Scoreline cell (in `MatrixCell.tsx` or wherever the scoreline pills render)

Currently the cell displays `${result}${oppHome ? 'H' : 'A'}` — e.g. "3-0H". Change to just `${result}` — e.g. "3-0".

Search the codebase for `oppHome` and `wdl` to locate the rendering code; the change is removing the suffix concatenation. The `oppHome` field stays in the mock data — display-only change.

### Fixture header column (in `MatrixRow.tsx` or wherever `FixtureHeaderRow` renders)

Currently shows:

```
09 May
[kit-mini]
BRE
```

Change to:

```
09 May
[kit-mini]
BRE (H)
```

Where the parenthetical is `${oppHome ? '(H)' : '(A)'}`.

```tsx
<Text style={fixtureOppCodeStyle}>{fixture.opp} ({fixture.oppHome ? 'H' : 'A'})</Text>
```

The `BRE (H)` text at fontSize 9 mono fits in CELL_WIDTH (44px) at the new dimensions. Verify: 7 chars at ~5px each = ~35px, fits comfortably.

(Note: the brief here interprets `oppHome` as "was the opponent at home" — i.e. our team was away. Reading the source data verbatim: `oppHome: true` on the MCI row for the BRE fixture, scoreline `3-0`. Source CSS shows this as "3-0H". The "H" suffix in source meant "home for our team" not "home for the opponent". Re-reading: the `oppHome` field name is the **opponent's home** flag — true if the opponent was at home, meaning our team was away. So `BRE (H)` reading from a MCI fixture where `oppHome: true` is wrong — it should be `BRE (A)` because our team was away.

Re-check the source `data.js` line 170: `{ date: '09 May', opp: 'BRE', oppHome: true, result: '3-0', wdl: 'W' }`. The result is 3-0 W for MCI vs BRE. Both could be home or away. The result formula `${result}${oppHome ? 'H' : 'A'}` would render "3-0H" — implying the source meant `oppHome` as "the home perspective is the opponent's" then chose "H" for an opponent-home fixture (our team away). That's confusing in source. **For 4B.1: interpret `oppHome: true` as "the OPPONENT was at home"**, and render the suffix as `(A)` (our team was away). Negate the boolean for the suffix.)

So the correct fixture header parenthetical line is:

```tsx
<Text style={fixtureOppCodeStyle}>
  {fixture.opp} ({fixture.oppHome ? 'A' : 'H'})
</Text>
```

`oppHome: true` → opponent at home → our team away → `(A)`.
`oppHome: false` → opponent away → our team at home → `(H)`.

This may be wrong if Claude Code reads the existing scoreline-rendering code and finds that the H/A logic was already implemented one way or the other; resolve to whichever makes the data internally consistent. The mock's MCI/CRY first-5 verbatim values shouldn't change semantics across this fix.

## 7. TeamStatsTab — pass label to GlassSelect

One-line change in `TeamStatsTab.tsx`:

```tsx
<GlassSelect
  value={String(windowSize)}
  options={WINDOW_OPTIONS}
  onChange={(id) => setWindowSize(Number(id) as WindowSize)}
  label="WINDOW"   // NEW
/>
```

That's it.

## 8. Verification

After everything:

- `pnpm typecheck` passes across all packages.
- `npx expo export --platform ios` bundles cleanly.
- On-device check via Expo Go:
  - Window selector reads `WINDOW · Last 5 matches ▾`. Mono "WINDOW" label, hint colour, dot separator, value to the right.
  - xG block panels are noticeably narrower in height than before. Each panel: kit + team name on line 1, `XG : 2.4 | XGOT : 1.6` on line 2. All metric-line text at the same size, values in amber with subtle glow on iOS.
  - Matrix card opens. CONSISTENCY label appears at the bottom of the fixture-header area in the sticky column, vertically aligned with the bottom of the scoreline pills row.
  - First stat row in ATTACK is GOALS — stat name "GOALS" uppercase 10pt sans hint colour above a large SafePill `1+ / 5/5` teal with teal glow on iOS.
  - Second stat row (SHOTS OT) has a hairline divider above it spanning the row.
  - Below SET PIECES label, CORNERS row has no divider above it (first in category).
  - Cells are bigger than before (~36×36 each); no clipping on scoreline cells. Scoreline cells now read just "3-0" / "0-1" — no H/A suffix.
  - Fixture header columns read "09 May / [kit] / BRE (A)" and similar — opp code with home/away in parentheses.
  - Horizontal scroll still works. Home + away sides scroll in lock step.
  - Tap a cell — value 3 in SHOTS OT row — cell border turns teal, Note Pad bar count increments.
  - Tap the SafePill in GOALS row — Note Pad count increments, SafePill enters its in-pad state.
  - Switch window to Last 10 — fixture columns expand, cells render in extended scroll region, SafePill rebases to the new floor.
  - Tap "Show all stats" — extra stat rows appear under SET PIECES (THROW INS, divider above) and DISCIPLINE (OFFSIDES, divider above). New categories DEFENCE (TACKLES) and GOALKEEPING (SAVES) appear at the bottom.

### Visual deltas

- iOS amber text-shadow glow on XG values — verify it actually reads. If too subtle, switch to wrapping-View pattern from kickoff time.
- SafePill `size="large"` glow on iOS — verify it bleeds outside the rounded corners correctly. If clipped, the outer wrapping is wrong.
- Within-category dividers crossing the sticky/scroll boundary — verify the hairline reads as one continuous line across the matrix card.

### Anti-checks

- No regression in Strongest angles panel (Overview tab). SafePill default `size='small'` byte-identical.
- No regression in window selector functionality. Dropdown still opens / selects / fires onChange.
- Filter pill rendering and non-functional tap behaviour unchanged.
- Note Pad bar persists at bottom across the screen (decision from Phase 4A.2).
- `oppHome` field still present in mock data; only display semantics changed.
- No new `useState`, no new context, no new primitives beyond the two existing extensions.

## 9. Summary doc

Write `docs/phases/phase-4b.1-summary.md`:

1. Which dimensions landed in the matrix grid (sticky / cell / gap / cell-box).
2. The shape of the sticky-left column restructure.
3. Confirmation that SafePill `size='small'` is byte-identical to current behaviour.
4. The `oppHome` interpretation resolved (which way the H/A suffix maps).
5. iOS-only glow patterns and what falls back on Android.
6. Verification — typecheck + bundle + on-device.

Match the style of phase-4a.1 and phase-4a.2 summary docs.

## What NOT to do

- Do not change `MatrixCard`'s scroll-sync logic. It works; don't touch.
- Do not change the type model, synthesiser, or mock data shape. The `oppHome` field stays as-is in data.
- Do not add new state to `TeamStatsTab` or `MatrixCard`.
- Do not change the Overview tab, Strongest angles, or Build-a-builder panel.
- Do not change `BottomNav` / `NotePadBar` / Phase 4A.2's root layout.
- Do not "while we're here" refactor any other Pressable or component.
- Do not change the show-all toggle's visible-stat-key list.
- Do not modify the tab routing in the route file.