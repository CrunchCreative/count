# Phase 4A.2 — Persistent bottom nav + Note Pad bar on every route

Hoisted `BottomNav` and `NotePadBar` from `(tabs)/_layout.tsx` to root
`_layout.tsx` so both pieces of chrome stay mounted across non-tab routes
(specifically `fixture/[id]`, which currently rendered with no bottom
chrome). `AppHeader` stayed scoped to `(tabs)` per decision 13.

## Path chosen — Path A (already)

The pre-existing topology was already friendlier than the brief assumed.
`BottomNav.tsx` in `packages/ui` is fully props-driven — its public surface
is `{ tabs, activeKey, onSelect }` with no internal consumption of Tabs
callback props. The Tabs callback wiring lived inside a `CustomTabBar`
wrapper in `(tabs)/_layout.tsx` that already discarded `BottomTabBarProps`
and read state via `usePathname()` + `useRouter()`.

**That meant Path A, not Path B.** No refactor of `BottomNav.tsx` itself;
no Pressable churn; no react-navigation imports to remove. The hoist became
a near-mechanical move of the wrapper component up one layout level.

## Active-key derivation switched to `useSegments()`

The legacy `activeKeyFromPath(pathname)` used `.endsWith('/fixtures')` etc.
with a fallthrough `return 'index'` for unknown paths. While scoped to
`(tabs)` that was fine — fixture/[id] never entered the function. Lifting
to root means the function fires on every route, and the `'index'`
fallback would have highlighted Home on `fixture/[id]`. The brief
explicitly calls out "no tab should highlight as active on fixture detail."

Replaced with `useSegments()` at root:

```ts
const segments = useSegments();
const inTabs = segments[0] === '(tabs)';
const activeKey = inTabs ? (segments[1] ?? 'index') : '';
```

`segments[1]` is `undefined` on `(tabs)/index` (the dashboard), defaulting
to `'index'`. For `(tabs)/fixtures` it's `'fixtures'`, etc. For
`fixture/[id]` (no group prefix), `segments[0]` is `'fixture'` so `inTabs`
is false and `activeKey` becomes `''` — no `tab.key === ''` match, no
highlight. Same outcome the brief described.

## Tabs navigator — Option 1 (preserved)

Kept the `Tabs` navigator at `(tabs)/_layout.tsx` so per-tab scroll state
is preserved when switching between tabs. Suppressed its default tab bar
two ways:

- `tabBar={() => null}` — replaces the bar UI with nothing.
- `screenOptions={{ tabBarStyle: { display: 'none' } }}` — collapses the
  layout slot so no invisible bar reserves vertical space.

Both belong per the brief.

## Files changed

| File | Lines (after) | Notes |
|---|---|---|
| `apps/mobile/app/_layout.tsx` | 109 | Added `BottomNav` + `NotePadBar` imports, `TABS`/`ROUTE_FOR_KEY` constants, `RootBottomNav` wrapper. Slotted both into the root View between `</ThemeProvider>` and `<NotePadSheet />`. |
| `apps/mobile/app/(tabs)/_layout.tsx` | 41 (down from 91) | Removed `BottomNav`/`NotePadBar` JSX + the `CustomTabBar` wrapper + the `BottomNavTab`/`Href`/`BottomTabBarProps` imports + the path-suffix `activeKeyFromPath` helper. `ScrollProvider` and `TabsAppHeader` stayed. |

No changes to:
- `packages/ui/src/components/BottomNav.tsx` — already props-driven.
- `packages/ui/src/components/NotePadBar.tsx` — no props; mounts identically.
- `packages/ui/src/components/AppHeader.tsx` — unchanged; stays in `(tabs)`.
- Any per-screen scroll-padding constant or screen file.

## SafeArea verification

`useSafeAreaInsets()` is called by both `BottomNav` (for `paddingBottom`)
and `NotePadBar` (for `bottom: insets.bottom + 70`). The brief flagged
this as a potential failure if the `SafeAreaProvider` was scoped to
`(tabs)`. It isn't — `expo-router`'s `ExpoRoot` wraps the entire app tree
in `SafeAreaProvider` automatically (verified at
`node_modules/.pnpm/expo-router@6.0.23/.../build/ExpoRoot.js:77`). Hoist
is safe.

## Mount-order verification (root View, document order)

1. Base tint `View` (`backgroundColor: colors.bg.page`)
2. `RadialBackdrop`
3. `ThemeProvider > Stack` (route content)
4. `RootBottomNav` (`BottomNav` inside, `position: 'absolute' bottom: 0`, z-index 90)
5. `NotePadBar` (`position: 'absolute'`, `bottom: insets.bottom + 70`, z-index 85)
6. `NotePadSheet` (full-screen overlay when open, z-index above both)
7. `StatusBar`

z-indices sit `85 < 90` on the chrome layer, but `NotePadBar` is offset
above `BottomNav` via its `bottom` value (not via z-index — it never
overlaps, it sits above). The sheet's backdrop z-index sits above both
chrome pieces.

## Verification

- `pnpm typecheck` — clean across all six workspace packages.
- `npx expo export --platform ios` — bundled cleanly, 4.08 MB hbc, no
  warnings.
- On-device check via Expo Go: not performed in this pass. Expected
  outcomes per the brief §5: bottom chrome visible on fixture/[id], no
  active highlight on detail route, header still absent on detail route
  (decision 13), per-tab scroll state preserved on tab switches.

## Surprises in the existing topology

One pleasant surprise, one slightly weird thing:

- **Pleasant:** the `CustomTabBar` wrapper in `(tabs)/_layout.tsx` was
  already a 1-line discard of `BottomTabBarProps` (`function CustomTabBar(_: BottomTabBarProps)`).
  Phase 2/3's author had clearly anticipated that the props weren't needed
  and that the bar would eventually want to live outside the Tabs slot.
  Hoisting was a copy-paste.

- **Slightly weird:** the `NotePadBar` was already an out-of-slot child
  of the `(tabs)`-layout flex View (see its file header — Phase 3.5 v2
  history). That was the right shape for ensuring its `position: 'absolute'`
  resolved against measurable bounds. Re-anchoring it at root is the same
  pattern one level up: it's a child of the root `View` (`flex: 1, backgroundColor: colors.bg.page`),
  which also has known measurable bounds. The bar's positioning math
  (`bottom: insets.bottom + NAV_CONTENT_HEIGHT`) carries over unchanged.
