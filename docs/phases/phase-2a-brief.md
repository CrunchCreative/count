# Phase 2A — Brief

**Goal:** Replace the default React Navigation tab bar with the custom 5-item glass bottom nav. Build the multi-format Kit primitive (shirt + square variants). Ship the Note Pad bar empty state as visual-only chrome above the nav. Add the `SectionHead` primitive. Extend the demo screen so all of the above can be verified on device before Phase 2B assembles the real Dashboard.

This is the **app-shell foundation** for every screen from Phase 2B onwards. Every subsequent tab inherits the nav. Every screen with teams uses the Kit primitive. Every section divider on every screen uses `SectionHead`. The Note Pad bar is always rendered above the nav on every tab screen — even though it does nothing yet in this phase.

---

## Read these first

In this order:

1. `docs/PROJECT-STATE.md` — current state, stack, decisions.
2. `docs/DESIGN.md` — non-negotiables (vocabulary, two type weights, 0.5px hairlines, no emoji, glass-only surfaces).
3. `docs/design-source/the-count-v2/project/README.md` — full design system documentation.
4. `docs/design-source/the-count-v2/project/styles.css` — the production stylesheet. Specifically:
   - Lines covering `.bottom-nav` (the 5-item bar styling, blur, gradients).
   - Lines covering `.slip-bar` and `.slip-bar.empty` (used as the visual reference for the Note Pad bar — see "Vocabulary note" below).
   - Lines covering `.section-head` (the divider with label + gradient line + meta).
5. `docs/design-source/the-count-v2/project/components/kit.jsx` — three exports: `Kit` (shirt), `KitMini` (tiny 8×9 inline kit, used in matrix opponent columns), `PlayerKit` (square + number, used in player rows).
6. `docs/design-source/the-count-v2/project/data.js` — the `TEAMS` object. Roughly 50 records across 6 leagues, each with `code`, `name`, `form`, and `kit: { pattern, primary, secondary, tertiary }`.
7. `docs/design-source/the-count-v2/project/screens/dashboard.jsx` — for reference only. Don't build the Dashboard in this phase. But the bottom nav and Note Pad bar live in the same app shell that this screen renders into; understanding the surrounding chrome helps.

---

## Vocabulary note (important — affects naming throughout)

The design source calls the bottom assembly area the "slip bar" (because it was prototyped as a betting slip). **In Count, this is renamed.**

