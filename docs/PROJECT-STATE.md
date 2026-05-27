# Count — Project State

A snapshot for any Claude conversation joining this project. Keep this current as the source of truth for "where are we right now."

---

## What this is

Count is a native iOS + Android football intelligence and betting research app. Built by Nick at Crunch Creative. The product takes raw football event data — goals, shots, cards, corners, tackles, fouls, saves, throw-ins — and turns it into discoverable statistical patterns users can use as research for evidence-led betting decisions, then place those bets on a sportsbook elsewhere.

**Count is not a sportsbook.** Users do not place bets in the app. They build research, save fixtures and "builders" (multi-leg bet structures), and reference outcomes after the fact. No odds shown in V1. No money flow. No in-app betting.

The product's signature interaction is the **comparative stats grid** — horizontally scrollable, side-by-side comparison across teams, players, referees, and historical windows. This is the differentiator. No competitor offers this shape of comparison. (Internally and in design-source code this is sometimes called "matrix" — that's the shape, not the label. User-facing labels are "Team stats" and "Player stats". See decision 11.)

Two distinct user types share the same product:

- **Casual users** want engine-assisted insight, fast picks, builder suggestions.
- **Advanced users** want raw data visibility, full comparative-grid research, manual pattern recognition.

Both must be served without forcing either into the other's workflow.

## Stack and infrastructure

- **Mobile:** Expo SDK 54 + React Native 0.81 + React 19.1 + TypeScript 5.9 (strict)
- **Routing:** Expo Router (file-based)
- **Styling:** NativeWind v4.2 (Tailwind 3.4) — locked, do not upgrade until v5 stabilises
- **Monorepo:** pnpm 10 + pnpm workspaces
- **Gradients & SVG:** `expo-linear-gradient`, `react-native-svg`
- **Data (planned):** Supabase (auth + Postgres + Edge Functions)
- **Ingestion (planned):** Sportmonks API for football data
- **Engine (planned):** Anthropic (Claude) for engine-assisted builder generation and natural-language search. The user-facing surface is branded **The Count**; AI is the underlying technology, not the product label.
- **Build & distribution:** EAS Build + EAS Submit (Apple Developer + Google Play accounts already in place)
- **Dev environment:** GitHub Codespaces is the primary surface

## Repo

- GitHub: `CrunchCreative/count`
- Branch: `main`
- Monorepo layout:
  ```
  count/
  ├── apps/mobile/                 — Expo app
  ├── packages/tokens/             — Typed design tokens + Tailwind CJS mirror
  ├── packages/ui/                 — Shared React Native components
  ├── packages/types/              — Shared domain types
  ├── packages/api/                — Supabase wrappers (skeleton)
  ├── packages/pattern-engine/     — Pure-TS deterministic stats engine (skeleton)
  ├── supabase/                    — Migrations + functions (skeleton)
  ├── docs/                        — All documentation
  └── .claude/skills/count-design/ — Skill that auto-loads for any Claude Code session in this repo
  ```

## Documentation map

Everything in `docs/`:

- `docs/PRODUCT.md` — full product brief (audience, principles, market scope). May still reference "Matrix view" and "AI" — those are superseded by decision 11 below; don't rewrite PRODUCT.md mid-cycle, just read it with the vocabulary lens.
- `docs/DESIGN.md` — design system rules pointer; non-negotiables surfaced
- `docs/design-source/the-count-v2/` — canonical design source (HTML/CSS/JSX prototype with `README.md` documenting the visual system). The source uses "Slip", "AI tab", "Team matrix", "Player matrix" — translate to "Note Pad", "The Count", "Team stats", "Player stats" when porting.
- `docs/phases/phase-1c-brief.md` / `phase-1c-summary.md` — Phase 1C scope + delivery report
- `docs/phases/phase-2a-brief.md` / `phase-2a-summary.md` — Phase 2A scope + delivery report
- `docs/phases/phase-2b-brief.md` / `phase-2b-summary.md` — Phase 2B scope + delivery report
- `docs/phases/phase-2b-debug-notes.md` — root-cause analysis of three post-2B rendering bugs (backdrop, panel inset, dots) and the fixes applied

