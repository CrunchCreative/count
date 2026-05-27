# Phase 3 — Summary

## What was built

### `@count/types`

- `packages/types/src/leg.ts` — new. `LegTier` (`'teal' | 'amber' | 'muted'`) and `Leg` (the unit added to / removed from the Note Pad — `id`, `fixtureId`, `threshold`, `hits`, `total`, `tier`, `title`, optional `reason`, reserved `odds?: never`).
- `packages/types/src/fixture-list.ts` — new. `FixtureListItem` (the cardinal record on the Fixtures-list screen — `id`, `league`, `kickoff`, `venue`, `home`, `away`, `signal`, `topAngle: { threshold, hits, title, tier }`) and `FixturesByLeague = Record<string, FixtureListItem[]>`.
- `packages/types/src/index.ts` — re-exports `Leg`, `LegTier`, `FixtureListItem`, `FixturesByLeague`.

### Mobile mock layer

- `apps/mobile/src/mock/fixtures-all.ts` — new. Typed port of `FIXTURES_ALL` (docs/design-source/the-count-v2/project/data.js lines 287–338). 6 leagues × 3–10 fixtures each. The source keys fixtures by league without a per-record `league` field; here we inject it up front via a private `RAW: Record<string, Omit<FixtureListItem, 'league'>[]>` table then map → `FixtureListItem`. Exposes:
  - `FIXTURES_ALL: FixturesByLeague`
  - `FIXTURES_BY_ID: Record<string, FixtureListItem>` (flat lookup for the route stub).

### `@count/ui` — Note Pad subsystem (all new)

