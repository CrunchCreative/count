# Phase 2B — Brief

**Goal:** Replace the design-primitives demo at `apps/mobile/app/(tabs)/index.tsx` with the real Dashboard screen, built end-to-end against typed mock data. Every section of the source `dashboard.jsx` ships — branding header, hero carousel, greeting, today's fixtures (horizontal scroll), featured match panel (minus tug-of-war), top research, pick-up-where-you-left-off, scan-across-fixtures. Tug-of-war chart is deferred to Phase 3 (fixture detail); the featured match renders a placeholder slot where the chart goes.

This phase produces the home screen the rest of the app navigates from. After this lands, the four other tabs are still stubs but the Home tab is real.

---

## Read these first

In order:

1. `docs/PROJECT-STATE.md` — current state, especially "Known gotchas" section. The Pressable-style-as-function bug and the typed-routes regen script apply to this phase too.
2. `docs/DESIGN.md` — non-negotiables.
3. `docs/phases/phase-2a-summary.md` — what shipped in 2A, decisions taken, conventions established.
4. `docs/design-source/the-count-v2/project/screens/dashboard.jsx` — the JSX to port. This brief mirrors its structure; refer to it for any detail not pinned here.
5. `docs/design-source/the-count-v2/project/styles.css` — production stylesheet. Specifically:
   - `.fix-card` (Today's row card)
   - `.h-scroll` (horizontal scroll container)
   - `.dots` (carousel pagination)
   - `.fade-up` keyframe
   - `.tc-h1`, `.tc-meta`, `.tc-body`, `.tc-cap`, `.tc-micro` (typography classes — translate to token-driven styles)
   - `.icon-btn` (header action buttons)
   - Existing classes used by the screen: `.glass`, `.glass.elev`, `.glass.hero`, `.section-head`, `.angle-row`, `.tap-row`
6. `docs/design-source/the-count-v2/project/data.js` — mock data shapes for `CAROUSEL`, `TODAY`, `TOP_RESEARCH`, `FIXTURE_MCI_CRY`. The `TEAMS` registry has already been ported to `apps/mobile/src/mock/teams.ts` in Phase 2A — re-use it.

---

## What to build

### 0. Mock data extension

**Location:** `apps/mobile/src/mock/`.

Add typed mock data files. **All ports preserve the source's data byte-for-byte for the fields used by Dashboard.** Defer fields that only Phase 3+ screens consume.

- `apps/mobile/src/mock/carousel.ts` — `CAROUSEL` array of 3 slides. Type lives in `packages/types/src/carousel.ts`.
- `apps/mobile/src/mock/fixtures.ts` — `TODAY` array (6 fixtures). Type `FixtureSummary` in `packages/types/src/fixture.ts` covers Today's row + Top Research shape.
- `apps/mobile/src/mock/research.ts` — `TOP_RESEARCH` array (3 items). Re-uses `FixtureSummary` extended with an `angle` field. Type `ResearchItem` in `packages/types/src/research.ts`.
- `apps/mobile/src/mock/featured.ts` — the Dashboard-visible subset of `FIXTURE_MCI_CRY`. Exports a `FixtureSummary` value with the same shape as fixtures in Today's row. **Only port the fields Dashboard's `<FeaturedMatch>` reads**: `id`, `league`, `kickoff`, `venue`, `home`, `away`, `signal`. Don't port `thresholds`, `matrix`, `players`, `referee`, `h2h` — those belong to Phase 3.

**Types layout** in `packages/types/src/`:
```ts
// fixture.ts
export type SignalTier = 'high' | 'mid' | 'low';

export interface FixtureSummary {
  id: string;
  league: string;        // 'Premier League'
  leagueShort?: string;  // 'PL' — optional, used for fixture-row labels later
  kickoff: string;       // '17:30'
  venue: string;         // 'Etihad'
  signal: number;        // 0-100
  home: string;          // team code, e.g. 'MCI'
  away: string;
  ref?: string;          // 'M. Oliver' — only present on Today's row
  refCpm?: string;       // '4.2' — only present on Today's row
  primary?: boolean;     // marks the featured fixture in Today's row for elev styling
}
```

`FixtureSummary` is the single fixture-summary shape for the Dashboard. The Featured match consumes it with `ref` / `refCpm` / `primary` unused. The mock file `featured.ts` exports a `FixtureSummary` value, not a separate type.

```ts
// research.ts
import type { FixtureSummary } from './fixture';

export interface ResearchAngle {
  threshold: string;     // '10+', 'BTTS', '5+', '—'
  hits: string;          // '5/5', '4/5'
  title: string;
  body: string;
  tier?: 'teal' | 'amber' | 'muted';  // optional override; otherwise derived from hits
}

export interface ResearchItem extends Pick<FixtureSummary, 'id' | 'league' | 'kickoff' | 'venue' | 'signal' | 'home' | 'away'> {
  angle: ResearchAngle;
}
```

```ts
// carousel.ts
export type CarouselKind = 'pattern-hit' | 'engine' | 'depth';

export interface CarouselSlide {
  kind: CarouselKind;
  label: string;         // 'PATTERN HIT'
  sub: string;           // 'YESTERDAY'
  title: string;
  body: string;
  cta: string;           // 'See the workings'
}
```

Re-export all from `packages/types/src/index.ts`.

**Mock data**: copy values byte-for-byte from `data.js`. Match strings exactly including Unicode characters (`\u2019` for the curly apostrophe in `St James' Park`).

---

### 1. Branding header

**Location:** inline in `apps/mobile/app/(tabs)/index.tsx`, not a separate component.

- Row: logo (height 50, left-aligned) + spacer + two `IconButton`s (search, bell).
- Top safe-area inset above.
- Below it: 16px margin to the hero carousel.

**Logo asset**:
- Copy `docs/design-source/the-count-v2/project/assets/count-logo.png` into `apps/mobile/assets/count-logo.png`.
- **Calculate the width before rendering**:
  1. Run `file docs/design-source/the-count-v2/project/assets/count-logo.png` from the repo root to read the PNG's natural dimensions (output looks like `PNG image data, 240 x 80, 8-bit/color RGBA, non-interlaced`).
  2. Compute the aspect ratio: `naturalWidth / naturalHeight`.
  3. Render with `<Image source={require('../../assets/count-logo.png')} style={{ height: 50, width: 50 * aspectRatio }} resizeMode="contain" />`.
  4. Add a code comment recording the actual ratio used: `// Logo natural dimensions: <W> × <H>, aspect ratio <ratio>. Rendered at height 50.`
- **Verify the 50px height against the source.** The source CSS specifies `height: 50px` but the rendered screenshots show it at a similar size to the icon buttons (32×32). If 50px reads too large on device, drop to 36–40px and document the change in the summary. The right test: does the logo balance against the two 32×32 icon buttons on the right, or does it dominate?
- Source applies a drop shadow filter — replicate with `shadowColor: 'rgba(232,181,58,0.20)'`, `shadowRadius: 14`, `shadowOffset: { width: 0, height: 0 }`, `shadowOpacity: 1` on iOS only. Skip on Android (RN `elevation` can't tint).

**IconButton primitive**:
- New component at `packages/ui/src/components/IconButton.tsx`.
- 32×32, rounded 8px, background `rgba(255,255,255,0.02)`, border 0.5px hairline `colors.border.default`, icon at 15 in `colors.text.mut`.
- Props: `icon: IconName`, `onPress: () => void`, optional `accessibilityLabel`.
- Re-export from `packages/ui/src/index.ts`.

For Phase 2B the onPress handlers can be `() => {}` — the search/notifications routing comes later.

---

### 2. HeroCarousel

**Location:** `packages/ui/src/components/HeroCarousel.tsx` and a sibling `HeroDecor.tsx`.

The signature "engine brief" surface. Auto-advancing carousel of 3 slides.

**Props**:
```ts
interface HeroCarouselProps {
  slides: CarouselSlide[];
  onPress?: (slide: CarouselSlide, index: number) => void;
}
```

**Structure**:
- `GlassPanel variant="hero"` container, padding 16, minHeight 168, overflow hidden, position relative.
- Inside, absolutely-positioned `<HeroDecor kind={slide.kind} />` on the right.
- Inside, the slide content (label badge + sub meta, title, body, CTA + arrow).
- Below the panel, the dots row.

**Behaviour**:

Auto-advance every 5000ms. Tapping a dot jumps to that index and resets the auto-advance timer (so the user isn't immediately interrupted by the next tick). Implement using the **epoch pattern** — incrementing an `epoch` value tears down and rebuilds the interval cleanly, avoiding stale-closure bugs:

```tsx
const [index, setIndex] = useState(0);
const [epoch, setEpoch] = useState(0);
const n = slides.length;

useEffect(() => {
  const id = setInterval(() => setIndex(i => (i + 1) % n), 5000);
  return () => clearInterval(id);
}, [epoch, n]);

const jumpTo = (i: number) => {
  setIndex(i);
  setEpoch(e => e + 1);  // tears down current interval, starts a fresh one from the new index
};
```

Use this exact pattern. Do not improvise an alternative (e.g. `useRef` for the interval id with a manual reset) — the epoch approach is purely declarative and avoids the closure-staleness traps that come with mixing refs and effects.

No pause-on-hover (mobile has no hover). Pause-on-press is unnecessary at this scale; skip.

**Slide content**:
- Top row: signal-badge styled label (`tier === 'teal'` for `pattern-hit`, else `'amber'`) — re-use the existing `<SignalBadge>` component is *not* a fit here because the source uses a smaller padding override. Build inline: `<View>` + `<Text>` mirroring `.signal-badge.mid` / `.high` from styles.css but with `padding: '3px 8px', fontSize: 9, letterSpacing: 0.5`. Followed by `.tc-meta` text for `slide.sub`.
- Title: fontSize 19, weight 500, letterSpacing -0.3, lineHeight 1.2.
- Body: fontSize 12, colour `text.mut`, marginTop 8, lineHeight 1.5, maxWidth `'70%'` (so it doesn't overlap the decor).
- CTA row: amber-bright text, fontSize 13, weight 500, followed by `arrow-right` icon size 14.

**Fade-up animation on slide change**:
- The source applies a `.fade-up` keyframe to the inner content `<div>` keyed by index. Translates to React Native using `Animated.View` with `opacity` + `translateY` interpolation.
- Trigger: `useEffect([index])` resets the animated value to `{ opacity: 0, translateY: 8 }` then animates to `{ opacity: 1, translateY: 0 }` over 400ms with `Easing.out(Easing.ease)`.

**Dots row**:
- `flexDirection: 'row'`, gap 4, justifyContent center, marginTop 10.
- Each dot: width 16, height 2, borderRadius 1.
- Inactive: `rgba(255,255,255,0.10)`.
- Active: `colors.text.pri` (the brand off-white).
- Pressable, gives haptic feedback on iOS only (optional, can defer — flag in summary).

---

### 3. HeroDecor

**Location:** `packages/ui/src/components/HeroDecor.tsx`.

**Props**:
```ts
interface HeroDecorProps {
  kind: CarouselKind;
}
```

The right-side decorative chart. Two layers:

1. **Concentric rings backdrop** — an absolute SVG with three concentric `<Circle>`s at radii 40, 60, 80, centred at (100, 100), stroke 0.5px, opacity 0.25. Uses `react-native-svg`. Colour depends on `kind`: `teal-bright` if `pattern-hit`, else `amber-bright`. Positioned at right -10, top -10, 130×130.

2. **Bar chart** — 10 vertical bars, right-anchored, gap 4. Heights driven by `kind`:
   - `pattern-hit`: `[12, 16, 20, 18, 24, 28, 36, 44, 52, 60]` (rising)
   - `engine`: `[22, 32, 28, 38, 30, 42, 26, 48, 34, 56]` (mixed)
   - `depth`: `[40, 38, 42, 36, 44, 40, 46, 42, 48, 44]` (steady)
   - Each bar: width 6, height as above, `LinearGradient` from `kind` colour (full) to transparent (top), opacity ramped `0.55 + (i / heights.length) * 0.45`, borderRadius 1.
   - iOS shadow: `shadowColor: tealOrAmberAlpha, shadowRadius: 6, shadowOpacity: 1`. Android skip.

Outer container: absolute right 14, top 14, bottom 14, width 130, `flexDirection: 'row'`, `alignItems: 'flex-end'`, `justifyContent: 'flex-end'`, gap 4, pointerEvents 'none', opacity 0.7.

---

### 4. Greeting block

**Location:** inline in `index.tsx`.

- `tc-meta` styled label: `'SATURDAY · 13 MAY'` — static for now.
- `<Text>` H1: `'Good morning, Ben'` — Ben is hardcoded (no auth yet). marginTop 4.
- Paragraph: "14 fixtures today. The pattern engine has surfaced [`11 strong angles` in teal] with 5/5 hit rates across your followed leagues." marginTop 6.
- The "11 strong angles" span needs to render as inline teal text — RN doesn't support nested inline Text inside Text the same way HTML does, but `<Text>` *does* support nested `<Text>` for inline styling. So:
  ```tsx
  <Text style={{ ...tcBody, color: colors.text.sec }}>
    14 fixtures today. The pattern engine has surfaced{' '}
    <Text style={{ color: colors.teal.bright, fontWeight: '500' }}>
      11 strong angles
    </Text>
    {' '}with 5/5 hit rates across your followed leagues.
  </Text>
  ```

---

### 5. Today's fixtures (FixtureCard + horizontal scroll)

**Location:** `packages/ui/src/components/FixtureCard.tsx`.

**Props**:
```ts
interface FixtureCardProps {
  fixture: FixtureSummary;
  onPress?: () => void;
  accessibilityLabel?: string;
}
```

**Visual** (from `.fix-card`):
- `GlassPanel` — variant `elev` if `fixture.primary === true`, else `standard`.
- Fixed width 140, padding `12 12 11`, borderRadius 12.
- Top row: kickoff time on left (mono, fontSize 11, amber-bright, letterSpacing 0.4) + `<SignalMini score={fixture.signal} />` on right.
- Middle stack (centred):
  - Home team code (fontSize 22, weight 500, letterSpacing -0.4, lineHeight 1.1)
  - "vs" (fontSize 10, weight 400, colour `text.hint`, mono, vertical margin 4)
  - Away team code (same as home)
- Bottom row (`justifyContent: 'space-between', alignItems: 'flex-end'`):
  - Left: mono fontSize 9 "REF · M. OLIVER" with the value beneath in fontSize 14, colour `text.pri`, weight 500.
  - Right: mono fontSize 9 "cards/m" label, alignSelf flex-end.

**Accessibility**: outer Pressable carries `accessibilityRole="button"` and `accessibilityLabel` composed from the fixture data, e.g. `${homeTeamFullName} versus ${awayTeamFullName}, ${kickoff}, signal ${signal}`. The card needs the resolved team names for the label, so accept an optional `accessibilityLabel` prop that the Dashboard computes when it renders the card (cleaner than the card reaching into `getTeam` itself).

**Horizontal scroll container**:
- New primitive: `packages/ui/src/components/HScroll.tsx`.
- Wraps `<FlatList horizontal showsHorizontalScrollIndicator={false}>`.
- Content padding: 20 left, 20 right (matches source's `padding: 0 20px; margin: 0 -20px` which extends scroll past the parent's gutter).
- Gap between items: 10. Use `ItemSeparatorComponent={() => <View style={{ width: 10 }} />}` since FlatList doesn't yet support `gap` reliably across versions.
- **Accessibility**: outer `FlatList` carries `accessibilityRole="list"`. Each card rendered inside carries its own `accessibilityRole="button"` and an `accessibilityLabel` derived from its content (e.g. "Manchester City versus Crystal Palace, 17:30, signal 92"). HScroll itself does not set roles on items — that's the card component's responsibility.
- Props:
  ```ts
  interface HScrollProps<T> {
    data: T[];
    renderItem: (item: T, index: number) => React.ReactElement;
    keyExtractor: (item: T) => string;
  }
  ```

**Hint row** beneath the scroll (from dashboard.jsx):
- Centred row: `chevron-left` icon (size 12, amber-bright) + "Swipe through 42 fixtures" text + `chevron-right` icon. Fontsize 11, colour `text.mut`. marginTop 12.

---

### 6. FeaturedMatch (minus tug-of-war)

**Location:** `packages/ui/src/components/FeaturedMatch.tsx`.

**Props**:
```ts
interface FeaturedMatchProps {
  fixture: FixtureSummary;
  homeTeam: Team;
  awayTeam: Team;
  onOpen?: () => void;
}
```

The consumer (Dashboard) resolves the teams via `getTeam(fixture.home)` and `getTeam(fixture.away)` and passes them in — same pattern as `<Kit team={...} />` established in Phase 2A.

**Visual** (from `dashboard.jsx` `FeaturedMatch`):
- `GlassPanel variant="elev"`, padding 16, position relative.

- **Meta row** (justify space-between): `tc-meta` text "PREMIER LEAGUE · 17:30 · ETIHAD" on left, `<SignalBadge score={fixture.signal} />` on right. marginBottom 12.

- **Teams row** (justify space-between, alignItems center, marginBottom 8):
  - Left: Kit shirt size 22 + team name. Gap 10.
  - Middle: "vs" in `tc-meta` (fontSize 10).
  - Right: team name + Kit shirt size 22. Gap 10.
  - **Team name text style**: fontSize 18, weight 500, letterSpacing -0.2, `numberOfLines={1}`, `ellipsizeMode="tail"`. The team-name `<Text>` must have `flexShrink: 1` so it gives ground to the Kit + "vs" rather than overflowing. **Truncation rule**: prefer the truncated full name over a short code abbreviation. "Crystal Palace" on a narrow device truncates to "Crystal Pal…" — not "CRY". The full name remains the source of truth for the rendered label.

- **Tug-of-war placeholder slot** — see "Tug-of-war placeholder" below.

- **Depth row** (justify space-between, marginTop 12, fontSize 11):
  - Left group: Kit size 14, home team name (colour `text.mut`), then mono "3 of 5" (colour `text.hint`).
  - Centre: mono uppercase "RESEARCH DEPTH 7/10" (colour `text.hint`, letterSpacing 0.4, fontSize 10).
  - Right group: mono "3 of 5", away team name, Kit size 14.
  - All values hardcoded for now ("3 of 5", "7/10") — these become real in Phase 4 when the pattern engine ships.

- **Footer row** (marginTop 14, paddingTop 12, borderTop 0.5px hairline `colors.border.default`, justify space-between):
  - Left: `tc-body` text in `text.mut`, fontSize 11: "Bar length encodes consistency depth · longer bars hold over more fixtures."
  - Right: Pressable button, transparent background, amber-bright text "Open fixture" + `arrow-right` icon size 13. Calls `onOpen`.

**Tug-of-war placeholder**:
- An empty `GlassPanel variant="standard"` with `marginTop 12`, padding `14px 14px 16px`, height roughly 120 (the source's `.tow` is ~5 rows × 22px + gaps = ~150 but we don't need to match exactly).
- **No label, no placeholder text.** The panel reserves the layout slot only.
- Comment in code: `// Tug-of-war chart slot — empty panel reserves the layout footprint. Chart implementation lands in Phase 3 alongside fixture detail. See styles.css .tow / .tow-bar / .tow-row for the spec.`

---

### 7. ResearchCard

**Location:** `packages/ui/src/components/ResearchCard.tsx`.

**Props**:
```ts
interface ResearchCardProps {
  item: ResearchItem;
  homeTeam: Team;
  awayTeam: Team;
  onPress?: () => void;
}
```

**Visual**:
- `GlassPanel variant="standard"`, padding 14, with `tap-row` behaviour (Pressable wrapper with `activeOpacity 0.7` via `style={({pressed}) => [..., pressed && { opacity: 0.7 }]}`).
- **Meta row**: `tc-meta` league/kickoff/venue on left + `<SignalBadge score={item.signal} />` on right. marginBottom 10.
- **Teams row** (same pattern as FeaturedMatch but with size 20 kits and fontSize 16 names). marginBottom 12.
- **Angle inset**:
  - Inner `GlassPanel variant="standard"`, background `rgba(0,0,0,0.20)` (override the default glass gradient), padding `10 12`, flexDirection row, alignItems center, gap 12.
  - `<SafePill threshold={a.threshold} hits={parseInt(a.hits)} tier={tier} addable />` — note `tier` is `a.tier ?? (a.hits === '5/5' ? 'teal' : 'amber')`. `addable` is the visual `+` affordance from Phase 2A; remains visual-only this phase.
  - Title (`tc-body-em`) + body (`tc-cap`, marginTop 2, colour `text.mut`) stacked vertically. flex 1.
  - `arrow-right` icon size 14, colour `amber-bright`.

---

### 8. PickupCard

**Location:** `packages/ui/src/components/PickupCard.tsx`.

**Props**:
```ts
interface PickupCardProps {
  meta: string;          // 'LAST VIEWED · 22 MIN AGO'
  title: string;         // 'Newcastle vs Brighton'
  sub: string | React.ReactNode;  // string or a styled inline node (the amber +4.20)
  onPress?: () => void;
}
```

**Visual**:
- `GlassPanel variant="standard"`, padding 12, `tap-row` Pressable.
- Stack: `tc-micro` meta (fontSize 9), then title (fontSize 13, weight 500, marginTop 6, letterSpacing -0.1), then sub (`tc-cap`, marginTop 2).

Dashboard renders two of these with hardcoded static content per the source (per your decision to use static mock; Phase 6 wires real saved state in).

---

### 9. ScanCard

**Location:** `packages/ui/src/components/ScanCard.tsx`.

**Props**:
```ts
interface ScanCardProps {
  icon: IconName;
  title: string;
  sub: string;
  onPress?: () => void;
}
```

**Visual**:
- `GlassPanel variant="standard"`, padding 12, `tap-row` Pressable, flexDirection row, alignItems center, gap 10.
- Leading icon size 16, colour `text.mut`.
- Stack of title (fontSize 13, weight 500) + sub (`tc-cap`, marginTop 1). flex 1.
- Trailing `chevron-right` icon size 14, colour `text.hint`.

Dashboard renders four in a 2×2 grid: `flag` "High corners 7 fixtures · 8+ floor", `card` "Cards-heavy refs · 3 fixtures today", `target` "Shots on target · Player props · L5", `sparkles` "Ask the AI · Natural language".

---

### 10. Dashboard screen — assembly

**Location:** `apps/mobile/app/(tabs)/index.tsx`.

**Replace the existing 2A demo content entirely.** This file becomes the real Dashboard.

Structure (top-to-bottom):

```tsx
<SafeAreaView edges={['top']}>
  <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 0, paddingBottom: 200 }}>
    {/* Branding header */}
    {/* HeroCarousel */}
    {/* Greeting block */}
    {/* SectionHead "TODAY'S FIXTURES" — utility tone, meta "Premier League · 1 of 6" */}
    {/* HScroll of FixtureCards */}
    {/* Hint row */}
    {/* SectionHead "FEATURED MATCH" — engine tone, meta "Highest signal today" */}
    {/* FeaturedMatch */}
    {/* SectionHead "TOP RESEARCH TODAY" — engine tone, meta "Ranked 2–4" */}
    {/* Stack of 3 ResearchCards, gap 12 */}
    {/* SectionHead "PICK UP WHERE YOU LEFT OFF" — utility tone */}
    {/* 2-col grid of 2 PickupCards */}
    {/* SectionHead "SCAN ACROSS FIXTURES" — utility tone */}
    {/* 2x2 grid of 4 ScanCards */}
  </ScrollView>
</SafeAreaView>
```

**Bottom padding 200** clears the absolute-positioned NotePadBar + BottomNav from Phase 2A.

**Hoist the page-level `RadialBackdrop`** — this is the one explicit exception to the "don't modify root `_layout.tsx`" rule from Phase 2A.

Current state from Phase 2A: each screen renders its own `<RadialBackdrop />` inline (the Phase 1C demo had it at the top of `(tabs)/index.tsx`; `StubScreen` has its own copy in `apps/mobile/src/screens/StubScreen.tsx`). That's wrong — the backdrop is page-level chrome, not per-screen content, and duplicating it means every tab pays the SVG cost again.

In this phase:
1. Add `<RadialBackdrop />` to `apps/mobile/app/_layout.tsx` (the root layout) once, behind all routes. It sits as an absolute-positioned sibling to the route slot, with `pointerEvents="none"` so it never blocks touches.
2. Remove the inline `<RadialBackdrop />` from `apps/mobile/src/screens/StubScreen.tsx`.
3. The new Dashboard at `(tabs)/index.tsx` does NOT render its own `<RadialBackdrop />` — relies on the hoisted root version.
4. The existing Phase 1C `DarkTheme` + `StatusBar style="light"` setup in the root layout stays intact. Only the RadialBackdrop is added.

**Navigation**: tap handlers on FixtureCard, FeaturedMatch's "Open fixture" button, and ResearchCard should all eventually route to `/fixture/[id]`, but that route doesn't exist yet (Phase 3). For now: hook them up as `onPress={() => { /* TODO: Phase 3 — router.push(`/fixture/${id}`) */ }}`. No-op is fine; the linkage is the important part. The `_layout.tsx` for the new route comes in Phase 3.

**Advanced toggle (`advanced` prop in source)**: do NOT implement in 2B. Skip the advanced section entirely. Comment in the file: `// Advanced mode (cross-fixture leaderboards, manual stat scanning) — Phase TBD. Source dashboard.jsx renders an advanced glass panel here; deferred until preference storage exists (Phase 6+).`

---

### 11. Re-exports

Update `packages/ui/src/index.ts` to export everything new:
- `HeroCarousel`, `HeroCarouselProps`
- `HeroDecor`, `HeroDecorProps`
- `FixtureCard`, `FixtureCardProps`
- `FeaturedMatch`, `FeaturedMatchProps`
- `ResearchCard`, `ResearchCardProps`
- `PickupCard`, `PickupCardProps`
- `ScanCard`, `ScanCardProps`
- `IconButton`, `IconButtonProps`
- `HScroll`, `HScrollProps`

Update `packages/types/src/index.ts` to export everything new:
- `FixtureSummary`, `SignalTier`
- `ResearchItem`, `ResearchAngle`
- `CarouselSlide`, `CarouselKind`

---

## Constraints (unchanged from 2A)

- **Stack locked**: Expo SDK 54, RN 0.81, TS strict, NativeWind v4.2, Tailwind 3.4. No upgrades.
- **Two font weights only**: 400 and 500. The source has some `fontWeight: 600` in the tug-of-war bar text and `slip-count-badge` — neither lands in 2B, so not an issue here. If you encounter one elsewhere in the dashboard source, override to 500 and flag in the summary.
- **All hairline borders**: `StyleSheet.hairlineWidth`. Never literal `borderWidth: 0.5`.
- **No emoji**: SVG icons only via `<Icon>`.
- **No new accent colours**: amber + teal only.
- **No certainty language**: not a copy issue this phase, but never write any.
- **Glass surfaces only**: never a solid-fill card. All cards in this phase use `GlassPanel` variants.
- **iOS glows via `shadowColor` + `shadowRadius`**, Android glows via `AndroidGlowUnderlay` from Phase 1C. Re-use, don't duplicate.
- **`Pressable` press-feedback always uses array form**:
  ```tsx
  // CORRECT
  style={({ pressed }) => [staticStyleObject, pressed && { opacity: 0.7 }]}

  // WRONG — never do this
  style={({ pressed }) => ({ flex: 1, alignItems: 'center', ... })}
  ```
  The wrong form returns a fresh object on every render. Fresh object identity invalidates React Native's style diff, causing layout re-renders on every press tick — manifests as flicker, lost touches, and FlatList offset jumps. Static style objects (declared outside the component, or via `StyleSheet.create`) plus a press-conditional are stable across renders. This rule applies to every Pressable in the codebase.

---

## Forward-looking nomenclature reminders

From Phase 2A — don't drift:

- "Note Pad" = scratch space (the bar above nav). Not "slip", not "builder bar".
- "Builder" = saved Note Pad.
- "Leg" = item inside either.
- The `addable` prop on `<SafePill>` remains visual-only in 2B. The Note Pad hook arrives in Phase 5.

---

## Decisions to flag in the summary doc

Anything not explicit in this brief that you have to decide — flag it the same way Phase 2A did. Expected areas:

1. **Exact logo image width** — depends on the PNG's natural aspect ratio (calculation steps in the Logo asset section).
2. **Featured match team name truncation behaviour on very narrow devices** — spec says `numberOfLines={1}` + `ellipsizeMode="tail"`. If the truncation results land badly (e.g. both names truncating awkwardly side-by-side), note it.
3. **Fade-up animation library choice** — `Animated` (built-in) vs `react-native-reanimated`. Default to built-in `Animated` unless you have reason not to; reanimated isn't in the dep tree yet and this phase shouldn't add it.
4. **Any source bugs found** (similar to the Phase 1C `arrow-left` polyline) — document inline + in the summary.
5. **PickupCard `sub` rendering of inline-coloured node** — the source passes JSX (`<span style={{ color: 'var(--amber-bright)' }}>+4.20 · 2 fixtures remaining</span>`). In RN this becomes a nested `<Text>`. Confirm the type signature handles both string and ReactNode.

---

## Verification

Before declaring done, run:

- `pnpm typecheck` from repo root — all packages pass, zero errors.
- `node apps/mobile/scripts/regen-typed-routes.js` if any tab files changed (none expected this phase, but run if in doubt).
- `npx expo export --platform ios` — bundles cleanly, no resolution errors.
- `npx expo export --platform android` — same.
- No `console.log`, no emoji, no font weight 600+, no inline `borderWidth: 0.5`.
- All `@count/ui` imports in any app code use the package name, not relative paths.
- All hairline borders go through `StyleSheet.hairlineWidth`.
- Logo asset is at `apps/mobile/assets/count-logo.png`.

Nick will then test on real iPhone via Expo Go and visually confirm:
- Branding header renders with the logo, search + bell buttons accessible.
- HeroCarousel auto-advances every 5s; dots tappable; tapping a dot re-anchors the auto-advance.
- HeroDecor shows the right bar+rings for each slide kind.
- Greeting reads correctly with "11 strong angles" inline teal.
- Today's row scrolls horizontally; MCI vs CRY card (primary: true) shows the elev variant with amber rim glow.
- FeaturedMatch renders with the placeholder slot where tug-of-war goes (no broken layout).
- ResearchCards stack vertically with the angle inset visible.
- PickupCards and ScanCards render in their grids.
- NotePadBar + BottomNav from Phase 2A still render correctly above all of this; nothing collides.

Phase 2A.5 calibration items remain deferred (Note Pad position, Android blur).

---

## Stop conditions

- After build + verifications, **do not commit**.
- Write `docs/phases/phase-2b-summary.md` matching the format of Phase 2A summary: what was built, decisions, surprises in source, honest visual deltas, TODOs, verification output.
- Stop. Nick reviews the diff in chat.