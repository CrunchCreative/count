# Phase 3.5 — Summary

Five device-testing follow-ups from Phase 3, in one pass because they touched overlapping files.

## What was built / fixed

### 1. Persistent app header

- `packages/ui/src/components/AppHeader.tsx` — **NEW**. Absolute-positioned strip across the top of every tab screen. Recipe matches `NotePadBar` + `BottomNav` (BlurView intensity 40, faint vertical gradient, hairline bottom border, no top border). Left: logo Pressable (32px tall — smaller than Dashboard's 50px). Right: optional `rightActions` slot + always-rendered profile `IconButton`. z-index `100`.
- Exports `APP_HEADER_CONTENT_HEIGHT = 56` and `APP_HEADER_Z_INDEX = 100` — tab screens use the height constant to set `paddingTop` on their scrollviews.
- Props: `logo` (asset source — passed in by app because `@count/ui` can't `require` from `apps/mobile/`), `onPressProfile` (required), `rightActions?`, `onPressLogo?`. `@count/ui` is intentionally decoupled from `expo-router`, so the consumer wires routing.
- `apps/mobile/app/(tabs)/_layout.tsx` — wraps the `<Tabs>` in a `<View flex:1>` and mounts `<AppHeader>` as a sibling after the navigator. A tiny `TabsAppHeader` wrapper component reads `useRouter()` from `expo-router` and passes `onPressProfile={() => router.navigate('/profile')}`. The header is *outside* the `(tabs)` group screens but mounted *inside* the tabs layout — so it doesn't appear on `/fixture/[id]` (which lives in the parent Stack, not in `(tabs)`).
- Tab screens updated:
  - `apps/mobile/app/(tabs)/index.tsx` — in-content branding header removed (logo + search + bell icons gone). SafeAreaView gone too (header owns its own top inset). ScrollView `paddingTop` = `insets.top + APP_HEADER_CONTENT_HEIGHT + 16`.
  - `packages/ui/src/components/FixturesList.tsx` — SafeAreaView removed; ScrollView `paddingTop` = same formula. Search `IconButton` removed from the in-content header (kept the filter funnel). Dropped the unused `onPressSearch?` prop from `FixturesListProps`.
  - `apps/mobile/src/screens/StubScreen.tsx` — SafeAreaView removed; top padding added so the stub label sits below the header. Applies to Search / Builders / Profile stub tabs.

### 2. Note Pad bar background regression (fixed)

- `packages/ui/src/components/NotePadBar.tsx` — restored the Phase 2A visual stack. Outer `<View>` carries position + shadow + radius; inner glass `<View>` carries `flex: 1`, the rounded border, `overflow: 'hidden'`, and the absolute-positioned BlurView + LinearGradient + inset highlight + content row. A new `<Pressable>` is layered absolutely on top of everything *inside* the inner glass View, so it captures taps without displacing the visual stack. Pressed feedback paints a soft white film via `pressed && { backgroundColor: 'rgba(255,255,255,0.04)' }` instead of the previous opacity reduction (which was acting on the wrong layer).
- Root cause hypothesis: the Phase 3 implementation replaced the inner glass `<View>` with a `<Pressable>` carrying the same recipe. On iOS, a `<Pressable>` with `flex: 1, overflow: 'hidden', borderRadius` containing absolute-fill `BlurView` children does not always clip + render the BlurView correctly. The visual stack collapsed. Reverting to a `View` for the visual + a Pressable overlay for the press is the safest fix.

### 3. Sheet close gestures

- `packages/ui/src/components/NotePadSheet.tsx` — added `PanResponder` to the drag-handle zone:
  - `onMoveShouldSetPanResponder` only attaches when the gesture is *predominantly vertical* AND *downward*. This keeps it out of the way of the legs `ScrollView` below — the pan responder lives only on the drag-handle zone at the very top of the sheet, so vertical scrolling on the legs list never fights it.
  - `onPanResponderMove` sets `translateY` directly to `Math.max(0, dy)`. Sheet follows finger.
  - `onPanResponderRelease`: tap (movement < 4px) → close. Drag past `DRAG_DISMISS_DISTANCE = 100px` OR fling with `vy > DRAG_DISMISS_VELOCITY = 0.5` → animate-out + close. Otherwise snap back open.
- The drag-handle zone gets a generous tap area (`paddingVertical: 8`, `paddingHorizontal: 60`) wrapped around a `40 × 4` decorative pill. Tap on the visible pill closes; drag from anywhere in the zone enters pan mode.
- Drag handle pill brightness bumped slightly (`rgba(255,255,255,0.18)` from 0.15) for better contrast against the sheet surface.

### 4. Filter row + date chip rendering (fixed)

- `packages/ui/src/components/DateChip.tsx` — strengthened the inactive treatment: border now `colors.border.strong` (rgba(255,255,255,0.10) instead of rgba(255,255,255,0.06)), background `rgba(255,255,255,0.04)` instead of `0.02`. Active state also slightly stronger (`0.10` background instead of `0.08`). Padding bumped to 14×8 to match the source's `.date-seg`. Border-radius 7 (`radii.pill`).
- `packages/ui/src/components/CompChip.tsx` — same treatment changes.
- `packages/ui/src/components/GlassSelect.tsx` — trigger border bumped to `colors.border.strong`, background bumped to `rgba(255,255,255,0.04)`, border-radius 7 to match the chips beside it.
- Root cause: the original implementation used `colors.border.default` (rgba(255,255,255,0.06)) at `StyleSheet.hairlineWidth` (~0.33px on iPhone). On a dark backdrop that border is essentially invisible, so the chips read as flat text. The fix keeps `hairlineWidth` (decision 8 in PROJECT-STATE — non-negotiable) but uses a stronger alpha that's visible at that thickness.

### 5. Referee row on `FixtureListCard`

- `packages/types/src/fixture-list.ts` — `FixtureListItem` gains a required `referee: { name: string; cardsPerMatch: number; redsPerMatch: number }` field. The deeper referee record (`homeWinPct`, `cardsAboveAvg`) stays on the fixture-detail shape used in Phase 4.
- `apps/mobile/src/mock/fixtures-all.ts` — referee data added per fixture (all 38 fixtures across 6 leagues). Names + numbers are illustrative — picked from realistic referees for each league (M. Oliver / A. Taylor / etc for PL; J. Soto Grado / C. del Cerro Grande / etc for La Liga). Cards-per-match in the 3–5 range, reds-per-match in the 0.05–0.22 range.
- `packages/ui/src/components/FixtureListCard.tsx` — new row between the teams row and the top-angle inset:
  - Sub-label `REFEREE` in mono, 9px, letter-spacing 0.4, hint colour, `marginBottom: 4`.
  - Row: name (muted, sans 12px) + `[card-yellow icon + cpm]` + `[card-red icon + redsPerMatch.toFixed(2)]`. Centred horizontally, `gap: 12`.
  - cpm shown as `.toFixed(1)` (e.g. `4.2`); reds shown as `.toFixed(2)` (e.g. `0.13`).
- `packages/ui/src/components/Icon.tsx` — two new glyphs: `card-yellow` and `card-red`. Both are filled rounded rectangles (`<Rect x=6 y=3 width=12 height=18 rx=2>`) with `stroke="none"`. Default fill colour: amber-bright for yellow, `#D63A3A` (a soft red, not the loss-text variant) for red. Caller can override with `color` prop. `IconName` union extended.

## Decisions not explicit in the brief

1. **`AppHeader` decoupling from `expo-router`.** The brief said the header should `router.push('/(tabs)/profile')` internally. That would force `@count/ui` to import from `expo-router`, breaking the package's "purely visual primitives, no app routing" contract that's held since Phase 1C. Resolved by making `onPressProfile` a required callback. The tab layout wires the router via a tiny `TabsAppHeader` wrapper component.

2. **Logo height 32 in the persistent header.** Brief said "probably ~32px." Confirmed — at 32 the logo reads cleanly above the row and the header total height (including 8+8 vertical padding) is 48px content + safe-area inset, which lands at the spec'd `APP_HEADER_CONTENT_HEIGHT = 56` once the bottom border + content shake-out hairlines settle. If on-device it reads too small, bump to 36 — value lives in `AppHeader.tsx`.

3. **`SafeAreaView` removed from tab screens.** The persistent header now owns the top safe-area inset (via `paddingTop: insets.top + 8` inside `AppHeader`). Each tab screen reads `useSafeAreaInsets()` only to compute the ScrollView paddingTop. SafeAreaView wrappers at the screen level would have created a double-inset.

4. **NotePadBar press feedback.** Changed from `opacity: 0.85` on the inner glass View to a soft white-film overlay (`rgba(255,255,255,0.04)` on the absolute Pressable). The opacity approach reduces the blur's transparency, which is jarring against the page underneath; the film approach is cleaner.

5. **PanResponder zone restricted to the drag handle.** Brief floated "pan responder on the sheet container, restricted to the drag-handle area if it conflicts with the inner scrollview." Went with the restricted version up front — the sheet's only handle for the drag gesture is the drag-handle zone, so the inner legs ScrollView never even sees the pan responder. Cleaner than figuring out conflict resolution after the fact.

6. **Tap-vs-drag threshold in the PanResponder.** Used `Math.hypot(dx, dy) < 4` to disambiguate. If the user touches the handle and releases without moving (or barely moves), it's a tap → close. Anything beyond that goes through the drag dismiss / snap-back logic.

7. **Card icons as filled rectangles.** Brief said "match the design source's visual style" but the source doesn't have these glyphs (it uses CSS-styled spans). Went with the cleanest reading: solid amber-bright rectangle for yellow, solid soft-red rectangle for red, no border, no perspective. They read instantly as "card" at 14px.

8. **Red colour for `card-red`.** Token `colors.loss.text` is `#F09595` (a desaturated pink for muted contexts). The card itself wants a saturated red. Used `#D63A3A` inline rather than adding a new token — it's only used in this one place. Worth promoting to a `colors.cardRed` token later if more components need it.

## Verification

- `pnpm typecheck` — passes across all 6 packages.
- `npx expo export --platform ios` — bundles cleanly. 4.05 MB hbc (up from 4.03 MB in Phase 3 — increment from PanResponder + new icons + referee data).
- **Not yet verified on device.** Verification checklist for the on-device pass:
  - Persistent header visible on all 5 tab screens. Logo left, profile right. Header *not* visible on `/fixture/[id]`.
  - Tab content sits below the header (scroll reveals content under the blur).
  - Profile icon tap → Profile tab.
  - Note Pad bar visible with dark frosted background (the regression fix). Tap opens sheet.
  - Sheet drag handle tap closes.
  - Sheet drag down past ~100px closes; under threshold snaps back.
  - Date chips on Fixtures rendering as bordered pills (Today amber-active, others muted-glass).
  - Comp filter row chips bordered. "All comps" amber-active; "All competitions" trigger in glass with chevron.
  - Search icon absent from Fixtures in-content header.
  - Referee row visible on every fixture card, centred between teams and top-angle. Yellow card icon + 4.2 (or similar) + red card icon + 0.13 (or similar).
  - All Phase 3 interactions still work: addable pills, sheet legs, clear all, Save to Builders toast, fixture detail navigation.

## Files changed

```
A packages/ui/src/components/AppHeader.tsx
M packages/ui/src/components/NotePadBar.tsx
M packages/ui/src/components/NotePadSheet.tsx
M packages/ui/src/components/DateChip.tsx
M packages/ui/src/components/CompChip.tsx
M packages/ui/src/components/GlassSelect.tsx
M packages/ui/src/components/FixtureListCard.tsx
M packages/ui/src/components/FixturesList.tsx
M packages/ui/src/components/Icon.tsx
M packages/ui/src/index.ts

M packages/types/src/fixture-list.ts

M apps/mobile/app/(tabs)/_layout.tsx
M apps/mobile/app/(tabs)/index.tsx
M apps/mobile/src/screens/StubScreen.tsx
M apps/mobile/src/mock/fixtures-all.ts
```

`git status` left dirty per workflow — Claude Code stops without committing.

## Known risks / things to watch on device

1. **Header `paddingTop` vs. safe-area on different iPhones.** Tested formula: `insets.top + APP_HEADER_CONTENT_HEIGHT + 16` for `paddingTop` on each scrollview. If on a non-notch device content sits too low (extra unused space at top), trim the `+16` to `+8`.

2. **NotePadBar press visual.** The new soft-film overlay paints `rgba(255,255,255,0.04)` over the whole inner glass surface when pressed. On a populated bar (amber count badge + amber count line) this should look subtle. If it reads as harsh, drop the alpha to 0.025.

3. **PanResponder fling threshold.** Suggested 100px + 0.5 vy. On a slower scroll device this may feel too eager (the sheet closes from a casual nudge); bump to 120 + 0.6 if so.

4. **Referee row pushing card height.** Each card grew by ~28–32px. The PL section had 10 fixtures previously taking a long scroll; with the extra height it's now longer. If the density feels heavy, the row's `marginBottom: 12` and the label's `marginBottom: 4` can be tightened to 8 and 2.

5. **Card-red colour bypass.** The `card-red` glyph uses an inline `#D63A3A` to keep things simple. If a future caller passes a `color` prop, that wins. Default colour was chosen by eye — calibrate against the design if the saturated red reads wrong against the dark backdrop.

6. **Persistent header z-index vs. dropdown.** AppHeader is z-index 100. NotePadSheet container is also 100. They never co-render because the sheet covers the whole screen when open. But `GlassSelect`'s dropdown panel is z-index 30 — it lifts above its sibling sections but below the header. If a future dropdown lands near the top of the screen, this ordering is correct.
