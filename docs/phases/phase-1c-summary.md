# Phase 1C — Summary

## What was built

### `@count/tokens`
- `packages/tokens/src/index.ts` — typed TS constants ported byte-for-byte from `colors_and_type.css`: `colors`, `glass`, `typography`, `spacing`, `radii`, `motion`, `backdrop`, `glows`, plus `Colors` / `Spacing` / `Radii` / `Typography` type aliases.
- `packages/tokens/tailwind.js` — CommonJS mirror of the same values for `tailwind.config.js` (which runs in Node before any TS compiler).
- `packages/tokens/package.json` — `"./tailwind"` subpath export added.
- `packages/tokens/README.md` — new "Two exports, same values" section explains the dual-export policy.

### Tailwind theme
- `apps/mobile/tailwind.config.js` — consumes `@count/tokens/tailwind`. Extends `theme.extend` with colours, spacing, radii, fontSize, fontFamily. Class examples that now resolve: `bg-bg-page`, `text-amber-bright`, `rounded-card`, `p-panel`, `text-h2`.

### `@count/ui` — glass surface layer
- `packages/ui/src/utils/glow.ts` — shared `glowStyle()` (iOS shadow*) + `shouldRenderAndroidGlow` boolean.
- `packages/ui/src/utils/AndroidGlowUnderlay.tsx` — the Android-only sibling halo, extracted so every primitive uses the same underlay component instead of inlining it.
- `packages/ui/src/components/KeylineGlow.tsx` — 1px gradient stripe; tones `amber` / `teal` / `neutral`; default inset 0.12 / 0.15.
- `packages/ui/src/components/RadialBackdrop.tsx` — two stacked `LinearGradient`s approximating the source's two radial gradients (see Visual deltas below).
- `packages/ui/src/components/GlassPanel.tsx` — three variants (`standard` / `elevated` / `hero`), each composing border + glass gradient + 1px inset highlight + optional keyline + platform-appropriate outer glow.

### `@count/ui` — atomic primitives
- `packages/ui/src/components/SafePill.tsx` — std/mini sizes, three tiers, auto-derive when `tier` omitted, optional `addable` (purely visual `+` icon), Pressable wrap when `onPress` given.
- `packages/ui/src/components/SignalBadge.tsx` — full badge (SIGNAL + score), three tiers.
- `packages/ui/src/components/SignalMini.tsx` — score only, three tiers.
- `packages/ui/src/components/FormPill.tsx` — 15×15 W/D/L square; W = amber gradient + glow; D / L flat.
- `packages/ui/src/components/ScorePill.tsx` — scoreline with W/D/L outcome colouring; no glow.
- `packages/ui/src/components/Icon.tsx` — all 32 glyphs ported from `atoms.jsx` via `react-native-svg`. `currentColor` becomes `color` prop (RN has no inheritance).

### `@count/ui` plumbing
- `packages/ui/package.json` — peer + dev deps added for `expo-linear-gradient`, `react-native-svg` so types resolve and Metro can find them at runtime.
- `packages/ui/src/nativewind-env.d.ts` — `/// <reference types="nativewind/types" />` so `className` is allowed on `<View>` in this package's typecheck.
- `packages/ui/src/index.ts` — exports all components + types.

### Demo screen
- `apps/mobile/app/(tabs)/index.tsx` — renders the page background + `<RadialBackdrop />` + all three glass variants + every primitive in every tier/result/outcome + a 6-column icon grid for the 32 glyphs. All imports come from `@count/ui` and `@count/tokens`.

### Scripts
- `apps/mobile/package.json` — `"typecheck": "tsc --noEmit"` added so `pnpm typecheck` from the repo root sweeps the app as well as packages.

---

## Decisions not explicit in the brief