## Key decisions taken in earlier sessions

These are durable architectural choices the codebase already assumes. Don't relitigate without explicit reason.

1. **Native mobile only for V1.** No web app, not even a sign-up funnel. Mobile handles auth via Supabase magic link / OAuth. A future marketing site is out of scope until the app ships and there's traction.
2. **iOS and Android equal priority** — both stores submit together.
3. **UI-first strategy with sanity checks.** Build screens against typed mock data first; spike Sportmonks early to verify shapes; build the pattern engine against a static historical dataset mid-way through UI work; integrate live data in later phases.
4. **Mobile-first, no responsive web for V1.** The design source was built at iPhone 15 Pro proportions (402×874) and translated 1:1 to RN — no responsive breakpoints.
5. **pnpm + Expo monorepo with hierarchical resolution enabled.** Metro walks pnpm's symlink tree the way Node does. A narrow `.npmrc` `public-hoist-pattern` exists for `nativewind` + `react-native-css-interop` because NativeWind's babel plugin runs in plain Node at config time and needs the package physically present.
6. **Design vocabulary inspired by Bet365 (density, scanning, dark) but rejecting sportsbook clichés.** No casino aesthetic, no hype language, no certainty claims. Premium analytical tone. The design source `README.md` documents the full system; `docs/DESIGN.md` surfaces the non-negotiables.
7. **Bet-vocabulary policy is non-negotiable.** Allowed: trend, alignment, consistency, hit rate, floor, threshold. Forbidden: guaranteed, lock, easy money, banker, sure thing, can't lose. Never frame past data as future certainty.
8. **Two type weights only**: 400 and 500. **All hairline borders 0.5px** (via `StyleSheet.hairlineWidth`). **No emoji anywhere.** SVG icons only.
9. **Vocabulary stack for the assembly flow**: **Note Pad** = scratch space (the persistent bar above the bottom nav, visible on every tab). **Builder** = saved Note Pad. **Leg** = item inside either. Forward-looking forbidden references — don't introduce `useSlip` / `<SlipBar>` / "Slip" anywhere; the working names are `useNotePad` / `<NotePadSheet>` / `<NotePadBar>` and the user-facing CTA is "Save to Builders".
10. **`RadialBackdrop` is hoisted once at the root layout** (`apps/mobile/app/_layout.tsx`), not rendered per-screen. Every screen inherits the wash through transparent navigators (see gotcha 7).
11. **User-facing vocabulary lockdown (decided pre-Phase 3).** The fixture detail screen has four tabs: **Overview · Team stats · Player stats · The Count**. Forbidden as visible copy: "AI" (the engine surface is "The Count"; "AI" only appears in internal/architectural docs about which technology powers it), "Slip" (always "Note Pad"), "Matrix" as a tab label (the tab is "Team stats" or "Player stats"; "matrix" remains acceptable as an *internal* code/component term describing the comparative-grid shape — `TeamStatsMatrix` as a component is fine, "Team matrix" as a tab label is not). This applies across all phases.
12. **No odds in V1, ever, as a UI feature.** Pre-match and in-play odds are available as a Sportmonks add-on (€14–€69) but won't be purchased for V1. The `Leg` type carries an `odds?: never` placeholder slot reserving the field for V1.1; no V1 component reads or renders it. App Store positioning as "research and history journal" depends on this — keep it firm.

## Workflow

The current dev pattern:

