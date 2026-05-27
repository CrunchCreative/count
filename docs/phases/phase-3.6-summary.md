# Phase 3.6 — Summary

App header refinements: bigger logo, transparent-at-rest, scroll-driven blur fade-in.

## What was built

### `@count/ui` — scroll subsystem

- `packages/ui/src/context/ScrollContext.tsx` — **NEW**. `ScrollProvider` + `useScrollY()` hook backed by a single shared `Animated.Value`. Approach (c) from the brief: one value at the (tabs) layout level, every screen writes to it. No register/unregister lifecycle dance. `useScrollY` falls back to a stable no-op `Animated.Value(0)` outside the provider (isolated tests / storybook).

### `@count/ui` — `AppHeader` updates

- `packages/ui/src/components/AppHeader.tsx`:
  - **Logo +30%.** `LOGO_HEIGHT` 32 → 42. Width follows aspect ratio (3508 / 1363 ≈ 2.574), so width ≈ 108px.
  - **`APP_HEADER_CONTENT_HEIGHT` 56 → 72** (+16px, matches the logo growth proportionally).
  - **Background extracted to `Animated.View`**, opacity driven by `scrollY.interpolate({ inputRange: [0, 60], outputRange: [0, 1], extrapolate: 'clamp' })`. The wrapper contains the BlurView (intensity 40, dark tint), the dark vertical gradient, and the hairline bottom border. `pointerEvents="none"` on the wrapper so taps pass through to the foreground row.
  - **Foreground row** (logo Pressable + IconButton row) sits at full opacity outside the animated wrapper.
  - **Outer wrapper** gets `pointerEvents="box-none"` so the transparent header doesn't capture taps that should reach the page content behind it (relevant only at scroll = 0, when the header is fully transparent).
- `packages/ui/src/index.ts` — exports `ScrollProvider`, `useScrollY`, `ScrollContextValue`, `ScrollProviderProps`.

### Tab layout

- `apps/mobile/app/(tabs)/_layout.tsx` — wraps the `<View flex:1>` containing `<Tabs>` + `<NotePadBar>` + `<TabsAppHeader>` in `<ScrollProvider>`. Provider only needs to wrap these three siblings.

### Tab screens — `Animated.ScrollView` + `onScroll` wired to `useScrollY`

- `apps/mobile/app/(tabs)/index.tsx` (Dashboard) — `ScrollView` → `Animated.ScrollView`. Imports `Animated` from `react-native` and `useScrollY` from `@count/ui`. Adds `scrollEventThrottle={16}` + `onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}`.
- `packages/ui/src/components/FixturesList.tsx` — same swap. Hook called inside the component; outside the provider it's a no-op.
- Stub screens (`search.tsx`, `builders.tsx`, `profile.tsx`) — left alone. They use `StubScreen.tsx` which renders a centred `<View>` with no ScrollView, so the header just stays transparent on those tabs. Acceptable behaviour for stubs.

## Decisions reported

1. **Scroll threshold: 60px** (as suggested in the brief). Reads as a natural distance — by the time the user has scrolled past the first card edge, the header is fully opaque. If on-device it reads too short (header opaques too quickly), 80–100 would also be reasonable.

2. **Approach (c)** kept — single shared `Animated.Value` across all tabs. No register/unregister. The brief flagged scroll-value carry-over between tabs as a known risk; in practice each tab starts with a fresh ScrollView at offset 0 and the next `onScroll` immediately overwrites the value. The transient (a fraction of a frame after tab switch) is invisible. If on-device it ends up reading as a flash of full blur on a freshly-switched tab, switch to approach (b) with register/unregister hooks — but try (c) first.

3. **BlurView fading via `Animated.View` wrapper** (the cleaner of the two approaches). Did *not* fall back to `intensity` interpolation. Reasoning: `BlurView` ignores `opacity` on its own style on iOS, but as a *child* of an `Animated.View` whose opacity ramps, the wrapper's compositing affects everything inside including the blur output. This is the documented workaround and should give a smooth fade. If on-device the fade is binary or stuttery, the fallback is to interpolate `intensity` instead — noted in the brief and easy to swap in.

4. **Logo new exact dimensions:** `LOGO_HEIGHT = 42` (was 32, +31.25%), `LOGO_WIDTH ≈ 108.1` (computed from aspect ratio). Reads as proportional to the 72px header content area. `marginLeft: -4` preserved to keep the logo bleeding past the 16px horizontal padding.