1. **Scaffold gap surfaced and fixed.** `apps/mobile/metro.config.js` had `disableHierarchicalLookup = true` from Phase 1A, on the (incorrect) assumption that pnpm hoists nothing. With it disabled, expo-router can't find `@expo/metro-runtime`, `react-native-css-interop/jsx-runtime`, `@babel/runtime/helpers/*`, etc. — every transitive dep that pnpm symlinks under its owning package. I removed the line (after agreeing with you to do so). The bundle now resolves through pnpm's symlinks the way Node does. **One follow-on:** I also added an `.npmrc` with a narrow `public-hoist-pattern` for `nativewind` + `react-native-css-interop`, because NativeWind's babel plugin is loaded *at config time* and that runs in plain Node — it needs the package physically present at the root or app `node_modules`, not just symlinked under a `.pnpm/...` path. The hoist pattern is intentionally narrow.

2. **`AndroidGlowUnderlay` extracted to its own `.tsx`.** The brief's `glow.ts` example showed only the style helper, with an *inline* `<LinearGradient>` pattern in each component. I extracted the underlay into a shared component so acceptance item 12 ("Glow helper extracted ... and reused. Not duplicated.") is satisfied by composition rather than copy-paste. `glow.ts` itself stays a pure `.ts` (no JSX) as the brief specifies.

3. **`GlassPanel` outer wrapper has no `overflow: hidden`.** The keyline glow needs to render outside the rounded corner, *and* iOS shadow has to bleed outside the layout box. So the outer `<View>` is shadow-bearing + unclipped; the inner `<View>` carries the border, radius, and `overflow: 'hidden'` for the gradient/highlight. The keyline is an absolute sibling on the outer view, exactly as the brief invited.