- `packages/ui/src/context/NotePadContext.tsx` — `NotePadContext`, `NotePadProvider`, `useNotePad`. Hook returns a `NO_OP_NOTEPAD` shape when called outside the provider (isolated tests / storybook don't crash and render correctly as an empty-pad state). State methods: `addLeg` (idempotent), `removeLeg`, `toggleLeg`, `clearAll`, `isInPad`. Open/close lives in the provider too: `isOpen`, `open`, `close`. `useMemo` on the value, `useCallback` on each method — no unnecessary re-renders for consumers.

- `packages/ui/src/components/NotePadSheet.tsx` — modal bottom sheet, mounted once at root layout (`isOpen === false` → returns `null`, so its constant mounting is cheap). Hand-rolled, no `@gorhom/bottom-sheet` dep (decision below). `Animated.timing` slide-up + fade backdrop, `useNativeDriver: true`. iOS `BlurView intensity=60` + LinearGradient layered base (Android fall-through per gotcha #3). Header has `Note Pad` H3 + count + `Clear all` (disabled at 0 legs). Scrollable leg list (or empty state copy). Footer caption "Save legs as a builder to compare against future fixtures." above the amber `Save to Builders` button — `disabled` at 0 legs, on press fires an inline toast "Builders coming soon" via `setShowToast` + `setTimeout` (no new toast dep). Backdrop tap closes. z-index 99 (backdrop) + 100 (sheet) sit above `BottomNav` (90) and `NotePadBar` (85).

- `packages/ui/src/components/NotePadLegRow.tsx` — row primitive used inside the sheet. Display-only SafePill + title/reason stack + remove-X button. Hairline-bordered glass inset.

- `packages/ui/src/components/NotePadBar.tsx` — extended from Phase 2A. `pointerEvents="none"` removed; wrapped content in a `<Pressable onPress={open}>` that fires `useNotePad().open()`. Count line now reads `{n} {legs|leg}` (singular at 1, plural otherwise — `0 legs` when empty). Icon-well shows the layers icon when empty, an amber mono count badge when populated. Right-side chevron rotates between `chevron-up` (closed) and `chevron-down` (open). z-index 85, offset `insets.bottom + 70` preserved (gotcha #6).

### `@count/ui` — `SafePill` extension

- `packages/ui/src/components/SafePill.tsx` — additive extension. New `leg?: Leg` prop. When passed: pill wraps in a Pressable whose press fires `toggleLeg(leg)`; glyph flips between `+` (not in pad) and `✓` (in pad); a low-opacity amber overlay paints over the gradient when in pad. Existing `addable?: boolean` prop unchanged — visual-only `+` affordance, still consumed by Phase 2B's `ResearchCard`. The two concerns coexist cleanly:
  - `addable` only: glyph rendered, no press behaviour.
  - `leg` only: glyph rendered (driven by `inPad`), press toggles.
  - Both: glyph driven by `inPad`, press toggles (i.e. `leg` wins).
  - Neither: glyph absent, no press behaviour.
- The `useNotePad` hook is called unconditionally inside `SafePill` (rules of hooks) but its return value is only consulted when `leg` is present. When `SafePill` is rendered outside the provider (isolated test), the no-op fallback returns `inPad === false` and the pill renders display-only.

### `@count/ui` — tab primitives (new)

- `packages/ui/src/components/Tab.tsx` — single `Pressable` with accessibility role `tab`. Active state paints a 3px `LinearGradient` underline (transparent → amber-bright midpoint → transparent) at the bottom of the tap area; inactive renders only the muted label. `marginRight: 20` on each tab.
- `packages/ui/src/components/TabStrip.tsx` — flex row of `Tab`s with a hairline bottom border. Accessibility role `tablist`. Props: `tabs`, `activeId`, `onChange`. No underline animation this phase (revisit if it looks janky in Phase 4).

### `@count/ui` — Fixtures-list primitives (new)

- `packages/ui/src/components/DateChip.tsx` — day chip in the date strip. Active = amber border + amber-tinted background + amber-bright label. Ports `.date-seg` from styles.css.
- `packages/ui/src/components/CompChip.tsx` — "All comps" pill. Same active treatment family as DateChip. Ports `.comp-chip`.
- `packages/ui/src/components/GlassSelect.tsx` — trigger + inline dropdown. Trigger row: optional amber dot (when filteringActive), label, optional mono count, chevron. Dropdown panel positions absolute at `top: '100%'` with `marginTop: 6`. Panel z-index 30 (transient menu, not a modal — sits above scrolling content beneath, well below sheet/nav/bar). iOS shadow on the panel for separation. Selected option gets amber-tinted background + amber label/count.
- `packages/ui/src/components/FixtureListCard.tsx` — single fixture row. `GlassPanel variant='elevated'` when signal ≥ 85, else `'standard'`. Column layout: meta row (`LEAGUE · KICKOFF · VENUE` + SignalBadge) → teams row → top-angle inset row.
  - **Teams row layout — explicit per the brief**: row container with three children (home block | "vs" | away block). Each team block is a **column** stack. Inside the block: row 1 is the name row (kit + name for home; name + kit for away); row 2 is the form-pill row, indented past the kit width (`marginLeft: 30` home, `marginRight: 30` away).
  - Top angle inset: SafePill + title (`flex: 1, minWidth: 0`) + chevron-right. SafePill receives `leg={...}` only when the angle is real (`tier !== 'muted'` *and* `threshold !== '—'`); muted/placeholder rows render the pill as display-only.
- `packages/ui/src/components/FixtureLeagueSection.tsx` — section heading (`SectionHead` with the league name and `{n} fixtures` meta) + stacked cards. `marginTop: 0` for the first section, `marginTop: 26` for the rest. `resolveTeam` function passed by the screen; section skips fixtures whose home or away team can't resolve.
- `packages/ui/src/components/FixturesList.tsx` — the screen body. Column layout: header row → date strip → comp filter row → league sections. State: `day` (chip selection — purely visual this phase) and `comp` (active league filter — does filter the list). Header includes filter + search `IconButton`s (no-ops). `ScrollView` wraps the body so the page scrolls.

### `@count/ui` — barrel

`packages/ui/src/index.ts` adds exports for: `NotePadContext`, `NotePadProvider`, `useNotePad`, `NotePadContextValue`, `NotePadProviderProps`, `NotePadSheet`, `NOTE_PAD_SHEET_BACKDROP_Z_INDEX`, `NOTE_PAD_SHEET_Z_INDEX`, `NotePadLegRow`, `NotePadLegRowProps`, `Tab`, `TabProps`, `TabStrip`, `TabStripProps`, `TabSpec`, `DateChip`, `DateChipProps`, `CompChip`, `CompChipProps`, `GlassSelect`, `GlassSelectOption`, `GlassSelectProps`, `GLASS_SELECT_DROPDOWN_Z_INDEX`, `FixtureListCard`, `FixtureListCardProps`, `FixtureLeagueSection`, `FixtureLeagueSectionProps`, `FixturesList`, `FixturesListProps`.

### App routing + assembly

- `apps/mobile/app/_layout.tsx` — wrapped the existing tree in `<NotePadProvider>`. Mounted `<NotePadSheet />` as an absolute-positioned sibling inside the root `<View>`, **outside** `<ThemeProvider>` (so the sheet z-index lifts above all navigators). Registered the new `fixture/[id]` screen on the Stack (`headerShown: false` — the route owns its own header row). `TransparentDarkTheme`, `RadialBackdrop`, and `Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}` preserved exactly (gotcha #7 — they're load-bearing).

- `apps/mobile/app/(tabs)/fixtures.tsx` — replaces the `<StubScreen name="Fixtures" />` stub with `<FixturesList fixturesByLeague={FIXTURES_ALL} resolveTeam={getTeam} onOpenFixture={(id) => router.push('/fixture/' + id)} />`.

- `apps/mobile/app/(tabs)/index.tsx` — three `onPress` TODOs wired up. `FixtureCard` in Today's row → `router.push('/fixture/' + f.id)`. `FeaturedMatch.onOpen` → `router.push('/fixture/' + FEATURED.id)`. `ResearchCard` items → `router.push('/fixture/' + r.id)`. Imports `router` from `expo-router`. Everything else unchanged.

- `apps/mobile/app/fixture/[id].tsx` — **new route**. Reads `useLocalSearchParams<{ id?: string }>()` and looks up `FIXTURES_BY_ID[params.id]`. Column layout: header row (back IconButton + mono meta on the left, share + bookmark IconButtons on the right), H1 with inline muted "vs" via nested `<Text>`, `TabStrip` with the four labels (**Overview · Team stats · Player stats · The Count** — locked per PROJECT-STATE decision 11), placeholder copy `Tab content arrives in Phase 4.` in the content slot. If `id` doesn't resolve, header reads `UNKNOWN FIXTURE` and H1 reads `Unknown fixture`.

---

## Decisions not explicit in the brief

1. **`FixturesByLeague` mock shape.** The brief specified `league: string` as required on `FixtureListItem` *and* `FixturesByLeague = Record<string, FixtureListItem[]>`. The source data is keyed by league without a per-record `league` field, so the typed mock would fail with `Property 'league' is missing`. Chose to inject `league` per item up front in the mock — kept the type definition and consumer code (`FixtureListCard` reads `fixture.league` directly) clean. A private `RAW: Record<string, Omit<FixtureListItem, 'league'>[]>` holds the original league-keyed shape; `FIXTURES_ALL` and `FIXTURES_BY_ID` are derived from it.

2. **Toast implementation.** Brief offered an inline `setShowToast(true)` + `setTimeout(close, 2000)` as the acceptable approach to avoid pulling a toast library — went with that. Toast sits at the top of the sheet (`position: absolute, top: 16`), centred, dark pill with amber-tinted hairline border. Auto-hides after 2s. Clears any in-flight timer on press so successive presses don't stack.

3. **Bottom sheet implementation.** Hand-rolled with `Animated.View` + `Animated.timing` slide-up + backdrop press, `useNativeDriver: true`. No `@gorhom/bottom-sheet` dep — interactions are simple (open / close / backdrop tap / remove leg), drag-to-dismiss is out of scope this phase, and the brief was explicit that adding a library wasn't justified.

4. **`GlassSelect` dropdown z-index.** Picked `30`. Above the FixturesList content scrolling underneath (which has no explicit z-index), well below `NotePadBar` (85), `BottomNav` (90), `NotePadSheet` backdrop (99) and container (100). Exported as `GLASS_SELECT_DROPDOWN_Z_INDEX` so future consumers can reason about ordering.

5. **`SafePill` chevron-up/down on the bar.** Brief left this as an editorial call (either rotate when `isOpen`, or keep `chevron-up` always). Went with the rotation — it's a small visual hint that the sheet is open, and the `isOpen` value is already on the context.

6. **`FixtureListCard` press feedback.** Brief said `onPress` lives on `GlassPanel`'s containing Pressable. Wrapped the panel in a `<Pressable>` outside the panel (rather than passing onPress to GlassPanel, which doesn't accept it). Press-feedback via the array-form `style={({pressed}) => [pressed && {opacity: 0.7}]}` pattern per gotcha #1.

7. **`NotePadLegRow` remove button.** Brief said `<IconButton icon="x" onPress={...} />`. The existing `IconButton` is a fixed 32×32 glass-bordered tap target — it would dominate the row. Rolled a smaller (28×28) Pressable inline with a softer style. The behaviour matches an IconButton from the user's perspective (accessibility role + label + press-opacity); the size suits the row. If you want the full IconButton chrome here, easy swap.

---

## Verification

- `node apps/mobile/scripts/regen-typed-routes.js` — re-ran after adding `app/fixture/[id].tsx`. Wrote `.expo/types/router.d.ts` successfully.
- `pnpm typecheck` — passes across all six workspace packages (`tokens`, `types`, `api`, `pattern-engine`, `ui`, `mobile`).
- `npx expo export --platform ios` from `apps/mobile/` — bundles cleanly. 1478 modules, 4.03 MB hbc, 24 assets.
- **Not verified on device.** Verification on real iPhone via Expo Go is Nick's step (per the workflow in PROJECT-STATE.md). The verification checklist in the brief — fixtures listing renders, comp dropdown filters, date chips toggle, tap navigates to `/fixture/[id]`, addable pills add/remove legs, bar count updates, sheet opens with legs, Clear all empties + disables, Save to Builders shows toast, backdrop closes — should be walked through there.

---

## Known risks / things to look for on device

1. **Form-pill row position inside `FixtureListCard`.** The brief flagged this as the highest-risk misread. Implementation matches the brief: each team block is a column, name row above, form-pill row below indented past the kit. If the form pills appear *beside* the team name on device, the `homeBlockStyle` / `awayBlockStyle` is rendering as row somehow — but it's an explicit `flexDirection: 'column'`, so should be fine.

2. **`SafePill` regression on Dashboard.** The `leg` prop is purely additive — `ResearchCard` still passes `addable` and nothing else. Dashboard should render unchanged. Worth eyeballing.

3. **`NotePadSheet` Animated.View + native driver.** Slide-up uses `transform: translateY` which is native-driver-safe. Backdrop fade uses `opacity` which is also native-driver-safe. Should be smooth on iPhone. Android Animated quirks are out of scope this phase but worth a glance if anyone fires it up there.

4. **z-index ordering at the sheet boundary.** When the sheet is open the backdrop (99) and container (100) cover the bottom nav (90) and Note Pad bar (85). This is intended (modal). Tapping the dimmed backdrop area closes. If anything peeks through, the issue is likely the bar's `position: 'absolute'` interacting with stacking — easy to debug from the layout.

5. **Glass-select dropdown panel clipping.** The dropdown sits inside the comp-filter row container, which has `zIndex: 30` set explicitly so the panel can lift above league sections below. If the panel renders but appears *behind* the first FixtureLeagueSection, the issue is RN's flat z-stacking — the comp-filter row needs a higher z-index than the sibling sections wrap. Currently 30 vs 0; should be fine.

---

## Files changed

```
A apps/mobile/app/fixture/[id].tsx
M apps/mobile/app/_layout.tsx
M apps/mobile/app/(tabs)/fixtures.tsx
M apps/mobile/app/(tabs)/index.tsx
A apps/mobile/src/mock/fixtures-all.ts

A packages/types/src/leg.ts
A packages/types/src/fixture-list.ts
M packages/types/src/index.ts

A packages/ui/src/context/NotePadContext.tsx
A packages/ui/src/components/NotePadSheet.tsx
A packages/ui/src/components/NotePadLegRow.tsx
A packages/ui/src/components/Tab.tsx
A packages/ui/src/components/TabStrip.tsx
A packages/ui/src/components/DateChip.tsx
A packages/ui/src/components/CompChip.tsx
A packages/ui/src/components/GlassSelect.tsx
A packages/ui/src/components/FixtureListCard.tsx
A packages/ui/src/components/FixtureLeagueSection.tsx
A packages/ui/src/components/FixturesList.tsx
M packages/ui/src/components/NotePadBar.tsx
M packages/ui/src/components/SafePill.tsx
M packages/ui/src/index.ts
```

`git status` left dirty — Claude Code stops without committing per the workflow.
