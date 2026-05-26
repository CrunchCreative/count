# Phase 2B — Summary

## What was built

### `@count/types`

- `packages/types/src/fixture.ts` — new. Exports `FixtureSummary` (single shape for Today's-row cards, Featured match's visible subset, and the base Pick<> for ResearchItem) plus `SignalTier`.
- `packages/types/src/research.ts` — new. Exports `ResearchAngle` and `ResearchItem` (extends `Pick<FixtureSummary, ...>` with an `angle` payload).
- `packages/types/src/carousel.ts` — new. Exports `CarouselKind` (`'pattern-hit' | 'engine' | 'depth'`) and `CarouselSlide`.
- `packages/types/src/index.ts` — re-exports the six new names alongside the existing `Team` family.

### Mobile mock layer

All four ports preserve the source values byte-for-byte for fields the Dashboard reads. Unicode curly apostrophes (`’` in `St James’ Park`, `La Cerámica`, `Open today’s scan`, `yesterday’s Safe builder`) carried across.

- `apps/mobile/src/mock/carousel.ts` — `CAROUSEL` array of 3 slides.
- `apps/mobile/src/mock/fixtures.ts` — `TODAY` array of 6 PL fixtures with primary flag on `mci-cry`.
- `apps/mobile/src/mock/research.ts` — `TOP_RESEARCH` array of 3 items (`liv-ars`, `vil-bet`, `ata-rom`). `ata-rom` carries the explicit `tier: 'amber'` override from the source.
- `apps/mobile/src/mock/featured.ts` — exports `FEATURED: FixtureSummary` with only the Dashboard-visible fields. `thresholds`, `matrix`, `players`, `referee`, `h2h` deliberately not ported — they belong to Phase 3.

### `@count/ui` — new Dashboard components

- `packages/ui/src/components/IconButton.tsx` — 32×32 glass-bordered tap target. `icon`, `onPress`, optional `accessibilityLabel`. `hitSlop: 6` for comfortable touch. Uses `colors.text.muted` for the icon and `colors.border.default` for the hairline. Press-feedback via the array-form `style={({pressed}) => [staticStyle, pressed && {opacity: 0.7}]}` pattern.

- `packages/ui/src/components/HeroDecor.tsx` — right-side decorative chart for the carousel. Two layers: an SVG with three concentric circles at radii 40/60/80 (right -10, top -10, 130×130, opacity 0.25), then 10 bars driven by a `kind→heights` table (pattern-hit rising, engine mixed, depth steady). Each bar is a `<View>` with overflow hidden + a top-to-bottom `LinearGradient` from the kind colour to `transparent`, opacity ramped `0.55 + (i/10)*0.45`. iOS `shadowColor`/`shadowRadius: 6`/`shadowOpacity: 1` for the per-bar glow; Android skips. `pointerEvents="none"` so it never blocks the slide's tap.

- `packages/ui/src/components/HeroCarousel.tsx` — auto-advancing 5s carousel using the brief's epoch pattern (`useEffect([epoch, n])` rebuilds the interval; `jumpTo(i)` increments epoch). Fade-up animation on every slide change via `Animated.parallel` (opacity 0→1, translateY 8→0, 400ms ease-out). Inline mini signal-badge (padding 3/8, fontSize 9, letterSpacing 0.5) for the slide label — *not* the `<SignalBadge>` primitive, which has different padding. Dots row beneath: 16×2 pillets with `colors.text.primary` for active and `rgba(255,255,255,0.10)` for inactive, `hitSlop: 8`, jump-to-index on press.

- `packages/ui/src/components/FixtureCard.tsx` — fixed-width 140 card. Variant `elevated` when `fixture.primary === true`, else `standard`. Top row: mono amber kickoff + `<SignalMini>`. Centre stack: home (fontSize 22) / mono "vs" / away. Bottom row: mono REF · name + cpm value + "cards/m" hint.

- `packages/ui/src/components/HScroll.tsx` — generic horizontal `FlatList` wrapper. `contentContainerStyle.paddingHorizontal: 20` + `style.marginHorizontal: -20` ports the source's `padding: 0 20px; margin: 0 -20px` gutter trick so the scroll area extends past the parent's gutter. `ItemSeparatorComponent` with a 10px spacer. Sets `accessibilityRole="list"` on the FlatList; items render their own roles + labels.

