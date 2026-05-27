# Phase 3.5 — Note Pad bar debug notes

The Note Pad bar regressed across Phase 3 → 3.5 across four attempts. This pass adds debug markers to the bar AND moves it out of the React Navigation tabBar slot, which is the structural change most likely to resolve the chain of regressions.

## What the four attempts had in common

All four kept NotePadBar inside the React Navigation tabBar slot:

```
<Tabs tabBar={() => (
  <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
    <NotePadBar />
    <BottomNav ... />
  </View>
)} />
```

The wrapper View is `position: 'absolute', bottom: 0` with no top/height. Children (NotePadBar, BottomNav) are also absolute. So the wrapper measures as zero-height — which is fine in CSS but **fragile under React Navigation v7's tabBar slot management.** The navigator measures the tabBar component to reserve content area at the bottom of screens; zero-height tabBars trigger fallback behaviour that varies by version.

In Phase 2A this happened to render correctly because there was only the BottomNav inside the slot and it was the bottom-most thing. Phase 3 added NotePadBar to the slot at `bottom: insets.bottom + 70` — anchored against the (zero-height) wrapper's bottom edge. Theoretically this measures from screen bottom; in practice the wrapper's anchor point on iOS doesn't always survive React Navigation's slot positioning intact.

## Structural change applied

NotePadBar now mounts as a direct sibling of `<Tabs>` in `(tabs)/_layout.tsx`, inside the layout's `flex: 1` View:

```tsx
<View style={{ flex: 1 }}>
  <Tabs tabBar={() => <CustomTabBar />} screenOptions={{ headerShown: false }} />
  <NotePadBar />          {/* z-index 85, absolute, bottom: insets + 70 */}
  <TabsAppHeader />       {/* z-index 100, absolute, top: 0 */}
</View>
```

The wrapping View has known measurable bounds (it `flex: 1`s to fill the (tabs) layout area, which is the screen minus the parent Stack's chrome). NotePadBar's `position: 'absolute', bottom: insets.bottom + 70` anchors against this View's bottom edge — which IS the screen bottom — predictably.

`CustomTabBar` is now just `<BottomNav />` (no wrapper). React Navigation's tabBar slot only needs to host the navigation control, not the Note Pad chrome.

## Debug markers added

`packages/ui/src/components/NotePadBar.tsx` carries a `DEBUG = true` flag that toggles:

1. **Distinctive colours on each layer** (visible only while `DEBUG = true`):
   - Outer Pressable: 2px magenta border (`rgba(255,0,255,0.9)`)
   - Inner glass View: cyan fill behind the BlurView (`rgba(0,255,255,0.4)`) — if the BlurView mounts and paints, the cyan is hidden under it; if the BlurView is missing or transparent, the cyan shows through.
   - Content row: yellow tint (`rgba(255,255,0,0.25)`) — confirms the row mounts at expected dimensions.

2. **`console.log` on mount** — prints `insets.bottom` and the computed `bottom-offset` value used for absolute positioning.

3. **`onLayout` callbacks on every layer** — log layer name + measured x/y/w/h. Layers wired:
   - `outer-pressable`
   - `inner-glass`
   - `blur`
   - `gradient`
   - `row`

4. **`onPress` logs** — prints `[NotePadBar] PRESS` to confirm taps reach the handler.

## What the markers tell us on device

When you run with these markers, look in the Metro / Expo Go logs for:

- **Does `[NotePadBar] mount` fire?** If NO → the component isn't rendering at all (parent layout broken). If YES → component mounts; move on.
- **What are the `onLayout` measurements?** Expected for `outer-pressable`: `w ≈ screen_width - 24`, `h = 52`, y at `screen_height - insets.bottom - 70 - 52`. If `w/h` come back 0 or NaN → bar has no measurable bounds; layout chain broken upstream. If `y` is wrong → absolute positioning is anchoring against the wrong ancestor.
- **Do you see the magenta border?** If YES → bar is visible at the position it computes. If NO → the bar IS mounted (per mount log) but rendered off-screen or clipped.
- **Does the cyan fill peek through anywhere?** If YES → the BlurView isn't painting on top, which is the original Phase 3 regression. If NO → blur is working.
- **Tap on the bar — does `[NotePadBar] PRESS` log?** If YES → press wiring is correct. If NO → an overlay sibling is consuming the touch, or pointerEvents is blocking.

## Likely outcomes by hypothesis

**Hypothesis A** (structural fix is correct, bar is just hidden behind something): markers render off the magenta border, mount/layout logs fire, press fires. Result: bar visible AND tappable. Action: peel off the debug markers — set `DEBUG = false` — and call it done.

**Hypothesis B** (bar is now mounting correctly but absolute positioning is still off): magenta border visible at wrong screen position. Layout logs report the wrong `y`. Action: adjust the `bottom` constant or check whether `useSafeAreaInsets()` returns expected values inside this nesting.

**Hypothesis C** (taps still don't reach): bar visible but `[NotePadBar] PRESS` doesn't fire. Action: investigate the AppHeader's z-index or check whether the parent View's pointer-events is blocking. Add `pointerEvents="box-none"` to the parent if needed.

**Hypothesis D** (bar still not rendering): mount log doesn't fire. Action: deeper investigation — `useNotePad()` may be throwing or the parent provider may not be mounted in the tabs subtree. Verify NotePadProvider wraps the tab layout via the root `_layout.tsx`.

## Acceptance / cleanup

When the bar is verified visible AND tappable on device:

1. Flip `DEBUG = false` in `NotePadBar.tsx` — leaves the markers + log code in but inert. (If preferred, strip them out entirely; the diff is small.)
2. Confirm the Phase 3 acceptance checklist still passes (addable pills add legs, count updates, sheet opens via bar tap, etc).

## Files touched

```
M packages/ui/src/components/NotePadBar.tsx     (debug markers + log instrumentation)
M apps/mobile/app/(tabs)/_layout.tsx            (NotePadBar moved out of tabBar slot)
A docs/phases/phase-3.5-debug-notes.md          (this file)
```
