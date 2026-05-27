# Phase 3.6 — App header refinements: bigger logo, transparent-at-rest, scroll-driven blur

## Mission

Three changes to `AppHeader`:

1. **Logo +30%.** Header content height grows proportionally — they scale together.
2. **Transparent background at rest.** The radial backdrop gradient shows through the header when the screen is at the top of its scroll.
3. **Scroll-driven blur.** As the user scrolls, the header's translucent dark-glass surface fades in (matching the `BottomNav` recipe). At full scroll, the header looks like it does today; at top-of-scroll, it's invisible chrome over the gradient.

The behaviour applies on every tab screen (Dashboard, Fixtures, Search, Builders, Profile). Fixture detail (`/fixture/[id]`) is unaffected — it doesn't show the persistent header.

## Out of scope

- Fixture detail route header changes.
- Bottom nav appearance — stays as-is.
- Note Pad bar appearance — stays as-is (it already has the blur recipe).
- Any per-screen scroll-aware behaviour beyond the header blur.

## Vocabulary

No new vocabulary.

## 1. Logo and header height scaling

### Current state

`packages/ui/src/components/AppHeader.tsx` uses `APP_HEADER_CONTENT_HEIGHT = 56` (from `packages/ui/src/index.ts` or wherever the constant lives — check). Logo inside is rendered at whatever its current sizing is.

### Change

The logo gets 30% bigger; the header content height scales proportionally so the logo's vertical breathing room ratio stays the same.