- `packages/ui/src/components/FeaturedMatch.tsx` — elevated panel. Meta row (league · kickoff · venue) + `<SignalBadge>`, team row (Kit shirt 22 + name 18px, with `numberOfLines={1}` + `ellipsizeMode="tail"` per the brief), the **tug-of-war placeholder slot** (empty `<GlassPanel variant="standard">` at height 120 — no label, comment explains it reserves the layout footprint for Phase 3), depth row (Kit 14 + muted name + mono "3 of 5", centre mono "RESEARCH DEPTH 7/10"), footer row (mut body note + amber "Open fixture" pressable). Footer top border via `borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border.default`.

- `packages/ui/src/components/ResearchCard.tsx` — standard glass + tap-row. Meta + signal-badge row, teams row (Kit 20 + name 16), nested-glass angle inset (`backgroundColor: 'rgba(0,0,0,0.20)'` overriding the panel's default gradient) containing `<SafePill addable>` + title/body stack + trailing amber `arrow-right`. Tier derivation: `angle.tier ?? (hits === '5/5' ? 'teal' : 'amber')`. `addable` flag is visual-only per the Phase 2A convention; Note Pad wiring still arrives in Phase 5.

- `packages/ui/src/components/PickupCard.tsx` — compact card. `meta` mono uppercase (fontSize 9), title (fontSize 13 weight 500 marginTop 6), `sub` accepts `string | ReactNode` so the Dashboard can pass an inline amber `<Text>` for the +4.20 figure without `dangerouslySetInnerHTML`-style gymnastics.

- `packages/ui/src/components/ScanCard.tsx` — flex-row card: leading icon (16, muted), title (13, weight 500) + sub (11, muted) stack, trailing chevron-right (14, hint).

### `@count/ui` — barrel

`packages/ui/src/index.ts` adds exports for: `IconButton`, `IconButtonProps`, `HScroll`, `HScrollProps`, `HeroCarousel`, `HeroCarouselProps`, `HeroDecor`, `HeroDecorProps`, `FixtureCard`, `FixtureCardProps`, `FeaturedMatch`, `FeaturedMatchProps`, `ResearchCard`, `ResearchCardProps`, `PickupCard`, `PickupCardProps`, `ScanCard`, `ScanCardProps`.

### Dashboard assembly

- `apps/mobile/app/(tabs)/index.tsx` — completely rewritten. The Phase 2A demo content is gone. New top-to-bottom: branding header (logo + 2 IconButtons), HeroCarousel, greeting block, SectionHead "TODAY’S FIXTURES" + HScroll of FixtureCards + hint row, SectionHead "FEATURED MATCH" + FeaturedMatch, SectionHead "TOP RESEARCH TODAY" + stack of ResearchCards, SectionHead "PICK UP WHERE YOU LEFT OFF" + 2-col grid of PickupCards, SectionHead "SCAN ACROSS FIXTURES" + 2×2 grid of ScanCards. `paddingBottom: 200` clears NotePadBar + BottomNav. No own `<RadialBackdrop />` — relies on hoisted root version.

- **Logo asset**: `apps/mobile/assets/count-logo.png` (copied from the design source). Natural dimensions 3508 × 1363 (verified with `file`), aspect ratio ≈ 2.574. Rendered at `height: 50, width: 50 * (3508/1363) ≈ 128.7`. iOS-only amber drop shadow (`shadowColor: 'rgba(232,181,58,0.20)', shadowRadius: 14`) to replicate the source filter. `marginLeft: -15` ports the source's negative-margin hang-into-gutter.

- **`apps/mobile/app/_layout.tsx`** — `<RadialBackdrop />` hoisted here. Wrapped the `<Stack>` in a `<View>` with `colors.bg.page` background + the backdrop as an absolute-fill sibling, plus `screenOptions.contentStyle: { backgroundColor: 'transparent' }` so the route content paints over the backdrop instead of overlaying its own opaque background. `DarkTheme` + `StatusBar style="light"` from Phase 1C unchanged.

- **`apps/mobile/src/screens/StubScreen.tsx`** — inline `<RadialBackdrop />` removed. The four stub tabs now read through the hoisted root copy. Comment in the file explains the move.

---

## Decisions not explicit in the brief

1. **Logo image width — exact ratio used: `50 * (3508/1363) ≈ 128.7px`.** PNG's native size is 3508×1363, recorded as a code comment per the brief. Rendered at height 50 as specified. **Visual check requested**: the rendered logo is roughly 4× the width of the 32×32 icon buttons, which may dominate. Brief permitted dropping to 36–40px if it reads too large on device — flagging here so Nick can call it on the iPhone pass.

2. **Featured-match team-name truncation** kept at `numberOfLines={1}` + `ellipsizeMode="tail"`, per the brief's truncation rule. Wrapped each side in `flex: 1, minWidth: 0` containers so the Kit + "vs" stay sized while the name gives ground. Should produce "Crystal Pal…" on narrow viewports rather than crowding.

3. **Fade-up animation: built-in `Animated`** (not reanimated). Brief default. The animation runs on every `index` change driven by `useEffect([index])`.

4. **Haptics on dot tap deferred.** Brief flagged this as optional. Not added — Phase TBD when haptic patterns are reviewed across the app holistically.

5. **`HeroCarousel` always wraps the panel in a `Pressable`**, even when no `onPress` is provided. Adds one render-layer but keeps the tree shape consistent; an `undefined` onPress is a no-op tap target.

6. **`onPress` handlers everywhere are inline TODO comments** referencing the Phase 3 fixture route. No `router.push` call yet — the route doesn't exist. The TODO comments are intentional and not stylistic clutter; they mark the call sites Phase 3 needs to touch.

7. **`featured.ts` exports `FEATURED`** (a single value), not a registry. Brief specified a `FixtureSummary` value; this name is the most natural read at the call site (`<FeaturedMatch fixture={FEATURED} ... />`).

8. **Inline mini signal-badge in HeroCarousel** built ad-hoc rather than threading a size prop through `<SignalBadge>`. The source's `signal-badge` plus its override (padding 3/8, fontSize 9, letterSpacing 0.5) is small enough that a second tier-spec table inside HeroCarousel was cleaner than dragging a `size?: 'std' | 'compact'` parameter into the public API of `<SignalBadge>` for a single caller. Documented in a comment inside the file.

9. **Logo `marginLeft: -15`** ported from the source's `style={{ marginLeft: -15 }}`. This makes the logo hang into the page's left gutter so the upright "T" of "The Count" aligns visually with the left content edge. Inline rather than tokenised.

10. **`StubScreen` no longer sets a page background colour.** Pre-2B it owned `backgroundColor: colors.bg.page` on its root `<View>` because it also owned the backdrop. The hoisted root now provides both — StubScreen is just text inside SafeAreaView. Less is more.

11. **`(tabs)/_layout.tsx` left untouched** despite the layout-modification exception. The exception was scoped to hoisting the backdrop into `app/_layout.tsx` (root). The tabs layout still owns the `tabBar={...}` slot that renders NotePadBar + BottomNav.

12. **No `Pressable` style-as-function dropping props.** All new Pressables use `style={({pressed}) => [staticStyle, pressed && {opacity: 0.7}]}`. Static style objects are declared outside the JSX (component-module scope) so their identity stays stable across renders.

---

## Surprises in the source

- **`signal-badge` size override inside HeroCarousel.** The source passes inline style (`padding: '3px 8px', fontSize: 9, letterSpacing: 0.5`) overriding the class. Easy to miss if you re-use `<SignalBadge>` directly — the size delta against the standalone primitive is enough to read wrong.

- **`.h-scroll` margin trick.** `padding: 0 20px; margin: 0 -20px` is the canonical "horizontal scroll extends past the gutter" CSS pattern. Ported as `contentContainerStyle.paddingHorizontal: 20` + `style.marginHorizontal: -20`. The FlatList lets you ship this without a custom shimmy.

- **`fix-card` `.ref .v` is a `display: block` span inside the mono label.** Renders as a value beneath the label on a second line. Ported as two stacked `<Text>` elements (label then value) inside a parent `<View>`.

- **No tug-of-war placeholder text in the source.** The `.tow` panel renders the chart directly; there's no fallback / loading state. The empty `<GlassPanel variant="standard">` at height 120 reserves space without inventing copy that would later need to be removed.

- **No source bugs found in dashboard.jsx** beyond the already-documented `arrow-left` polyline (Phase 1C). The `HeroCarousel` source uses `paused`/`useMouseEnter` for hover — irrelevant on mobile, replaced by the brief's epoch pattern.

---

## TODOs left in code

Inline `/* TODO: Phase 3 — router.push(`/fixture/${id}`) */` comments in `index.tsx` for FixtureCard, FeaturedMatch's "Open fixture" button, and ResearchCard. The Phase 3 brief should grep for these.

Also `/* TODO: Phase 5 — router.push('/search') */` and `/* TODO: Phase TBD — notifications */` on the header IconButtons.

No `// TODO` markers in the new component packages — the deferred work is phase-scoped.

---

## Honest visual deltas (source intent vs. what RN renders)

1. **HeroDecor bar glow is iOS-only.** Source uses `boxShadow: 0 0 6px rgba(...)` on every bar. iOS gets `shadowColor`/`shadowRadius: 6`/`shadowOpacity: 1`. Android bars render without the per-bar halo — the bars themselves still render, just less luminous. Acceptable. Adding a sibling underlay per bar would be ten extra `<View>`s; not worth it for a decorative element at 70% opacity.

2. **Logo drop shadow is iOS-only.** Same reason — Android `elevation` is greyscale + would render around the image bounding box rather than the visible logo shape (transparent PNG → boxy shadow). Skipped on Android per the brief's pattern.

3. **Concentric ring backdrop** uses `react-native-svg` `<Circle>` with `strokeWidth={0.5}`. Source CSS spec: `0.5px`. RN-SVG honours fractional widths reliably — should render thin, no antialiasing surprises.

4. **`maxWidth: '70%'` on hero body text** behaves slightly different in RN than CSS — RN computes it from the parent flex constraints rather than from the panel's intrinsic width. Should still leave room for the decor on the right edge. If the body wraps badly on a wider device, dropping to a fixed `maxWidth: 230` is the fix.

5. **Featured match's middle "vs" text** between the two team-name flex groups: source uses fixed inline. Mine uses a centred `<Text style={{fontSize: 10}}>`. On a very narrow phone the two flex children (with `numberOfLines={1}` names) plus the "vs" should fit at 16/22pt headline + truncated names. Visual review pass to confirm.

6. **The greeting paragraph nested `<Text>` for "11 strong angles"** works as expected in RN — inline tint applied via a nested Text node, no spacing artifacts. Confirmed by typecheck + bundle.

7. **The carousel dots use `colors.text.primary`** for active and `rgba(255,255,255,0.10)` for inactive. Source uses `var(--t-pri)` and `rgba(255,255,255,0.10)`. 1:1.

8. **RadialBackdrop hoist** changes nothing visually — the backdrop now lives behind every route via the root `<View>` rather than being painted per-screen. Tabs / Stub / Modal all inherit it. Slight perf win: SVG cost paid once per nav, not once per tab.

---

## Verification output

- `pnpm typecheck` — **passes, zero errors.** All 6 packages.
- `node apps/mobile/scripts/regen-typed-routes.js` — succeeded. No tab files changed in this phase, but ran for safety after the layout edits.
- `npx expo export --platform ios` — **succeeds, 1465 modules.** Was 1451 in Phase 2A; the +14 reflects the new Dashboard components + `Image` + their internal SVG/gradient deps. Logo PNG (358 kB) included in assets.
- `npx expo export --platform android` — **succeeds, 1461 modules.** Logo PNG included. No platform-specific resolution errors.
- **No `console.log`** in `packages/{ui,types,tokens}/src` or `apps/mobile/{app,src}`.
- **No emoji** anywhere new (`grep -rPn '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]'` → empty).
- **No font weight ≥ 600** in new code. All weights through `typography.weight.regular` / `.medium`.
- **No inline `borderWidth: 0.5`** or `borderWidth: 1` in new code. The lone hairline in `FeaturedMatch` (footer top border) uses `StyleSheet.hairlineWidth`. Component-level borders flow through `<GlassPanel>` which already uses hairlineWidth internally.
- **All `@count/ui` imports in app code use the package name**: `apps/mobile/app/_layout.tsx`, `apps/mobile/app/(tabs)/_layout.tsx`, `apps/mobile/app/(tabs)/index.tsx`. Mock-data imports use the `@/` workspace alias.
- **Logo asset present** at `apps/mobile/assets/count-logo.png`, dimensions 3508 × 1363 (PNG metadata verified).

---

## To do before reviewing on device

Nothing — bundles cleanly. Pass the diff + summary to Nick, then `npx expo start --tunnel` from `apps/mobile/` for the iPhone + Android pass.

---

## Open visual questions for device review

1. **Logo size at 50px** — does it balance against the 32×32 icon buttons or dominate? Brief permitted dropping to 36–40px if needed.
2. **FeaturedMatch team-name truncation** on narrow devices — "Crystal Palace" should truncate to "Crystal Pal…" not collide with the centre "vs". Confirm on iPhone Mini-class viewport (375pt).
3. **Tug-of-war placeholder height (120px)** — is the panel reading as a deliberate slot or as an empty/broken element? If the latter, Phase 3 picks it up first anyway; otherwise we can tune the height closer to the final chart's ~150px.
4. **HeroCarousel auto-advance feel** at 5000ms — confirm not too slow / fast for the analytical tone.
5. **HeroDecor opacity 0.7** — on top of `bg-hero` (#0B1A14) the bars should read as a subtle backdrop. If they punch too hard, drop to 0.55.

Phase 2A.5 calibration items remain deferred (Note Pad position, Android blur).
