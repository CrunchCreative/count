# Phase 2B — Debug notes

Three rendering bugs surfaced after Phase 2B's first device pass. All three were caused by interactions between React Native's view tree and how earlier code assumed CSS-flavoured semantics would translate.

---

## Bug 1 — RadialBackdrop invisible on every screen

### Symptom
Pages rendered as flat `#08090B`. No amber halo (top-centre) or teal pool (bottom-right) gradient visible behind any tab.

### Root cause
React Navigation's `DarkTheme.colors.background` is `'rgb(1,1,1)'`. Every navigator in the tree (the root `Stack`, the nested `Tabs` BottomTabNavigator under `(tabs)`) reads this value and paints it as an **opaque** scene/container background on top of the route content.

Setting `screenOptions.contentStyle = { backgroundColor: 'transparent' }` on the Stack worked for *direct* Stack screens (e.g. the `modal` route) but did not reach inside the nested `Tabs` navigator. Every tab's scene container therefore painted near-black over the `RadialBackdrop` sibling rendered by the root `_layout.tsx` View.

The backdrop element itself was rendering correctly all along — it was just buried beneath the navigator's theme-driven fill.

### Fix
Derived a `TransparentDarkTheme` from `DarkTheme` with `colors.background` and `colors.card` overridden to `'transparent'`, and passed that to `ThemeProvider` in `apps/mobile/app/_layout.tsx`. The root `View` still owns the `colors.bg.page` base tint so we never have a real alpha hole; every navigator below now respects the transparent default, letting `<RadialBackdrop />` paint through.

Files changed:
- `apps/mobile/app/_layout.tsx` — added `TransparentDarkTheme` const, swapped it into `ThemeProvider`. Kept `Stack screenOptions.contentStyle = { backgroundColor: 'transparent' }` as belt-and-braces.

---

## Bug 2 — Glass panels visually inset further than sibling text + keyline glow floating above panel top

### Symptom
On the Dashboard the hero carousel and featured-match panels' visible borders sat ~16–20px further inset from the screen edges than the greeting text above them. The amber keyline glow stripe on the elevated panel rendered detached above the panel's visible top edge instead of sitting on the border.

### Root cause
Both symptoms shared one cause. `GlassPanel` was spreading the caller's `style` prop on the **outer** `View`:

```tsx
<View style={[{ borderRadius }, glowStyle, style /* ← outer */]}>
  <View style={{ borderRadius, borderWidth: hairline, borderColor }}>  {/* visible border */}
    ...
  </View>
  {renderKeyline && <KeylineGlow />}  {/* absolute, top: -0.5 of OUTER */}
</View>
```

Callers passed `style={{ padding: 16 }}` (and similar). `padding` on the outer pushed its children — including the inner bordered View — inward by the padding amount. Result: the visible panel border sat `padding` px inset from where the parent's flow placed the outer.

Same mechanism produced the floating keyline: `KeylineGlow` positioned itself `top: -0.5` relative to the **outer**, but the inner panel sat `padding` px below outer's top edge. The keyline ended up that many pixels above the visible top border.

Phase 1C never surfaced this because the demo used a `<PanelBody>` helper that placed padding *inside* `children` (i.e. on a child View). Phase 2B started passing `padding` via `style`, which exposed the bug.

### Fix
Moved the caller's `style` spread from the outer `View` to the **inner** bordered `View` in `packages/ui/src/components/GlassPanel.tsx`. The outer keeps only `{ borderRadius, ...glow }` (for shadow rendering); it now hugs the inner exactly. `KeylineGlow` at `top: -0.5` of outer = `top: -0.5` of inner border = right on the visible top edge.

No caller change needed. Every existing call site continued to work because `padding`/`minHeight`/`width`/`borderRadius` all do the right thing on the inner bordered surface (which is exactly where they were meant to apply).

Files changed:
- `packages/ui/src/components/GlassPanel.tsx` — outer View loses the `style` spread; inner View gains it via array merge.

Minor cosmetic wrinkle: `FixtureCard` passes `borderRadius: 12` in style. The inner View now renders rounded corners at 12 while the outer's shadow corner curve still uses 14 (default `radii.panel`). At the glow's softness this is invisible — left unchanged.

---

## Bug 3 — Carousel dots not rendering

### Symptom
Empty 28px gap below the hero carousel where the three pillet dots should be. Container size correct, no dot visuals.

### Root cause
The dots were rendered as **childless** `Pressable`s, 16×2 px, with a function-form `style={({ pressed }) => [...]}` returning an array containing a freshly-allocated `{ backgroundColor }` object on every render.

The Phase 2A gotcha #1 about `Pressable` function-form `style` was specifically the object-returning form (`style={() => obj}`) dropping properties. The array-returning form is normally safe — but this case had a tighter combination: no children, height 2 (below most native-view "visually significant" thresholds), and a fresh object inside the returned array on every render. Empirically the backgroundColor was not being applied on iOS.

### Fix
Separated touch handling from visual rendering. The `Pressable` now carries only the pressed-opacity callback style (returning an array with at most a `pressed && { opacity }` member, which the Phase 2A pattern handles cleanly). A plain `<View>` child holds the dot's actual paint (`width`, `height`, `borderRadius`, `backgroundColor`). `<View>`'s style processing is deterministic — no Pressable stateful style path.

Also corrected the inactive dot colour to `rgba(255,255,255,0.35)` (per the bug report's expected value — previously was `0.10`, which would have rendered close to invisible against the page tint even when it did paint).

Files changed:
- `packages/ui/src/components/HeroCarousel.tsx` — extracted `DOT_ACTIVE_COLOR` / `DOT_INACTIVE_COLOR` constants; dots map renders `<Pressable><View style={[dotStaticStyle, { backgroundColor }]} /></Pressable>`.

---

## Verification

- `pnpm typecheck` — passes, zero errors across all 6 packages.
- `npx expo export --platform ios` — bundles cleanly.

No diagnostic markers (`backgroundColor: 'red'` / `'magenta'` / temp borders) were committed; all reasoning was done from reading the code.