- New constant: `APP_HEADER_CONTENT_HEIGHT = 72` (was 56 — that's roughly +30%).
- Logo inside: scale up the current `height` value by 30%. Width follows aspect ratio (the existing logo asset is wider than tall — the Dashboard's old branding header set this up; the constants `LOGO_NATURAL_W = 3508`, `LOGO_NATURAL_H = 1363` are or were in `apps/mobile/app/(tabs)/index.tsx`'s removed branding block).

### Downstream consequence — every tab screen's `paddingTop`

The screens all compute `paddingTop = insets.top + APP_HEADER_CONTENT_HEIGHT + 16`. Since the constant changes from 56 → 72, all screens will automatically inherit the new offset — no per-screen edits needed *as long as they all reference the exported constant*. Verify each tab screen does. If any hardcoded `56`, fix to use the constant.

## 2. Transparent at rest + scroll-driven blur

### Behaviour summary

| Scroll position | Header background |
|---|---|
| 0px (top of screen) | Fully transparent — radial gradient visible through |
| 0 → 60px | Blur + dark glass surface fading in linearly |
| 60px+ | Fully opaque (matches current Phase 3.5 appearance) |

The header's logo + profile icon always remain fully opaque and crisply readable — only the *background layer* (BlurView + LinearGradient + hairline border) animates.

### Architecture — shared scroll Animated.Value

Each tab screen owns a `ScrollView`. We need a single `Animated.Value` shared between the screen's `ScrollView.onScroll` and the `AppHeader`'s background interpolation. Two options:

**(a) Per-screen Animated.Value, prop-passed to AppHeader.** Each tab screen renders its own `<AppHeader scrollY={scrollY} />`. But `AppHeader` is mounted at the `(tabs)/_layout.tsx` level, not per-screen — so this doesn't fit cleanly.

**(b) Shared context — `ScrollContext`.** A small context providing `{ scrollY: Animated.Value, register: (value) => void }`. Each screen creates its own `Animated.Value` via `useRef(new Animated.Value(0)).current`, registers it on focus, unregisters on blur. The `AppHeader` reads whichever value is currently registered.

**(c) Single root Animated.Value in a context, every screen writes to the same one.** Simpler — no register/unregister dance. The active screen's `onScroll` updates the value; on screen change, the new screen's onScroll takes over. Brief moment where the value reflects the previous screen's position until the new one scrolls, but in practice each screen-change resets visible scroll to 0 anyway and the user perceives nothing.

**Recommended: (c).** Less plumbing, no lifecycle hooks needed. The trade-off — value carries between screens — is invisible to the user.

### Implementation — `ScrollContext`

New file: `packages/ui/src/context/ScrollContext.tsx`:

```ts
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { Animated } from 'react-native';

export interface ScrollContextValue {
  scrollY: Animated.Value;
}

const NO_OP_SCROLL: ScrollContextValue = {
  scrollY: new Animated.Value(0),
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  return (
    <ScrollContext.Provider value={{ scrollY }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollY(): Animated.Value {
  const ctx = useContext(ScrollContext);
  return ctx?.scrollY ?? NO_OP_SCROLL.scrollY;
}
```

### Mounting `ScrollProvider`

Wrap the `<View style={{ flex: 1 }}>` inside `(tabs)/_layout.tsx` with `<ScrollProvider>`. Place it *inside* `NotePadProvider` if that's at the root, or at the tab layout level — either works. The provider only needs to wrap the AppHeader + the tab screens.

### Tab screen integration

Each tab screen's ScrollView needs to update `scrollY` on scroll. Pattern:

```tsx
import { useScrollY } from '@count/ui';
import { Animated } from 'react-native';

export default function HomeScreen() {
  const scrollY = useScrollY();
  return (
    <Animated.ScrollView
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      contentContainerStyle={{ /* existing padding */ }}
    >
      {/* content */}
    </Animated.ScrollView>
  );
}
```

`Animated.ScrollView` is a drop-in replacement for `ScrollView` from `react-native`. The `useNativeDriver: true` is critical for smooth scrolling; `scrollEventThrottle: 16` matches 60fps.

Tab screens to update:
- `apps/mobile/app/(tabs)/index.tsx` (Dashboard — already has a ScrollView, replace it with Animated.ScrollView)
- `apps/mobile/app/(tabs)/fixtures.tsx` — but the actual ScrollView lives inside `FixturesList`, so the change is *there*, see below.
- `apps/mobile/app/(tabs)/search.tsx`, `builders.tsx`, `profile.tsx` — stub screens. If they don't currently have a ScrollView, leave them alone (header stays transparent on stubs is fine). If they do, wire up.
- `apps/mobile/src/screens/StubScreen.tsx` — if this is what the stub tabs render, wire its ScrollView here so all stubs get the behaviour for free.

For `FixturesList`: the component itself owns its ScrollView. Update `packages/ui/src/components/FixturesList.tsx` to use `Animated.ScrollView` and the `useScrollY` hook internally. Since `useScrollY` falls back to a no-op `Animated.Value` outside the provider, this is safe in isolation.

### AppHeader background animation

In `AppHeader.tsx`:

- Import `Animated` from `react-native` and `useScrollY` from the context.
- Compute interpolated opacity from `scrollY`:
  ```ts
  const bgOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  ```
- The header's background layer (BlurView + LinearGradient + hairline bottom border) should be wrapped in an `<Animated.View>` with `style={{ opacity: bgOpacity, ...absoluteFill }}`.
- The logo + profile icon row sit *above* this animated layer at the same `position: 'absolute'` level (or inside the AppHeader's main flex container), unaffected by the opacity animation.

#### BlurView opacity gotcha

`expo-blur`'s `BlurView` ignores `opacity` on its own style on iOS (the blur effect itself doesn't fade — it's all-or-nothing). To work around: wrap the BlurView in an `Animated.View` with the interpolated opacity; the wrapper's opacity affects everything inside including the blur view's rendered output.

If on testing this still doesn't fade smoothly on iOS, fall back to interpolating `intensity` instead:

```ts
const blurIntensity = scrollY.interpolate({
  inputRange: [0, 60],
  outputRange: [0, 40],
  extrapolate: 'clamp',
});
// <BlurView intensity={blurIntensity as unknown as number} ... />
```

But this requires the BlurView to accept an animated value as a prop — verify before committing to this approach.

The cleaner path is the `Animated.View` wrapper. Try that first.

### What the animated background contains

The animated background wrapper contains, in order:

1. `<BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />`
2. `<LinearGradient ...same recipe as NotePadBar... style={StyleSheet.absoluteFill} />`
3. Hairline bottom border (a 1px-tall View at `bottom: 0`).

The logo + profile icon row is OUTSIDE this animated wrapper, rendered at full opacity always.

### Header structure

```tsx
return (
  <View style={positioningStyle}>
    {/* Animated background — fades in as user scrolls */}
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgOpacity }]}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient ... style={StyleSheet.absoluteFill} />
      <View style={hairlineBorderStyle} />
    </Animated.View>
    {/* Foreground — always crisp */}
    <View style={contentRowStyle}>
      <Image source={logo} style={logoStyle} />
      <IconButton icon="user" onPress={onPressProfile} />
    </View>
  </View>
);
```

`positioningStyle` retains `position: 'absolute'`, `top: 0`, `left: 0`, `right: 0`, `height: insets.top + APP_HEADER_CONTENT_HEIGHT`, `zIndex: 100`. Background was previously baked in here — move it into the Animated.View.

## Files touched

```
packages/ui/src/context/ScrollContext.tsx              (NEW)
packages/ui/src/components/AppHeader.tsx               (background extracted to Animated.View, scroll-driven opacity, logo size +30%)
packages/ui/src/components/FixturesList.tsx            (ScrollView → Animated.ScrollView, onScroll wired to useScrollY)
packages/ui/src/index.ts                               (export ScrollProvider, useScrollY; updated APP_HEADER_CONTENT_HEIGHT)

apps/mobile/app/(tabs)/_layout.tsx                     (wrap with ScrollProvider)
apps/mobile/app/(tabs)/index.tsx                       (ScrollView → Animated.ScrollView, onScroll wired)
apps/mobile/src/screens/StubScreen.tsx                 (if it has a ScrollView, wire up — otherwise leave)
```

## Carry-forward rules

1. **Pressable style discipline.** Static style objects. The Phase 3.5 v3 NotePadBar fix is the most recent example — if a Pressable's style array contains layout props (height, position) inline, RN can drop them. Always extract to a single static style object.
2. **Hairlines** via `StyleSheet.hairlineWidth`.
3. **No emoji.** SVG icons only.
4. **No new libraries.** RN's `Animated` is built in; no `react-native-reanimated` use needed here (the existing codebase has it as a transitive dep but we're sticking to vanilla `Animated` for predictability).

## Verification before declaring done

- `pnpm typecheck` passes across all packages.
- `npx expo export --platform ios` bundles cleanly.
- Verified on real iPhone via Expo Go:
  - Logo on persistent header visibly larger (~30% bigger than Phase 3.5).
  - Header content area roughly proportionally taller — Dashboard's hero carousel starts at the correct vertical position (not too close to the header, not awkwardly far).
  - On the Dashboard, at top of scroll: header background is transparent. The radial gradient and the hero carousel beneath are visible through the header area.
  - Scroll down gradually. The header's dark-glass background fades in smoothly over ~60px of scroll.
  - At full scroll: header looks identical to Phase 3.5 — dark frosted, hairline border at the bottom, logo + profile icon crisp on top.
  - Scroll back to top: background fades back out.
  - Same behaviour on Fixtures tab when scrolling the fixture list.
  - Stub tabs (Search, Builders, Profile) — header behaviour is acceptable (either always transparent if they don't scroll, or fades correctly if they do).
  - Logo and profile icon remain fully opaque + crisp at all scroll positions.
  - Navigating to `/fixture/[id]` — persistent header is NOT shown (matches Phase 3.5).
- `git status` returns *nothing to commit, working tree clean*.

## Known risks

1. **BlurView fading on iOS.** `expo-blur` doesn't always honour opacity changes cleanly. If wrapping in `Animated.View` produces a janky fade (e.g. binary on/off rather than smooth), try the `intensity` interpolation fallback noted above.
2. **Scroll value carry-over between tabs.** Approach (c) shares one `Animated.Value` across all tabs. If user scrolls down on Dashboard and switches to Search, the value still reads ~200px, so Search would show full blur until its own scroll resets to 0. Test: does this look weird in practice? If yes, switch to approach (b) with register/unregister. If acceptable (Stub screens are probably mostly empty), leave as (c).
3. **Header height change cascading layout.** APP_HEADER_CONTENT_HEIGHT 56 → 72 = +16px. Some screens may have first-element placement that looked correct at 56 and now looks weird. Adjust the +16 padding constant in screen ScrollView's `contentContainerStyle.paddingTop` if it overshoots.
4. **Animated.ScrollView wraps a native component.** Most ScrollView props pass through but a few don't. If existing onScroll handlers exist in any screen, they need merging with the `Animated.event` listener — usually done via `useNativeDriver: false` and a JS listener, OR using `Animated.event`'s second arg for a JS callback alongside the native one. Test that any existing logic still works.

## Open decisions for Claude Code to report

- **Scroll threshold value.** Brief says 60px; report if a different number reads better on device.
- **Approach choice** (b vs c). Default is (c). Report if you changed it.
- **BlurView fading approach.** `Animated.View` wrapper or `intensity` interpolation. Report which worked.
- **Logo new exact dimensions.** Report the height value used.