- **Note Pad** = the temporary scratch space for assembling legs.
- **Builder** = a saved Note Pad. (Owned by the Builders tab — that's where saved Builders live.)
- **Leg** = an item inside either a Note Pad or a saved Builder.

The rename matters because there's already a Builders tab in the bottom nav. Calling the slip a "builder bar" would collide with that mental model.

**Mental model (end-to-end, for context — most of this is future-phase work)**: the Note Pad is the scratch space, visible at all times as a bar above the bottom nav. The user taps a `+` affordance on any Safe Pill to add that leg to the Note Pad. Tapping the Note Pad bar opens the Note Pad sheet (a slide-up modal listing the current legs grouped by fixture). From the sheet, the user can remove individual legs or hit "Save to Builders" — that action promotes the Note Pad into a saved Builder, which then appears in the Builders tab. The Note Pad is client-state only (lives in a Zustand or context store, not persisted to backend). Saved Builders persist to Supabase from Phase 6 onwards. In Phase 2A only the empty visual chrome ships; everything else above is future-phase work, included here so future briefs have a consistent story.

**Apply throughout this phase**:
- File/component names: `NotePadBar.tsx`, not `SlipBar.tsx`.
- Forward-looking hook name (not built in this phase, but reserve the name): `useNotePad`, not `useSlip`.
- Forward-looking store/state shape (not built in this phase): `NotePad`, not `Slip`.
- Verbs (for later phases — note for future reference): "Add to Note Pad", "Save to Builders", "Remove leg".

In *this* phase the Note Pad bar is visual-only with no hook, no state, no taps. It always renders in the empty state. But name everything as if the hook is coming.

---

## What to build

### 1. Bottom nav

**Location:** `packages/ui/src/components/BottomNav.tsx` and integration in `apps/mobile/app/(tabs)/_layout.tsx`.

**Five tabs, in this order**:

| Order | Label    | Icon glyph (from `@count/ui/Icon`) | Route                  |
|-------|----------|------------------------------------|------------------------|
| 1     | Home     | `home`                             | `/(tabs)/index`        |
| 2     | Fixtures | `calendar`                         | `/(tabs)/fixtures`     |
| 3     | Search   | `search`                           | `/(tabs)/search`       |
| 4     | Builders | `builders`                         | `/(tabs)/builders`     |
| 5     | Profile  | `profile`                          | `/(tabs)/profile`      |

The `builders` glyph (stacked layers) and `profile` glyph were both ported in Phase 1C. Use those exact names. There is no `user` or `bookmark` glyph in the Icon component.

**Routing**: Create stub screens at the four new paths. Each is a single `<View>` with a centred `<Text>` saying the screen name in `tc-body` style, against the page background, with the bottom nav + Note Pad bar still visible. (Phases 2B–5 will replace these stubs one by one.) The `/(tabs)/index` stub stays as the existing demo screen for now — Phase 2B replaces it with the real Dashboard.

**Visual spec** (from `.bottom-nav` in `styles.css`):
- Absolute-positioned, full width, sits at the bottom of the screen.
- Padding: `8px 4px 30px` (the 30px bottom accounts for home indicator; in RN use safe-area insets — see implementation note below).
- Background: linear gradient `rgba(8,9,11,0.4)` → `rgba(8,9,11,0.92)` top to bottom.
- Backdrop blur: 18px with 150% saturation.
- Top border: 0.5px hairline using `--b-def` (`rgba(255,255,255,0.06)`).
- 5 equal columns via `grid-template-columns: repeat(5, 1fr)` — translate to a `flexDirection: 'row'` with each item `flex: 1`.

**Per item** (`.bottom-nav .item`):
- Vertical stack: icon (22×22) on top, label below, 2px gap.
- Padding: `6px 4px`.
- Inactive state: colour `--t-hint` (`#7A7870`), font-size 10, weight 500.
- Active state: colour `--amber-bright` (`#E8B53A`), with `text-shadow: 0 0 10px rgba(232,181,58,0.5)`.

**Implementation notes**:
- **Backdrop blur**: requires `expo-blur`. **Install via `cd apps/mobile && npx expo install expo-blur`** — Expo's installer pins the SDK-54-compatible version. Do NOT use `pnpm add` (it doesn't pin to the Expo SDK and can pull an incompatible release). Same pattern Phase 1C used for `expo-linear-gradient` and `react-native-svg`. Wrap the nav background with `<BlurView intensity={...} tint="dark">`. The Tailwind v4 NativeWind doesn't expose backdrop-filter as a utility, so this is the right primitive. On Android, `expo-blur` falls back gracefully (it's a translucent fill rather than a true blur). Document this in the component file with a brief comment.
- **Safe area**: use `useSafeAreaInsets()` from `react-native-safe-area-context` for the bottom padding. Spec says `padding-bottom: 30px`; in RN, use `insets.bottom + 8` so it adapts to home-indicator vs. older-device differences.
- **Active state**: read the current route via `usePathname()` from `expo-router`. The active tab is the one whose route prefix matches.
- **Glow on active label**: RN has no `text-shadow`. Use `shadowColor` + `shadowOpacity` + `shadowRadius` on the `<Text>` (iOS only; Android won't show the glow). This is acceptable — the active state is communicated by colour alone on Android, the glow is a bonus on iOS. Match the pattern used in Phase 1C primitives for iOS-only glows. Do NOT add an `AndroidGlowUnderlay` for the label — it would be visually noisy at this small scale.
- **Replace the default React Navigation tab bar**: in `apps/mobile/app/(tabs)/_layout.tsx`, configure `Tabs` with `tabBar={(props) => <BottomNav {...props} />}` and pass `screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}`. Then render `<BottomNav>` and `<NotePadBar>` (see below) as siblings absolutely positioned over the `<Tabs>` slot. The cleanest structure is a wrapper layout that renders `<Tabs>` for the screen content + the two absolute-positioned bars on top.
- **Preserve Phase 1C state in the root `_layout.tsx`**: the root layout at `apps/mobile/app/_layout.tsx` (NOT `(tabs)/_layout.tsx` — different file) was modified during Phase 1C post-review fixes to force `ThemeProvider value={DarkTheme}` and `<StatusBar style="light" />`, with the `useColorScheme` / `DefaultTheme` imports removed. The nav integration in this phase touches `apps/mobile/app/(tabs)/_layout.tsx`, which is a separate file — do not modify the root layout. Count is always dark; do not reintroduce the colour-scheme conditional anywhere.
- **Hit area**: each tab item must be at least 44×44pt for accessibility. The full column is the tap target.

**Verification**: Tapping each tab switches the screen content. The active tab's icon + label turn amber. The nav itself does not scroll with content (always pinned to the bottom).

---

### 2. Kit primitive (multi-format)

**Location:** `packages/ui/src/components/Kit.tsx`.

A single component with a `variant` prop renders the same team colourway + pattern in different forms. **Build all three variants in 2A.** All three are referenced across screens that ship in Phases 2B–5; building once now means no rework.

**Props**:
```ts
type KitVariant = 'shirt' | 'mini' | 'square';

interface KitProps {
  teamCode: string;          // 'MCI', 'CRY', etc — key into team registry
  variant: KitVariant;
  size?: number;             // shirt only — defaults below
  playerNumber?: number;     // square only — required when variant='square'
}
```

If `teamCode` doesn't resolve, render a transparent placeholder at the variant's default size. (Don't crash; don't log.)

#### Variant: `shirt`

Direct port of `Kit` from `components/kit.jsx`. SVG viewBox `0 0 100 110`. Default size 22; size scales the SVG width, height = round(size × 1.08).

Renders torso + sleeves + collar shadow notch + inner highlight stroke, with pattern overlays clipped to the body via a `<ClipPath>`. Four patterns:

- `solid`: torso filled with `kit.primary`. Sleeves use `kit.secondary` (falls back to primary if no secondary).
- `vertical_halves`: torso transparent, two `<Rect>` overlays clipped to the body — left half `kit.primary`, right half `kit.secondary`. Sleeves use `kit.primary`.
- `vertical_stripes`: torso filled `kit.secondary`. Three vertical 9-wide stripes in `kit.primary`. Sleeves use `kit.primary`.
- `horizontal_band`: torso filled `kit.primary`. Sleeves use `kit.secondary` (different from solid — see source). No additional stripes.

**Use `react-native-svg`**: `<Svg>`, `<Path>`, `<Rect>`, `<G>`, `<ClipPath>`, `<Defs>`. Generate a unique `clipPath` id per instance via React's `useId` hook (`import { useId } from 'react'` — the React 18+ hook returns a stable id across renders, won't change on re-render, and is unique per component instance). Pattern: `const uid = useId(); const clipId = \`kit-clip-${uid}\`;`. RN-SVG requires id uniqueness across the screen; do not use `Math.random()` or string-interpolate the team code alone (multiple kits for the same team on one screen would collide).