4. **Android underlay direction.** The brief example used a single inline diagonal gradient. I made the underlay configurable (`direction: 'corner' | 'vertical'`) so `GlassPanel` can use a top-anchored vertical wash (matching the source's `0 1px 24px` shadow placement) while pills use the diagonal corner wash. Default is `corner` so callers usually pass nothing.

5. **`@expo/metro-runtime` left as a direct dep.** I added it before we agreed on the metro.config fix. With hierarchical lookup re-enabled it would resolve transitively too, but leaving it declared is harmless and matches what Expo's own docs sometimes recommend for explicit clarity.

---

## Surprises in the source

- `atoms.jsx` references `window.useSlip` for slip integration — that's web prototype state and doesn't port to RN. The brief flagged `addable` as visual-only this phase, so I ignored it cleanly.
- The desktop `.addable-hint` styling (`styles.css` 1331–1349) is hover-only and gated by `@media (hover: hover)`. I dropped that flow and substituted a small `+` glyph with opacity 0.6 on the pill, per the brief.
- `colors_and_type.css` and the live `styles.css` differ for `.glass.hero` border / shadow: the token CSS uses one set of values, `styles.css` lines 180–187 uses subtly different ones. The brief's per-variant table picks the `styles.css` values (e.g. `rgba(93,202,165,0.10)` for hero border + highlight), so that's what I shipped. Worth flagging in case the divergence matters later.
- `atoms.jsx` `ScorePill` returns `result + ''` regardless of `wdl` — there's an unused-looking ternary. I matched the brief's typed signature instead (`result: string; wdl: 'W'|'D'|'L'`) and dropped the dead concat.
- `safe-pill .v` is sized at 12px in CSS, but the brief specifies 12 for std and 10 for mini. The CSS doesn't show the mini-size override of `.v`; the brief's inline `style={{ fontSize: 10 }}` from `atoms.jsx` is what mini renders. I matched the brief.

---

## TODOs left in code

None — there are no `// TODO` markers anywhere in the diff. The deferred items below are tracked by phase, not by inline TODOs:

- **Slip integration on `SafePill`** (`addable` is currently visual-only). Belongs to whichever phase introduces `useSlip` / the slip bar.
- **Custom font loading** (Söhne + JetBrains Mono). The `fontFamily` falls back to the system stack; the brief explicitly defers this.
- **Precomputed PNG backdrop assets** (`RadialBackdrop`'s comment block flags this as the fallback if the linear-gradient approximation reads poorly on device).

---

## Honest visual deltas (source intent vs. what RN renders)

These are intentional simplifications worth eyes-on review on a real device before the next phase commits to them:

1. **Radial wash is approximated with linears.** `expo-linear-gradient` has no radial mode. The amber halo is rendered as a top-anchored vertical gradient with the source's stops; the teal pool is a diagonal corner-to-centre linear. Likely close enough at typical screen sizes; if it bands or the falloff curve looks wrong, the fallback is two precomputed PNGs (flagged in the component's comment).

2. **Android outer glows are synthesised, not native.** RN's `shadowColor` is iOS-only; Android's `elevation` is greyscale and can't tint. On Android, glows for `GlassPanel.elev` / `GlassPanel.hero` / `SafePill` teal+amber / `SignalBadge` high+mid / `FormPill` W come from the sibling `AndroidGlowUnderlay` — a tinted `LinearGradient` extending past the parent. The colour and opacity match the spec; the falloff shape is approximate (diagonal linear vs. true outer glow). May want a real-device check.

3. **Inset highlight is a 1px filled bar, not a true inset shadow.** CSS `inset 0 1px 0 rgba(255,255,255,0.05)` becomes a 1px-tall absolutely-positioned `<View>` at `top: 0` inside the clipped inner panel. The visual result is indistinguishable from the source at standard pixel densities; mentioned for completeness.

4. **No `backdrop-filter: blur()` anywhere yet.** The source uses it only for the bottom nav / slip bar / modal backdrops, none of which are in this phase. When those land, we'll need `@react-native-community/blur` or `expo-blur` and a real RN translation.

5. **Glass panels don't *currently* dim/lift on press.** The source has `.glass:hover` lifts to `rgba(255,255,255,0.025)`. RN has no hover; press feedback is a screen-level concern handled when these panels become tap targets. No work needed here yet.

6. **Type weights and family fall back to the system stack.** Söhne is licensed and not bundled; Inter / SF Pro Text take over. The visual proportion (line height, letter spacing) is correct; the typeface is not yet final.

---

## Post-review fixes

Three small fixes applied after the initial review:

1. **SafeAreaView on the demo screen** (`apps/mobile/app/(tabs)/index.tsx`). Wrapped the `ScrollView` in `SafeAreaView` from `react-native-safe-area-context` with `edges={['top']}`. The page-background `<View>` and `<RadialBackdrop />` still render full-bleed; only the scrolling content is inset past the status bar / home indicator on iPhone.
2. **Light status bar + forced dark navigation theme** (`apps/mobile/app/_layout.tsx`). Changed `<StatusBar style="auto" />` to `<StatusBar style="light" />`, hardcoded `ThemeProvider value={DarkTheme}`, and removed the now-unused `useColorScheme` import + `DefaultTheme` import. Count is always dark.
3. **Arrow-left polyline corrected** (`packages/ui/src/components/Icon.tsx`). The source `atoms.jsx` had `points="12 19 5 12 12 19"` — the first and third points are identical, so only the bottom arm rendered. Updated to `"12 5 5 12 12 19"` to mirror `arrow-right`. Inline comment notes the source bug for future reference.

Re-verified after these fixes: `pnpm typecheck` passes across all packages; `npx expo export --platform ios` bundles cleanly (1466 modules).

---

## Verification

- `pnpm typecheck` (all 7 packages): **passes, zero errors.**
- `npx expo export --platform ios` (full Metro bundle): **succeeds — 1466 modules, no resolution errors.**
- No `console.log`, no emoji, no font weight 600+, no inline `borderWidth: 0.5`, no `useState` / `useEffect` in any component.
- All hairline borders go through `StyleSheet.hairlineWidth`.
- All `@count/ui` imports in the demo screen use the package name, not relative paths.
- Glows present (iOS shadow + Android underlay) on every component the brief required.
- All 32 icon glyphs ported.
