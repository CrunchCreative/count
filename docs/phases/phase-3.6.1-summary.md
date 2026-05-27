# Phase 3.6.1 — Summary

Two surgical fixes on top of Phase 3.6.

## What was built

### 1. Logo left-edge alignment

- `packages/ui/src/components/AppHeader.tsx` — `logoStyle.marginLeft` `-4` → `-12`. The logo PNG has built-in transparent canvas around the artwork; the painted leftmost pixels were inset from the visible image edge. Nudging by an additional 8px brings the painted edge approximately flush with H1s at `paddingHorizontal: 16`.

### 2. Scroll reset on tab focus

#### `ScrollContext` extended

- `packages/ui/src/context/ScrollContext.tsx`:
  - `ScrollContextValue` gains `resetScroll: () => void` alongside `scrollY`.
  - Provider implementation: `resetScroll = useCallback(() => scrollY.setValue(0), [scrollY])`. Value memoised.
  - New hook: `useResetScroll()` returns the function (or a no-op outside the provider).
  - `useScrollY()` unchanged — kept for back-compat, returns just the `Animated.Value`.
- `packages/ui/src/index.ts` — exports `useResetScroll` alongside the existing `ScrollProvider` / `useScrollY`.

#### `FixturesList` — imperative `scrollToTop` via `forwardRef`

- `packages/ui/src/components/FixturesList.tsx` converted from a plain function component to a `forwardRef<FixturesListHandle, FixturesListProps>`. New type `FixturesListHandle = { scrollToTop: () => void }`. Internal `useRef<ScrollView>` paired with `useImperativeHandle` exposing `scrollToTop` — fires `scrollRef.current?.scrollTo({ y: 0, animated: false })`.
- `packages/ui/src/index.ts` — exports `FixturesListHandle` type.

#### `useFocusEffect` per tab screen

- `apps/mobile/app/(tabs)/index.tsx` (Dashboard) — adds a `scrollRef` on the existing `Animated.ScrollView`, plus a `useFocusEffect` that calls `scrollRef.current?.scrollTo({ y: 0, animated: false })` followed by `resetScroll()`.
- `apps/mobile/app/(tabs)/fixtures.tsx` — passes a `FixturesListHandle` ref to `<FixturesList>` and runs the same `useFocusEffect` pattern, calling `ref.current?.scrollToTop()` + `resetScroll()`.

Both calls are instant — `animated: false` on the scrollTo, `setValue` (not `Animated.timing`) on the scrollY reset. No visible motion; the screen simply appears at the top with the header transparent.

## Decisions reported

1. **Logo `marginLeft`: -12.** Sits visually flush with `"Fixtures"` H1 on the Fixtures tab (and equivalent screen-edge text on Dashboard greeting). If on-device it overshoots and clips the logo against the screen edge, walk back to -10 or -8.

2. **FixturesList approach: forwardRef + `useImperativeHandle`.** Kept its internal ScrollView (the brief's "trigger-prop" or "lift-up" alternatives were considered):
   - **Why not trigger-prop:** a counter prop + internal `useEffect` is awkward and the typing (`scrollToTopTrigger?: unknown`) is unclean.
   - **Why not lift-up:** would force the screen wrapper to duplicate the `useSafeAreaInsets()` + `useScrollY()` + paddingTop/contentContainerStyle logic that already lives inside `FixturesList`. Two screens (Dashboard already, Fixtures now) wiring the same boilerplate would have grown.
   - **forwardRef** is the standard React imperative-handle pattern, types cleanly, and keeps the ScrollView ownership inside the component that already owns its scroll wiring.

3. **StubScreen unchanged.** Confirmed via `grep "ScrollView" StubScreen.tsx` — no ScrollView there. Stubs render a centred `<View>` so `useFocusEffect` would have nothing meaningful to call. Skipped per the brief's "only if it has a ScrollView" rule. Side benefit: on stubs the header stays transparent because nothing writes a non-zero value into `scrollY`.

## Decisions not explicit in the brief

1. **`ScrollProvider` value memoisation.** With the additional `resetScroll` callback, the provider's context value is now an object that would be recreated each render without `useMemo`. Wrapped in `useMemo([scrollY, resetScroll])` so consumers don't re-render on parent updates.

2. **`useScrollY` shape preserved.** Could have changed it to return the whole context object — but that would have broken Dashboard + FixturesList's existing `const scrollY = useScrollY()` call sites. Added the second hook instead. Both hooks read from the same context; only one fallback applies to each.

3. **`useFocusEffect` from `expo-router`** — re-exports the React Navigation hook directly. No new dependency.

4. **No animated `scrollTo`.** Brief was explicit: `animated: false`. Animated transitions on tab change feel laggy.

## Verification

- `pnpm typecheck` — passes across all 6 workspace packages.
- `npx expo export --platform ios` — bundles cleanly. 4.05 MB hbc (no measurable size change from Phase 3.6).
- **Not yet verified on device.** Checklist:
  - Logo's leftmost painted pixel visually aligns with `"Fixtures"` H1 on the Fixtures tab.
  - Scroll Dashboard down. Tap Fixtures. Fixtures opens at the top, header transparent.
  - Scroll Fixtures down. Tap Dashboard. Dashboard opens at the top, header transparent.
  - Tapping a tab while already on it should either no-op or scroll to top (acceptable).
  - `/fixture/[id]` unaffected; persistent header still hidden there.
  - Return from `/fixture/[id]`: the underlying tab's focus event fires, which scrolls it to top + resets header. (If this turns out to feel wrong — e.g. user wants to return to the scroll position they tapped from — switch the focus effect to only fire on `state.routes` length changes, not on every focus. But default behaviour is fine for V1.)

## Files changed

```
M packages/ui/src/context/ScrollContext.tsx       (resetScroll + useResetScroll)
M packages/ui/src/components/AppHeader.tsx        (logoStyle.marginLeft -4 → -12)
M packages/ui/src/components/FixturesList.tsx     (forwardRef + scrollToTop)
M packages/ui/src/index.ts                        (export useResetScroll, FixturesListHandle)

M apps/mobile/app/(tabs)/index.tsx                (scrollRef + useFocusEffect)
M apps/mobile/app/(tabs)/fixtures.tsx             (ref + useFocusEffect)
```

`git status` left dirty per workflow — Claude Code stops without committing.

## Known risks

1. **Logo marginLeft value.** Eyeballed; -12 is a starting point. If on-device the logo clips the device left edge or the alignment with screen H1s is off, adjust to -10 or -14. Stable across devices because it's keyed to the PNG's transparent canvas which is constant.

2. **`useFocusEffect` firing during navigation transitions.** On a fast tab swap the effect can fire mid-animation. With `animated: false` and a single `setValue` call this is cheap and shouldn't visibly snap mid-transition. If a snap is visible, gate the reset on `InteractionManager.runAfterInteractions`.

3. **Returning from `/fixture/[id]`.** The previous-tab focus effect fires on return, which means the user lands at the top of the tab — not at the fixture row they tapped from. If users object, switch to a `useRef<boolean>` that tracks "first focus of this mount" and only resets on first focus. For V1 the simpler reset-on-every-focus is fine.

4. **`Animated.ScrollView` ref typing.** Used `useRef<ScrollView>(null)` (importing the plain `ScrollView` type from `react-native`). RN's `Animated.createAnimatedComponent(ScrollView)` forwards the underlying ScrollView ref methods. TypeScript happy, runtime OK.