**Default sizes from source** (use these as semantic constants exported from the component file):
- `hero` = 32–34 (used on featured match panel in some contexts)
- `standard` = 22–26 (default; Dashboard fixture cards, fixture rows)
- `compact` = 14–18 (depth row on featured match, fixture overview)

Don't bake the keywords into the component — just expose `size` as a number and the consumer decides. Document the conventional sizes in the component file's leading comment so callers know what's expected.

#### Variant: `mini`

Direct port of `KitMini` from `components/kit.jsx`. Tiny 8×9 SVG used inline in matrix opponent columns (Player Matrix headers, Team Matrix headers — both ship in Phase 3). Rounded 1.5px corners. `viewBox="0 0 8 9"`.

Pattern logic simplified:
- `solid`: full rect in `kit.primary`.
- `vertical_halves`: 4-wide left rect in `kit.primary`, 4-wide right rect in `kit.secondary`.
- `vertical_stripes`: full rect in `kit.secondary` with two thin 1.5-wide stripes in `kit.primary`.
- `horizontal_band`: full rect in `kit.primary`. (No mini variant of the band in the source — keep simple.)

`size` prop ignored for mini (always 8×9). `playerNumber` ignored.

#### Variant: `square`

Direct port of `PlayerKit` from `components/kit.jsx`. **This is the kit-with-number used in Player Matrix rows** — confirmed in the source's player row layout. 22×22 rounded 3px square.