1. **Conversation with Claude in claude.ai** — strategic planning, scoping, brief drafting, reviewing diffs, debugging, **surgical bug fixes** (direct file edits when a fix is precise enough to articulate in chat without needing the agent to investigate the live environment).
2. **Brief committed to repo** at `docs/phases/phase-Nx-brief.md`.
3. **Claude Code in the Codespace terminal** (`npx -y @anthropic-ai/claude-code`) executes the brief autonomously, reading the brief, the design source, and the existing scaffold; writing the code directly into the repo; running typechecks and bundle verifications.
4. **Claude Code stops without committing** when it finishes; writes a `phase-Nx-summary.md`.
5. **We review the diff together** in chat — Nick pastes `git status`, `git diff --stat`, and the summary doc. We work through any issues.
6. **Commit and push to `main`** when satisfied.
7. **Test on a real device via Expo Go** (`npx expo start --tunnel` from `apps/mobile/`, scan QR with iPhone Camera app). Screenshots reviewed in chat for visual deltas.
8. **Run `git status` before declaring a phase done.** Untracked files can hide between commits. A clean working tree is the only reliable signal that a phase is fully in version control. Phase 2B's "missing build artefacts" gap — where the four phase-2b commits all captured refinement edits but the mocks, types, new components, brief, and summary sat untracked for the whole phase — is the lesson. Always close a phase with `git status` returning *nothing to commit, working tree clean*.
9. **Re-upload `docs/PROJECT-STATE.md` and `docs/ROADMAP.md` to the Claude project after every phase closes.** The chat-side project files panel is separate from the repo; future chats plan against whatever's in that panel. Stale docs = stale plans.

**Two-tool split that emerged in Phase 2B**: Claude Code for structural builds (large multi-file phases) and diagnostic-fix work (when bugs need live environment investigation with temporary debug markers, screenshots, and reasoning across multiple files). Claude.ai chat for surgical fixes (when the fix is precise enough that I can write the changed file in full and Nick can paste it in), strategic decisions, brief drafting, and review. Phase 2B refinement used both: chat-driven first (5 surgical files), then Claude Code with a diagnostic prompt for the three deeper rendering bugs that needed actual on-device investigation.

## Phases — done and planned

### Done

- **Phase 0** — Monorepo scaffold + Expo SDK 54 app booting cleanly.
- **Phase 0.5** — Design source, product brief, design rules, count-design skill in place.
- **Phase 1A** — NativeWind v4 wired (Tailwind 3.4, Babel + Metro config).
- **Phase 1B** — Workspace packages scaffolded; Metro monorepo-aware.
- **Phase 1C** — Design tokens (`@count/tokens`), Tailwind theme, glass layer (`GlassPanel` × 3 variants, `RadialBackdrop`, `KeylineGlow`), atomic primitives (`SafePill`, `SignalBadge`, `SignalMini`, `FormPill`, `ScorePill`, `Icon` with all 32 glyphs), demo screen, post-review fixes (safe area, dark-mode lock, `arrow-left` bug). Verified on real iPhone via Expo Go.
- **Phase 2A** — App-shell chrome: custom `BottomNav` (5 tabs, glass + blur), `NotePadBar` (visual-only empty state — `pointerEvents="none"`, no hook, no state; just chrome), `SectionHead` primitive, multi-format `Kit` component (`shirt` | `mini` | `square` variants). Team registry (47 teams across 6 leagues) in `apps/mobile/src/mock/teams.ts`. Domain types (`Team`, `TeamKit`, `KitPattern`, `FormResult`) in `@count/types`. Four stub tab screens + shared `StubScreen` scaffold. Verified on real iPhone via Expo Go after a Phase 2A.5 hotfix to `BottomNav` (see Known gotchas below).
- **Phase 2B** — Dashboard screen against typed mock data: branding header with logo + icon buttons, auto-advancing hero carousel (3 slides, dots, fade-up), greeting block, horizontally-scrolling Today's Fixtures row (`FixtureCard` × 6), featured-match panel (meta, teams row, depth row, "Open fixture" CTA — tug-of-war chart deferred), Top Research Today list (`ResearchCard` × 3), Pickup row (`PickupCard` × 2), Scan grid (`ScanCard` × 4). New shared components: `HeroCarousel`, `HeroDecor`, `FixtureCard`, `HScroll`, `FeaturedMatch`, `ResearchCard`, `PickupCard`, `ScanCard`, `IconButton`. New mocks: `carousel`, `fixtures`, `research`, `featured`. `RadialBackdrop` hoisted to root layout. Verified on real iPhone via Expo Go after a chat-driven surgical-fixes round (5 files: padding/layout calibration) and a Claude Code diagnostic-fixes round (3 files: backdrop transparency, GlassPanel inner-style, dots Pressable). Three new known gotchas surfaced — see below.