5. **`pointerEvents="box-none"` on the AppHeader outer wrapper.** The brief didn't call this out but it's important: at scroll = 0 the header is fully transparent, and without `box-none` the invisible 72px strip at the top of the screen still captures taps. Adding `box-none` means the wrapper itself doesn't capture; only its children (the row containing the logo Pressable + profile IconButton) do. So even when transparent, the logo + profile icon remain tappable but the surrounding empty area passes touches through.

## Decisions not explicit in the brief

1. **No `StubScreen` change.** Brief said "wire its ScrollView here so all stubs get the behaviour for free" — but `StubScreen.tsx` doesn't have a ScrollView (just a centred View). Adding one for the sake of fading the header on stubs felt over-engineered. With no ScrollView the stubs keep `scrollY = 0` and the header stays transparent over them — which actually reads cleanly (radial backdrop visible above the centred stub label).

2. **`ScrollProvider` mounted at (tabs) level rather than root.** It only needs to wrap the AppHeader and the tab screens, not the fixture detail route (which doesn't use the persistent header). Keeping it scoped tight prevents the no-op fallback from being shadowed unnecessarily.

3. **`scrollY` accessed at the top of each screen, no local memoization needed.** `useScrollY()` returns the same `Animated.Value` instance across re-renders (it's a `useRef.current`); the `Animated.event` factory is called on every render but produces equivalent listener wiring, so the prop reference stability concern doesn't apply on the native side.

## Verification

- `pnpm typecheck` — passes across all 6 workspace packages.
- `npx expo export --platform ios` — bundles cleanly. 4.05 MB hbc (no measurable size change from Phase 3.5).
- **Not yet verified on device.** Checklist for the on-device pass:
  - Logo on persistent header visibly larger (~30% bigger than Phase 3.5).
  - Dashboard hero carousel starts at the right vertical position (not crowded, not awkwardly low).
  - At top of Dashboard scroll: header background fully transparent. Radial gradient + hero carousel visible behind the header strip.
  - Scroll down gradually — header dark-glass background fades in smoothly over ~60px.
  - At full scroll: header looks like Phase 3.5 (dark frosted, hairline border, crisp foreground).
  - Scroll back up: fade reverses.
  - Same behaviour on Fixtures tab.
  - Stub tabs: header stays transparent (no ScrollView in StubScreen). Radial gradient visible.
  - Logo + profile icon stay crisp at all scroll positions.
  - `/fixture/[id]`: persistent header NOT shown.
  - Note Pad bar + Bottom Nav: unchanged from Phase 3.5.

## Files changed

```
A packages/ui/src/context/ScrollContext.tsx
M packages/ui/src/components/AppHeader.tsx
M packages/ui/src/components/FixturesList.tsx
M packages/ui/src/index.ts

M apps/mobile/app/(tabs)/_layout.tsx
M apps/mobile/app/(tabs)/index.tsx
```

`git status` left dirty per workflow — Claude Code stops without committing.

## Known risks

1. **BlurView fade quality on iOS.** If the fade reads binary instead of smooth, swap to interpolating `intensity` (typed as `Animated.AnimatedInterpolation<number>`; `expo-blur` accepts an animated intensity prop in recent versions). Code path is well-isolated in `AppHeader.tsx`.

2. **Scroll-value carry-over between tabs.** Mentioned above — should be invisible in practice but warrants checking. If it flashes, switch to per-screen Animated.Values with a register/unregister context.

3. **Header height increase (+16px) might crowd specific screen content.** Dashboard's hero carousel and Fixtures' H1 both compute their top offset from the exported `APP_HEADER_CONTENT_HEIGHT` constant, so they auto-adjust. But if any screen's first element was *visually calibrated* against the old 56 (rather than driven by the constant), it could look off — none observed in this pass, but worth eyeballing.

4. **`pointerEvents="box-none"` on the outer wrapper.** Could in theory let a tap at the top edge of the screen slip past the header to a card behind. In practice the header's row (with logo Pressable + profile IconButton) covers the full content area and *those* children capture touches. The transparent regions to the left/right of the logo and between the row and the safe-area edges have no interactive content behind them on any current screen.