This variant uses RN `<View>` + `<Text>` rather than `<Svg>`, because we need text inside it and font rendering on top of SVG is fiddlier than the layout it replaces. Background per pattern:

- `solid`: flat `kit.primary` background.
- `vertical_halves`: linear gradient `kit.primary` 0–50%, `kit.secondary` 50–100% (use `expo-linear-gradient` with `start={{x:0,y:0}} end={{x:1,y:0}}`).
- `vertical_stripes`: flat `kit.secondary` background with two absolutely-positioned 2-wide vertical strips in `kit.primary` (one at `left: 4`, one at `right: 4`).
- `horizontal_band`: flat `kit.primary` (the band detail doesn't read at 22×22; keep it simple).

Number rendering:
- Mono font, font-size 11, weight 500 (NOT 600 — Phase 1C locked us to weights 400/500 only; the source has 600 here, override it).
- Colour: white `#FFFFFF` by default. **Switch to dark text `#1A1408` when the primary is one of**: `#FDB913` (Wolves yellow), `#FFE667` (Villarreal yellow), `#FFFFFF` (any white kit). Helper: `if (k.pattern === 'solid' && ['#FDB913','#FFE667','#FFFFFF'].includes(k.primary)) textColor = '#1A1408'`.
- Inset highlight ring: `boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.15)'` — in RN that's a 0.5px border with that colour applied to the outer `<View>`.

`size` defaults to 22; allow override but most usage will be default. `playerNumber` is required for this variant (validate via TS — if you want to be strict, use a discriminated union on `variant`).

#### Team registry

Move the `TEAMS` data from `data.js` into the mobile app's mock layer:

**File**: `apps/mobile/src/mock/teams.ts`

**Shape** (typed):
```ts
export type KitPattern = 'solid' | 'vertical_halves' | 'vertical_stripes' | 'horizontal_band';

export interface TeamKit {
  pattern: KitPattern;
  primary: string;
  secondary: string;
  tertiary?: string;
}

export interface Team {
  code: string;      // 'MCI', 'CRY', etc — unique key
  name: string;      // Display name
  form: ('W'|'D'|'L')[];  // Last 5 results (used by other screens — keep in shape)
  kit: TeamKit;
}

export const TEAMS: Record<string, Team> = { /* ... */ };

export function getTeam(code: string): Team | undefined {
  return TEAMS[code];
}
```

Port **all** team records from `data.js` (six leagues — PL, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie). Roughly 50 records. Match the data byte-for-byte; don't reformat colour hex casing.

**Where this lives long-term**: Phase 7 (Sportmonks ingestion) replaces this mock. The kit data specifically will likely stay hand-maintained even after ingestion (Sportmonks doesn't reliably ship kit colourways), but the team list will be replaced. Designing the registry as a `Record<code, Team>` with a `getTeam(code)` accessor means the Kit component reads through a single function — the ingestion phase replaces the registry implementation without touching the component.

#### Re-export

Add `Kit` and `TEAMS` types (`Team`, `TeamKit`, `KitPattern`) and `getTeam` accessor to `packages/ui/src/index.ts`.

Actually correction — `TEAMS` is mock data living in `apps/mobile/src/mock/teams.ts`, NOT in `@count/ui`. The Kit component shouldn't import from the app. Instead:

- Move the `Team` / `TeamKit` / `KitPattern` types to `packages/types` (this is what `packages/types` is for).
- Mock `TEAMS` lives in `apps/mobile/src/mock/teams.ts` and imports those types.
- Kit component takes a `teamCode: string` and an optional `team?: Team` prop. If `team` is passed, use it. Otherwise, the consumer is responsible for passing a team via a context (deferred — not built in this phase) or by looking up via `getTeam` themselves and passing as `team`.

**Simplest pattern for this phase**: Kit takes the full `Team` object as a prop, not a code. The consumer does the lookup:

```ts
interface KitProps {
  team: Team;
  variant: KitVariant;
  size?: number;
  playerNumber?: number;
}
```

This avoids needing a context or registry coupling in `@count/ui`. The demo screen does `getTeam('MCI')` and passes the result. Clean separation: `@count/ui` doesn't know about data sources; the app does the resolution.

If `team` is undefined (defensive — won't happen with `Team` typed), render the placeholder.

---

### 3. Note Pad bar (empty state, visual-only)

**Location:** `packages/ui/src/components/NotePadBar.tsx`. Rendered by the tab layout in `apps/mobile/app/(tabs)/_layout.tsx`, positioned absolutely above the bottom nav.

**Visual spec** (from `.slip-bar.empty` in `styles.css`):
- Absolute position, sits 78px above the bottom of the screen (above the nav).
- Left/right inset: 12px each.
- Height: 52px.
- Padding: 0 14px.
- Border radius: 14px.
- Background: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)`.
- Border: 0.5px hairline `--b-def` (`rgba(255,255,255,0.06)`).
- Inset highlight: 1px top bar at `rgba(255,255,255,0.04)`, same pattern as `GlassPanel`.
- Outer shadow (iOS only): `0 6px 24px rgba(0,0,0,0.30)`.
- Backdrop blur: 20px with 150% saturation. Use `expo-blur` `<BlurView intensity={...} tint="dark">` as the bar's backdrop. Wraps content.

**Contents** (left-to-right):
- **Icon box**: 32×32, rounded 8px, background `rgba(0,0,0,0.25)`, border 0.5px `--b-def`. Inside it: the `layers` glyph from `@count/ui/Icon` at size 16, colour `--t-mut` (`#9A9890`). **Empty state shows the icon, not a count.** The numeric count badge (mono, size 14) appears only in the populated state, which is reserved for Phase 5 — do not render it in 2A.
- **Text block** (vertical stack, gap 1px):
  - Label: mono, size 11, weight 500, letter-spacing 0.5px, uppercase, colour `--t-hint`. Text: `NOTE PAD`.
  - Preview: sans, size 12.5, weight 400 (empty state is 400, not 500), colour `--t-mut`. Text: `No legs added yet`.

The bar is always rendered, always in this empty state. It is NOT pressable in this phase — don't add an `onPress`, don't add a Pressable wrapper. It's a visual-only stub. Comment in the component file:

```tsx
// Note Pad bar — visual-only chrome in Phase 2A.
// In a later phase (likely Phase 5), this becomes the surface for the Note Pad subsystem:
//   - useNotePad() hook backed by a store
//   - empty / populated visual states (populated styling exists in styles.css under .slip-bar.populated — reserved for that phase)
//   - tap to open the Note Pad sheet (slide-up modal, see .slip-sheet / .slip-backdrop in source)
//   - "Save to Builders" promotes the Note Pad into a saved Builder
// Until then, this component always renders the empty state and ignores any interaction.
```

**Why above the nav**: the source's `.slip-bar` is positioned `bottom: 78px` which sits just above the nav's top edge. Math: nav is ~96px tall total (8 top + 22 icon + ~14 label + ~12 gap + 30 bottom-safe-area). The 78px lifts the Note Pad bar's bottom edge above the nav. In RN with safe-area insets, position it via `bottom: insets.bottom + 70`. The `70` is the nav's content height — icon (22) + label (~14) + vertical gaps (~12) + top padding (8) + a small breathing margin (~14) — measured *without* the bottom safe-area inset, because that inset is added separately. The nav itself uses `insets.bottom + 8` for its own bottom padding (the home-indicator zone), so the Pad bar's bottom edge lands just above the nav's top edge regardless of device.

**Hierarchy**: Note Pad bar `zIndex: 85`, bottom nav `zIndex: 90`. Nav is above. (Source has these exact z-indices.)

---

### 4. `SectionHead` primitive

**Location:** `packages/ui/src/components/SectionHead.tsx`.

Direct port of the `.section-head` pattern (used 5+ times on Dashboard alone, more on Fixtures and Search). A horizontal row with: label on the left, gradient line in the middle, optional meta on the right.

**Props**:
```ts
interface SectionHeadProps {
  label: string;                        // "TODAY'S FIXTURES"
  tone?: 'engine' | 'utility';          // colour of the label — defaults to 'utility'
  meta?: string;                         // optional right-side text
}
```

**Visual spec** (from `.section-head` in `styles.css`):
- `flexDirection: 'row'`, `alignItems: 'center'`, gap 10px.
- Vertical margin: 22 top, 10 bottom. Top margin only — bottom margin can be handled by consumer.
- Label: tone `engine` → colour `--teal-bright` (`#5DCAA5`); tone `utility` → colour `--t-mut` (`#9A9890`). Font: sans, size 11, weight 500, letter-spacing 0.6px, uppercase.
- Line: `flex: 1`, height 0.5px (`StyleSheet.hairlineWidth`), background `linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0))`. Use `expo-linear-gradient` here — RN doesn't do CSS gradients on backgrounds.
- Meta (right side, optional): mono, size 10, weight 400, letter-spacing 0.3px, colour `--t-hint`. `whiteSpace: nowrap` equivalent (single line, don't shrink).

Re-export from `packages/ui/src/index.ts`.

---

### 5. Demo screen update

**Location:** `apps/mobile/app/(tabs)/index.tsx` (the existing Phase 1C demo screen).

**Update it** — don't replace it yet. Phase 2B replaces it with the real Dashboard. For now, extend the demo to verify everything in 2A:

- Add a `<SectionHead label="TEAM KITS" tone="utility" meta="Shirts" />` followed by a horizontal scroll (or wrapping flex row) of `Kit` shirt variants at default size — render maybe 10–12 teams pulled from the registry.
- Add a `<SectionHead label="KIT MINI" tone="utility" />` followed by a row of mini variants.
- Add a `<SectionHead label="PLAYER KITS" tone="engine" meta="Square + number" />` followed by a row of square variants with various player numbers — include at least one team with a yellow primary (Wolves) and one with white (Tottenham or Real Madrid) to verify the dark-text override.
- Add a `<SectionHead label="SECTION HEADS" tone="utility" meta="Both tones" />` followed by two more rendered SectionHeads — one of each tone — to demonstrate visual difference.

Keep the existing Phase 1C demo content (glass panels, signal badges, safe pills, form pills, score pills, icon grid) below the new sections. The point of the demo screen is cumulative — every primitive built so far is rendered here.

The bottom nav and Note Pad bar should appear on all 5 tabs automatically via the `_layout.tsx` integration — don't render them per screen.

---

## Folder/file changes summary

```
packages/ui/src/components/
  BottomNav.tsx           — new
  NotePadBar.tsx          — new
  SectionHead.tsx         — new
  Kit.tsx                 — new (handles shirt / mini / square variants)
packages/ui/src/index.ts  — export the four new components

packages/types/src/
  team.ts                 — new — Team, TeamKit, KitPattern types
packages/types/src/index.ts — export team types

apps/mobile/src/mock/
  teams.ts                — new — full TEAMS registry ported from data.js + getTeam helper

apps/mobile/app/(tabs)/
  _layout.tsx             — modified — replace default Tabs UI with BottomNav + NotePadBar wrapper
  index.tsx               — modified — extend Phase 1C demo with kit + section head sections
  fixtures.tsx            — new stub
  search.tsx              — new stub
  builders.tsx            — new stub
  profile.tsx             — new stub

apps/mobile/package.json  — add expo-blur dep
```

If `packages/types` doesn't have an `src/` set up yet, follow the same TS config + tsconfig pattern as `@count/tokens`. Don't go off and rebuild it; copy the conventions.

---

## Forward-looking nomenclature (not built in 2A but reserve the names)

Even though the Note Pad subsystem doesn't exist yet, the brief reserves these names so future phases don't drift:

- Hook: `useNotePad`
- Store key / state shape: `NotePad`
- Item shape: `Leg` (already used in the source as `leg`)
- Verbs: `addLeg`, `removeLeg`, `clearNotePad`, `saveToBuilders`
- UI surfaces: `<NotePadBar>` (built now, empty only), `<NotePadSheet>` (future), `<SaveToBuildersModal>` (future)
- Persisted shape (when Phase 6 lands Supabase): `Builder` is the saved table; `NotePad` lives in client state only, never persisted to backend until saved.

**Builder** is the saved artefact (Phase 5+); **Note Pad** is the temporary scratch space; **Leg** is what lives in both. Don't invent alternative names in this phase or future phases.

---

## Constraints (these have not changed)

- **Stack locked**: Expo SDK 54, RN 0.81, TS strict, NativeWind v4.2, Tailwind 3.4. Do NOT propose upgrades.
- **Two font weights only**: 400 and 500. The source has some 600s in `PlayerKit` and `slip-count-badge`; override to 500 here.
- **All hairline borders**: `StyleSheet.hairlineWidth`. Never literal `borderWidth: 0.5`.
- **No emoji**: SVG icons only. Use the `Icon` component from `@count/ui` for all glyphs.
- **No new accent colours**: amber + teal only. Reds for loss state only (not used in 2A).
- **No certainty language**: not applicable in 2A (no copy of that kind), but never write any in any phase.
- **Glass surfaces only**: never solid-fill cards. Note Pad bar and nav both use glass recipes.
- **iOS glows via `shadowColor`**, Android glows via `AndroidGlowUnderlay` from Phase 1C. Re-use, don't duplicate.

---

## Decisions to flag in the summary doc

Anything not explicit in this brief that you have to decide — flag it in the Phase 2A summary doc using the same format as the Phase 1C summary. Particular areas where decisions may arise:

1. The exact `expo-blur` intensity values — calibrate against on-device appearance, not the CSS `blur(18px)` literal (those numbers map differently between web and native).
2. Whether `packages/types/src/team.ts` lives in its own file or in a barrel `index.ts` — match what's already in the package.
3. How to handle the `square` variant's `playerNumber` typing if you choose a discriminated union vs. a single optional prop with a runtime invariant.
4. Any source bugs found in `kit.jsx` that need notation (like the `arrow-left` polyline bug found in Phase 1C).
5. How the four new stub tab screens render — minimal viable structure is fine, but document what you chose.

---

## Verification

Before declaring done, run:

- `pnpm typecheck` from repo root — all packages pass, zero errors.
- `npx expo export --platform ios` from `apps/mobile/` — bundles cleanly, no resolution errors.
- `npx expo export --platform android` — same, both platforms must bundle.
- No `console.log`, no emoji, no font weight 600+, no inline `borderWidth: 0.5`.
- All hairline borders go through `StyleSheet.hairlineWidth`.
- All `@count/ui` imports in any app code use the package name, not relative paths.

Nick will test on real iPhone via Expo Go and visually confirm:
- All 5 tabs are reachable; active state highlights correctly.
- Note Pad bar renders above the nav, doesn't scroll with content.
- All four kit patterns render correctly across shirt, mini, and square variants.
- Yellow + white teams render player numbers in dark text in the square variant.
- Section heads render in both tones with optional meta.

Nick will then sideload to Android via Expo Go to confirm:
- Backdrop blur falls back gracefully (translucent fill is acceptable).
- Nav is legible without the iOS `text-shadow` glow on the active item.
- Note Pad bar's lack of outer shadow (iOS-only) doesn't make it look detached or floating wrongly.

If anything in the Android pass surfaces a real visual regression, flag it in the summary as deferred Phase 2A.5 work — don't fix it inline.

---

## Stop conditions

- After completing the build and the verifications above, **do not commit**.
- Write `docs/phases/phase-2a-summary.md` matching the format of the Phase 1C summary: what was built, decisions taken, surprises in the source, honest visual deltas, TODOs left, verification output.
- Stop. Nick reviews the diff in chat with the planning Claude.