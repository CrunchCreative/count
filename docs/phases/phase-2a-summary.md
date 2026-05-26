# Phase 2A — Summary

## What was built

### `@count/types`

- `packages/types/src/team.ts` — new file. `Team`, `TeamKit`, `KitPattern`, `FormResult` exports. `KitPattern` is `'solid' | 'vertical_halves' | 'vertical_stripes' | 'horizontal_band'`. `FormResult` is `'W'|'D'|'L'`.
- `packages/types/src/index.ts` — re-exports the four type names. (Previously held only an empty barrel.)

### `@count/ui` — app-shell chrome

- `packages/ui/src/components/BottomNav.tsx` — new. 5-item glass bar pinned to the bottom. Wraps a `BlurView` (`expo-blur`) + a stacked `LinearGradient` (top→bottom 0.4→0.92 opacity over `#08090B`) + a 0.5px hairline top border. Each tab is a `<Pressable>` with `hitSlop: 8`, `minHeight: 44`, vertical stack of icon (22) + label (10). Active tab → `colors.amber.bright`, plus an iOS-only label glow via `textShadow*`. Reads safe-area inset for bottom padding (`insets.bottom + 8`).
- `packages/ui/src/components/NotePadBar.tsx` — new. Always renders the empty state. Absolute, `bottom: insets.bottom + 70`, `left: 12, right: 12`, height 52, radius 14. `BlurView` + glass gradient + inset 1px highlight + 0.5px hairline border. Icon box (32×32, `layers` glyph at 16) + text block (`NOTE PAD` mono uppercase / `No legs added yet` muted sans). `pointerEvents="none"` — visual-only. iOS drop shadow `0 6 24 0.30`. Comment block reserves `useNotePad` / `NotePadSheet` / `Save to Builders` names for Phase 5.
- `packages/ui/src/components/SectionHead.tsx` — new. Row: uppercase label + gradient hairline + optional mono meta. Tones `engine` (teal-bright) and `utility` (muted, default). 22 top margin, 10 bottom.

### `@count/ui` — Kit primitive

- `packages/ui/src/components/Kit.tsx` — new. Discriminated-union `KitProps`: `shirt | mini | square`.
  - **Shirt**: SVG viewBox `0 0 100 110`, default size 22. `react-native-svg` (`Svg`, `Path`, `Rect`, `G`, `Defs`, `ClipPath`). Body path + sleeves + collar shadow notch + inner highlight. Stripes clipped via `ClipPath`. Per-instance `useId()`-based `clipPath` id so multiple instances on one screen don't collide. Sleeve fill follows source rules (band → secondary, solid → secondary∨primary, halves/stripes → primary).
  - **Mini**: 8×9 SVG, `rx="1.5"`. `solid`/`halves`/`stripes`/`band` patterns simplified per source.
  - **Square**: `View`+`Text`, 22×22 rounded 3, 0.5px hairline inset ring. Background per pattern: `solid` → primary; `stripes` → secondary + two absolute 2px primary strips at left/right 4; `halves` → `LinearGradient` with 4 stops `[primary, primary, secondary, secondary]` at locations `[0, 0.5, 0.5, 1]` to render a hard 50/50 split (a single colour pair would smooth-fade); `band` → primary. Player number text: mono, size 11, weight **500** (source has 600 — overridden per brief). Text colour: `#FFFFFF` default; `#1A1408` when `pattern==='solid'` and primary is in `{#FDB913, #FFE667, #FFFFFF}`.
- `packages/ui/package.json` — added `@count/types` as dependency, and `expo-blur` + `react-native-safe-area-context` as peer + dev deps so types resolve and Metro can find them.
- `packages/ui/src/index.ts` — exports `Kit`, `KitProps`, `KitVariant`, `SectionHead`, `SectionHeadProps`, `SectionHeadTone`, `BottomNav`, `BottomNavProps`, `BottomNavTab`, `BOTTOM_NAV_Z_INDEX`, `NotePadBar`, `NOTE_PAD_BAR_Z_INDEX`.

### Mobile app — routing & mock data