### Planned (rough order, scope subject to confirmation)

The fixture-detail screen turned out larger than originally scoped. What was a single "Phase 3" in earlier planning is now split across three phases (3, 4, 5) — the original Phase 3 description ("Fixture detail screen with Summary / Matrix / AI tabs and tug-of-war chart") is **superseded** by the breakdown below. Pattern engine, search, builders, and everything downstream renumber accordingly.

- **Phase 2.5** — Sportmonks API spike (Nick, manual). Confirm data shapes for the leagues at MVP (Premier League, EFL Championship, La Liga, Serie A, Bundesliga). Specifically: (a) trial-tier access to **historical** fixture and player stats (the pattern engine needs season-long history, not just upcoming), (b) league coverage match against MVP list, (c) confirm xG/xGoT availability on the base Statistics include (Sportmonks restructured to single-tier pricing in 2026; xG no longer gated). No code; notes only.
- **Phase 3** — **Note Pad subsystem + Fixtures listing + fixture detail route stub.** Build the NotePad context, provider, hook, sheet, leg-row from scratch (Phase 2A's `NotePadBar` is visual-only chrome). Replace the Fixtures tab stub with the full `FixturesList` screen (date strip, comp filter, league-grouped fixture cards with addable Safe pills). Stand up `/fixture/[id]` as a route with header + tab strip showing the four labels but no tab content. Dashboard fixture-row `onPress` TODOs wire to the new route. First *interactive* addable mechanic ships. No Matrix, no tab content yet, no save-to-Builders flow.
- **Phase 4** — **Fixture detail tab contents — Overview, Team stats, Player stats.** Three of the four tabs filled in. Overview: hero panel, win-probability bar, Strongest angles addable list, H2H + Referee panels, "Build a builder" CTA panel routing to The Count tab. Team stats: window selector dropdown + side-by-side comparative grid (the signature interaction — every compound component spec'd with explicit flex-direction and sibling order). Player stats: collapsible per-stat sections with addable player threshold pills. The Count tab remains a stub in this phase.
- **Phase 5** — **The Count tab + Dashboard tug-of-war back-fill.** Fixture Preview with inline-coloured-span prose, Suggested Builder (leg-count + risk-tier seg controls, generate → result block with computed combined implied probability), Fixture Intel "Available soon" skeleton. Also slots the deferred tug-of-war chart into the Dashboard featured-match panel (where it originally belonged before Phase 2B deferred it).
- **Phase 6** — **Pattern engine against static data.** Implement `@count/pattern-engine`. Pure TS. Given fixtures + events, produce hit rates / consistency scores / volatility / streaks / confidence ratings. Validate against one season of static Premier League data. Now's the moment because screens above know exactly what shape of outputs they want.
- **Phase 7** — **Search + Builders screens (mock data).** Search screen (preset filters, custom searches, "Ask The Count" input placeholder). Builders screen (current builder being assembled in the Note Pad, saved builders list, builder result detail with leg-by-leg outcome). Save-to-Builders flow stubbed in Phase 3 becomes real here. At this point the app is end-to-end demoable on a phone.
- **Phase 8** — **Supabase auth + schema.** Nick creates the project (EU-west). Apple Sign In, Google, magic link. Schema for users, saved fixtures, saved builders, saved searches. `@count/api` typed client.
- **Phase 9** — **Sportmonks ingestion pipeline.** Edge Functions fetching from Sportmonks, transforming to `@count/types`, upserting to Postgres. Back-fill of one season. Rate-limit-aware.
- **Phase 10** — **Wire real data into screens.** Mock layer becomes adapter layer. Loading + error states fleshed out everywhere.
- **Phase 11** — **Anthropic integration for The Count.** Suggested Builder generation and natural-language search both routed through Supabase Edge Functions (API key never in client). Outputs grounded in deterministic pattern-engine data — synthesis, not invention.
- **Phase 12** — **Polish + submission.** Empty/loading/error audit. Accessibility. Age gate. Android device pass (deferred from 2A/2B/3). Logo PNG re-export. Font decision. Store listings, privacy policy, age-gate, screenshots. EAS Build + EAS Submit. Apple review shepherding (expect 2–3 weeks back-and-forth on gambling-adjacent).

## Known gotchas (carry forward)

These are issues encountered in shipped phases that future briefs and Claude Code sessions need to know about. Not bugs in master — solved problems whose context shouldn't get lost.

1. **`Pressable` style-as-function dropped properties (Phase 2A).** Claude Code's first pass at `BottomNav` used `style={({ pressed }) => ({ flex: 1, alignItems: 'center', ... })}` — the object-returning function. On the rendered device, `flex: 1` and other props were silently dropped, causing tabs to collapse to content-width and labels to cram against the left edge. Fixed by switching to `style={({ pressed }) => [staticStyleObject, pressed && { opacity: 0.7 }]}` (array form, with the bulk of styles as a static object). When writing any new `<Pressable>`, prefer the array-form style with static objects over a function returning a fresh object.

2. **Typed-routes regeneration needs an explicit step (Phase 2A).** `expo-router` only writes `.expo/types/router.d.ts` from Metro's watcher during `expo start`. Neither `expo export` nor `tsc --noEmit` triggers regeneration. After adding or removing tab files, run `node apps/mobile/scripts/regen-typed-routes.js` before `pnpm typecheck` or the typecheck will fail on stale route literals.

3. **`expo-blur` intensity is not linear with CSS blur(px) (Phase 2A).** Calibrated by feel on real iPhone: `intensity={40}` for `BottomNav` (CSS spec was `blur(18px)`), `intensity={50}` for `NotePadBar` (CSS spec was `blur(20px)`). These read as "moderate dark frosted" against typical content. On Android, `expo-blur` falls back to a translucent dark fill — the gradient + opacity still read as a separated surface but the frosted effect is iOS-only. Accepted, documented in the relevant component comments.

4. **Hard-stop gradients in RN need 4 stops, not 2 (Phase 2A).** `expo-linear-gradient` with two colour stops smooth-fades across the box. To reproduce the source's hard 50/50 split in `Kit`'s `square` variant for the `vertical_halves` pattern, the gradient uses 4 stops with locations `[0, 0.5, 0.5, 1]`. Any future port of a CSS hard-stop gradient should use the same trick.

5. **Always `cd apps/mobile` before `npx expo start` (Phase 2A workflow).** Running from repo root tries to install Expo globally because there's no local install at the root. Mobile app is at `apps/mobile/`.

6. **Note Pad position uses `insets.bottom + 70` (Phase 2A).** `70` is the nav's content height (icon 22 + label 14 + gaps 12 + padding 8 + margin 14) without the bottom safe-area inset. The Pad sits above the nav with this offset. If the nav design changes height, this constant needs revisiting.

7. **React Navigation's `DarkTheme.colors.background` is opaque `rgb(1,1,1)` and paints on every navigator's scene container (Phase 2B).** Setting `Stack.screenOptions.contentStyle = { backgroundColor: 'transparent' }` only reaches the Stack's direct screens — it does NOT propagate into nested navigators like the `(tabs)` `BottomTabNavigator`. The result: any tab screen paints near-black over a backdrop hoisted at the root, hiding it completely. To use a transparent backdrop pattern, derive a custom theme with `colors.background` and `colors.card` both `'transparent'` and pass to `ThemeProvider` at the root. The root `View` below the `ThemeProvider` owns the actual base tint via `colors.bg.page` so the screen isn't a true alpha hole. See `apps/mobile/app/_layout.tsx` (`TransparentDarkTheme`) and `docs/phases/phase-2b-debug-notes.md` for the full investigation.

8. **`GlassPanel`'s `style` prop applies to the INNER bordered View, not the outer wrapper (Phase 2B).** This is a load-bearing API quirk. Callers pass `padding` / `minHeight` / `borderRadius` and they take effect on the visible bordered surface, not on the layout box. The outer wrapper exists solely to host the iOS shadow + the `KeylineGlow` at `top: -0.5`. Phase 1C's original demo used a `<PanelBody>` helper that wrapped children inside, hiding this requirement. When Phase 2B started passing `padding` via `style`, the outer was padding its children inward and the visible border was floating 16-20px inset from layout bounds. Fixed by moving the `style` spread to the inner View. **Consequence**: if a future caller needs the outer to grow (e.g. `flex: 1` from a parent row), wrap the `GlassPanel` in a sizing `<View>` — don't pass flex via the `style` prop. See `ScanCard` and `PickupCard` wrapper patterns in `apps/mobile/app/(tabs)/index.tsx`.

9. **`Pressable` childless + small height + array-form style can still drop properties (Phase 2B).** The Phase 2A gotcha #1 was about the object-returning variant (`style={() => obj}`). Phase 2B found the same family of bug with the **array form** when the Pressable has no children, is sub-4px tall, and the returned array contains a freshly-allocated object literal on every render. The hero carousel dots (16×2 pillets) painted no `backgroundColor` despite the style array being correct. Workaround: keep `Pressable` for touch only, paint visuals on a child `<View>` whose own style is deterministic. See `HeroCarousel.tsx` dots implementation. Rule of thumb: any time a `Pressable` would be smaller than a typical tap target and has no children, refactor to `<Pressable><View style={...} /></Pressable>`.

## Open questions / unresolved

These need decisions before the relevant phase but not today:

- Sportmonks paid plan choice (post-trial): depends on Phase 2.5 spike findings on league coverage and historical data access. Likely Growth tier given five leagues at MVP, but confirm against trial.
- Supabase region: EU-west (Nick is in London).
- Font licensing: Söhne is licensed and not bundled in V1; fallback to Inter / SF Pro Text via the system stack. Custom font loading deferred — decision needed on whether to ship Söhne licensed or pick a free alternative (Inter is the natural choice).
- The "bet builder" terminology in the saved-builders flow needs rewording for App Store policy compliance — decision deferred to closer to submission. (Current naming: Note Pad → Builder → Leg. Likely safe but final call at submission.)
- The logo PNG (`apps/mobile/assets/count-logo.png`) currently has the gold glow baked into the image canvas. The radial falloff clips at the canvas edges when rendered, creating a faint rectangular halo around the glow. Re-export with more transparent bleed before V1 polish.
- Android device pass deferred from Phase 2A and Phase 2B — both phases verified on iPhone only. Android verification should happen before Phase 4 (Team/Player stats grid is the most layout-sensitive screen and Android quirks will bite hardest there) or as part of Phase 12 polish at the latest.
- Odds add-on (Sportmonks): held back from V1 per decision 12. Reconsider for V1.1 — would enable "target builder odds" feature (e.g. "build me a 3/1 from 4/5+ patterns").

## App Store policy notes

Apple and Google both have policies on gambling-adjacent apps. Count is a *research and history journal*, not a sportsbook — users do not place bets in the app, no money flows, no odds quoted in V1. Positioning matters in the store listing. The "bet builder" terminology is fine as long as copy never claims certainty or facilitates a transaction. Age gate (17+ iOS, 18+ Android) and possible geographic restrictions will be needed. Both developer accounts already active (used previously for the Dezrez app).

## Environment

- Codespaces is the primary dev surface.
- Node 24 in Codespaces (Expo SDK 54 officially supports Node 20.19.4+; 24 works fine in practice).
- pnpm 10.32+.
- `.env.example` documents environment variables; `.env.local` is gitignored and never committed.