- `apps/mobile/src/mock/teams.ts` — new. Full `TEAMS: Record<string, Team>` ported byte-for-byte from `data.js` (50 records — PL 18, La Liga 8, Serie A 8, Bundesliga 6, Ligue 1 4, Eredivisie 3). Plus `getTeam(code)` accessor.
- `apps/mobile/src/screens/StubScreen.tsx` — shared scaffold used by all four placeholder tabs (centred `<Text>` of the screen name against the page background + radial backdrop, top safe-area inset only).
- `apps/mobile/app/(tabs)/_layout.tsx` — rewritten. Renders `<Tabs>` with `tabBar={...}` returning `<NotePadBar />` + `<BottomNav />`, plus `screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}`. Active key derived from `usePathname()`. Routes via `router.navigate(href)` against a `Record<string, Href>` map. Five screens declared: `index`, `fixtures`, `search`, `builders`, `profile`.
- `apps/mobile/app/(tabs)/fixtures.tsx` / `search.tsx` / `builders.tsx` / `profile.tsx` — new stubs, each a one-liner `<StubScreen name="..." />`.
- `apps/mobile/app/(tabs)/explore.tsx` — **deleted** (Expo's default scaffold).
- `apps/mobile/app/(tabs)/index.tsx` — updated. Four new sections added above the Phase 1C cumulative content: `TEAM KITS` (12 shirts, size 26), `KIT MINI` (8 minis), `PLAYER KITS` (8 squares with numbers — includes WOL `#FDB913` and VIL `#FFE667` yellow primaries and TOT/RMA `#FFFFFF` whites to verify the dark-text override), `SECTION HEADS` (one of each tone). Bottom padding bumped to 200 to clear the absolute NotePadBar + nav.
- `apps/mobile/package.json` — `expo-blur ~15.0.8` added (via `npx expo install`).

### Tooling

- `apps/mobile/scripts/regen-typed-routes.js` — new. Invokes `expo-router/build/typed-routes#regenerateDeclarations` to rewrite `.expo/types/router.d.ts`. Needed because expo-router only regenerates that file from Metro's watcher during `expo start`; `expo export` and `tsc --noEmit` do not trigger it. Used here once after the route changes; future phases that add/remove tab files should run this. (See "Decisions" below.)

---

## Decisions not explicit in the brief

1. **Discriminated union on `KitProps`** rather than a single optional `playerNumber`. `ShirtKitProps | MiniKitProps | SquareKitProps` with `playerNumber` required on square and `never` on the others. TS enforces it at the call site — no runtime invariant required, no `Type 'undefined' is not assignable...` shrugs.
2. **`Team` types live in `packages/types/src/team.ts`** (file-per-domain), with `index.ts` re-exporting. The package previously had only an empty barrel; this matches what most TS monorepos do and gives later domains (`Fixture`, `Builder`, `Pattern`, …) a clear convention to follow.
3. **`StubScreen` factored to a shared component** so the four placeholder routes are one-line files instead of copy-pasta. Phase 2B will delete the import from `index.tsx`; the other three stubs survive until 5.
4. **`NotePadBar` has `pointerEvents="none"`.** The brief explicitly says no taps in this phase. Making the whole bar non-interactive guarantees it can never steal touches from content scrolling above it. The component file's comment block reserves the names that flip this back on (`useNotePad`, `<NotePadSheet>`, `Save to Builders`).
5. **`BottomNav` uses `Pressable` with `hitSlop: 8` and `minHeight: 44`** to hit the 44pt accessibility floor. Source CSS only set `cursor: pointer` (web). `accessibilityRole="tab"` + `accessibilityState={{ selected }}` set so screen readers report tabs correctly.
6. **Active route detection via `usePathname()` + path suffix matching**, falling through to `'index'`. The pathname format expo-router returns under the `(tabs)` group is `/fixtures`, `/search`, etc., with the bare `/` when on the home tab. Strict suffix matching is robust to future nested routes (`/fixtures/[id]` would still light up the `fixtures` tab).
7. **`router.navigate` over `router.push`** so retapping a tab doesn't stack duplicate entries.
8. **No `AndroidGlowUnderlay` on the active-label glow.** The brief explicitly invited this call: at 10px the synthesised halo would be visually noisy. Active state is communicated by colour alone on Android, glow is iOS-only via `textShadow*`.
9. **`expo-blur` intensity values picked by feel against the CSS spec, NOT linearly mapped.** The brief warned that CSS `blur(18px)` doesn't map 1:1. Settled on `intensity={40}` for the BottomNav (CSS 18px) and `intensity={50}` for the NotePadBar (CSS 20px). Both feel "moderate dark frosted." Calibrate on-device when Nick reviews — these are first-pass values that should read close enough but may want a nudge.
10. **`vertical_halves` square uses a 4-stop `LinearGradient`** with locations `[0, 0.5, 0.5, 1]` instead of a 2-colour gradient. `expo-linear-gradient` with two stops produces a smooth fade across the box; the source's `linear-gradient(90deg, primary 50%, secondary 50%)` is a hard split. Doubling each colour at 50% reproduces the hard edge. Worth documenting because the same approach will be needed wherever the source uses hard-stop CSS gradients in RN.
11. **The Kit component takes a full `Team` object as a prop, not a code.** Per the brief's clean-separation pattern: `@count/ui` doesn't know about data sources; the app does the resolution via `getTeam(code)` and passes the result. The demo screen does this for every kit.
12. **Manual typed-routes regeneration script.** `expo export` does NOT regenerate `.expo/types/router.d.ts` — only the Metro watcher run by `expo start` does. The cache was stale (still referencing the deleted `explore.tsx`), making `tsc --noEmit` fail on the new route literals. Solution: `apps/mobile/scripts/regen-typed-routes.js` invokes `expo-router/build/typed-routes#regenerateDeclarations` directly. Future phases that touch tab files should `node scripts/regen-typed-routes.js` from `apps/mobile/` before typechecking. Worth a CLAUDE.md note eventually — flagging here for now.

---

## Surprises in the source

- **`kit.jsx` `PlayerKit` uses `fontWeight: 600`.** Phase 1C locked us to weights 400/500 only — overridden to 500 per the brief. Worth knowing that the original prototype reached for a third weight here; if the rendered number ever reads "thinner than expected" against the source, that's why.
- **`kit.jsx` clip-path id strategy** is `kit-${team}-${size}` — would collide if two kits for the same team at the same size appear on one screen (e.g. the source's depth row puts the same team's kit at two sizes, but a future matrix could repeat the same team-size pair). Switched to `useId()` per the brief; matters in any future Matrix-style screen that repeats fixtures.
- **`KitMini` has no `horizontal_band` variant in the source.** It just falls through to the default `bg = k.primary`. Matched the source — no horizontal band reads usefully at 8×9.
- **The source's `Kit` `solid` sleeve logic falls back** to `primary` when no `secondary` is provided. Preserved (`k.secondary || k.primary`).
- **`vertical_halves` body in shirt variant has `bodyFill: 'transparent'` then two overlay rects.** I kept this — there's a difference in how the collar shadow + inner highlight stroke draw over a transparent body vs. a filled one. The source intent is the two halves to show through the body, and the collar/highlight to overlay both. Matches.
- **No source bugs needing notation this phase.** (Phase 1C's `arrow-left` polyline bug stays the only known source bug; the existing comment in `Icon.tsx` documents it.)

---

## TODOs left in code

None — no `// TODO` markers in the diff. The deferred work is tracked by phase, not by inline TODOs:

- **`useNotePad` hook + Zustand/context store** (Phase 5). The `NotePadBar` component file's leading comment reserves the names.
- **Populated NotePadBar state** (Phase 5). `.slip-bar.populated` styling in `styles.css` (lines 1093–1140) is the visual reference. Drop shadow + amber border + amber-gradient icon box + numeric count badge.
- **`NotePadSheet` slide-up modal** (Phase 5). `.slip-sheet` / `.slip-backdrop` are the source reference.
- **`Save to Builders` flow** (Phase 5–6, the actual persistence lands in 6 with Supabase).
- **Real Dashboard screen** (Phase 2B). `(tabs)/index.tsx` is currently the design-primitives demo with the four new sections layered on. Phase 2B replaces the whole file with `<Dashboard />`.
- **Stub screens for fixtures / search / builders / profile** (Phases 2B–5). Each is a one-line `StubScreen` until the real screen lands.
- **Sportmonks ingestion replaces the team list** (Phase 7). The kit data stays hand-maintained per the brief.

---

## Honest visual deltas (source intent vs. what RN renders)

1. **`expo-blur` intensity is calibrated by feel.** First-pass values: BottomNav `intensity={40}`, NotePadBar `intensity={50}`. The CSS spec is `blur(18px)` / `blur(20px)` with `saturate(150%)`. RN expo-blur doesn't honour `saturate` and the intensity scale isn't linear with CSS px. Likely close enough but may need a nudge after Nick eyeballs on real iPhone.
2. **Android backdrop blur falls back to a translucent dark fill.** `expo-blur` documents this. The stacked `LinearGradient` overlay still gives the bar visual separation from content; on Android the bar reads as a translucent dark surface rather than a true frosted blur. Documented in the BottomNav component comment.
3. **Active-tab label glow is iOS-only.** RN has no `text-shadow` Android equivalent; `textShadow*` props only render on iOS. Android active state is colour alone — accepted per the brief.
4. **NotePadBar outer drop shadow is iOS-only.** Source CSS `0 6px 24px rgba(0,0,0,0.30)` → `Platform.select` gives iOS the shadow; Android skips (RN's `elevation` is greyscale + visually noisy at this radius). Reading on Android: bar should still feel "above" content because of the gradient + border, not the shadow. Flag in the Android pass if it reads as detached.
5. **`vertical_halves` square uses a hard-stop 4-colour gradient** (see Decision #10). Matches the source's CSS hard split exactly at the centre; the diagonal direction is `x:0→1, y:0` (horizontal).
6. **NotePadBar position uses `insets.bottom + 70`** for the bottom offset. The brief's heuristic. On iPhone with home indicator (insets.bottom ~34) the bar sits ~104px from the screen bottom edge; on devices with no indicator (insets.bottom 0) it sits 70px from the screen bottom — which is the source's literal `bottom: 78px`. Close enough; a calibrated 78px-from-nav-top-edge would need to read the nav's actual layout height at runtime, which we're deliberately not doing this phase.
7. **Square kit's number text on Android may baseline-shift slightly** because mono numerals + the small inset ring border can interact. Added `includeFontPadding: false` and a hardcoded `lineHeight: 13` on Android to keep numbers centred. Worth a glance during the Android pass.

---

## Verification output

- `pnpm typecheck` — **passes, zero errors.** All 6 packages (tokens, types, api, pattern-engine, ui, mobile).
- `npx expo export --platform ios` — **succeeds, 1451 modules** bundled (was 1466 in Phase 1C — the slight drop reflects removing `explore.tsx`'s dependencies plus tree-shaking of the unused default-tab-bar code paths, partially offset by the new BlurView + safe-area pulls).
- `npx expo export --platform android` — **succeeds, 1447 modules** bundled. No platform-specific resolution errors.
- **No `console.log`** anywhere in `packages/{ui,types,tokens}/src` or `apps/mobile/{app,src}` (`grep -rn "console\.log"` → empty).
- **No emoji** anywhere (`grep -rPn '[\x{1F300}-\x{1FAFF}...]'` → empty).
- **No font weight ≥ 600** anywhere (`grep -rEn "fontWeight: ['\"]?(600|700|800|900|bold|semibold)"` → empty). All font weights go through `typography.weight.regular` / `typography.weight.medium`.
- **No inline `borderWidth: 0.5` or `borderWidth: 1`** in the new code (grep → empty). All hairlines via `StyleSheet.hairlineWidth`.
- **All `@count/ui` imports in app code use the package name**, not relative paths:
  - `apps/mobile/app/(tabs)/_layout.tsx`: `from '@count/ui'`
  - `apps/mobile/app/(tabs)/index.tsx`: `from '@count/ui'` + `from '@count/tokens'`
  - `apps/mobile/src/screens/StubScreen.tsx`: `from '@count/ui'` + `from '@count/tokens'`
- **Stub tabs**: each tab file is a one-line `<StubScreen name="…" />`.

## To do before reviewing on device

- Nothing — bundles cleanly. Pass the diff + summary to Nick, then `npx expo start --tunnel` from `apps/mobile/` for the real iPhone + Android pass.

## After Nick's device review

If anything in the Android pass surfaces a real regression (blur fallback too dim, NotePadBar reading as floating without the iOS shadow, square kit numbers shifted on Android), flag it in conversation as deferred Phase 2A.5 work per the brief.
