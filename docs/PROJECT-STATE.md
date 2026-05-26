# Count — Project State

A snapshot for any Claude conversation joining this project. Keep this current as the source of truth for "where are we right now."

---

## What this is

Count is a native iOS + Android football intelligence and betting research app. Built by Nick at Crunch Creative. The product takes raw football event data — goals, shots, cards, corners, tackles, fouls, saves, throw-ins — and turns it into discoverable statistical patterns users can use as research for evidence-led betting decisions, then place those bets on a sportsbook elsewhere.

**Count is not a sportsbook.** Users do not place bets in the app. They build research, save fixtures and "builders" (multi-leg bet structures), and reference outcomes after the fact. No odds shown in V1. No money flow. No in-app betting.

The product's signature interaction is the **Matrix view** — horizontally scrollable, side-by-side comparison across teams, players, referees, and historical windows. This is the differentiator. No competitor offers this shape of comparison.

Two distinct user types share the same product:

- **Casual users** want AI-assisted insight, fast picks, builder suggestions.
- **Advanced users** want raw data visibility, full matrix research, manual pattern recognition.

Both must be served without forcing either into the other's workflow.

## Stack and infrastructure

- **Mobile:** Expo SDK 54 + React Native 0.81 + React 19.1 + TypeScript 5.9 (strict)
- **Routing:** Expo Router (file-based)
- **Styling:** NativeWind v4.2 (Tailwind 3.4) — locked, do not upgrade until v5 stabilises
- **Monorepo:** pnpm 10 + pnpm workspaces
- **Gradients & SVG:** `expo-linear-gradient`, `react-native-svg`
- **Data (planned):** Supabase (auth + Postgres + Edge Functions)
- **Ingestion (planned):** Sportmonks API for football data
- **AI (planned):** Anthropic (Claude) for AI-assisted builder generation and natural-language search
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
  ├── packages/types/              — Shared domain types (skeleton)
  ├── packages/api/                — Supabase wrappers (skeleton)
  ├── packages/pattern-engine/     — Pure-TS deterministic stats engine (skeleton)
  ├── supabase/                    — Migrations + functions (skeleton)
  ├── docs/                        — All documentation
  └── .claude/skills/count-design/ — Skill that auto-loads for any Claude Code session in this repo
  ```

## Documentation map

Everything in `docs/`:

- `docs/PRODUCT.md` — full product brief (audience, principles, market scope)
- `docs/DESIGN.md` — design system rules pointer; non-negotiables surfaced
- `docs/design-source/the-count-v2/` — canonical design source (HTML/CSS/JSX prototype with `README.md` documenting the visual system)
- `docs/phases/phase-1c-brief.md` — what Phase 1C asked Claude Code to build
- `docs/phases/phase-1c-summary.md` — what Claude Code reported back, with honest visual deltas

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

## Workflow

The current dev pattern:

1. **Conversation with Claude in claude.ai** — strategic planning, scoping, brief drafting, reviewing diffs, debugging.
2. **Brief committed to repo** at `docs/phases/phase-Nx-brief.md`.
3. **Claude Code in the Codespace terminal** (`npx -y @anthropic-ai/claude-code`) executes the brief autonomously, reading the brief, the design source, and the existing scaffold; writing the code directly into the repo; running typechecks and bundle verifications.
4. **Claude Code stops without committing** when it finishes; writes a `phase-Nx-summary.md`.
5. **We review the diff together** in chat — Nick pastes `git status`, `git diff --stat`, and the summary doc. We work through any issues.
6. **Commit and push to `main`** when satisfied.
7. **Test on a real device via Expo Go** (`npx expo start --tunnel` from `apps/mobile/`, scan QR with iPhone Camera app). Screenshots reviewed in chat for visual deltas.

This pattern has worked well for Phase 1C. It separates *planning* (which benefits from a wide context window and conversation) from *execution* (which benefits from autonomy and rapid iteration in the actual environment).

## Phases — done and planned

### Done

- **Phase 0** — Monorepo scaffold + Expo SDK 54 app booting cleanly.
- **Phase 0.5** — Design source, product brief, design rules, count-design skill in place.
- **Phase 1A** — NativeWind v4 wired (Tailwind 3.4, Babel + Metro config).
- **Phase 1B** — Workspace packages scaffolded; Metro monorepo-aware.
- **Phase 1C** — Design tokens (`@count/tokens`), Tailwind theme, glass layer (`GlassPanel` × 3 variants, `RadialBackdrop`, `KeylineGlow`), atomic primitives (`SafePill`, `SignalBadge`, `SignalMini`, `FormPill`, `ScorePill`, `Icon` with all 32 glyphs), demo screen, post-review fixes (safe area, dark-mode lock, `arrow-left` bug). Verified on real iPhone via Expo Go.

### Planned (rough order, scope subject to confirmation)

- **Phase 2** — Custom bottom navigation + Dashboard screen with typed mock data. Probably also team kit SVGs (`kit.jsx` port) since the dashboard's fixture rows show kits.
- **Phase 2.5** — Sportmonks API spike (Nick, manual). Confirm data shapes.
- **Phase 3** — Fixture detail screen (Summary, Matrix, AI tabs) with mock data.
- **Phase 4** — Pattern engine implementation against a static historical dataset (no Supabase, no ingestion, just `engine(fixtures) → signals`). Validates the maths in isolation.
- **Phase 5** — Search + Builders screens with mock data.
- **Phase 6** — Supabase schema + auth (Apple, Google, magic link).
- **Phase 7** — Sportmonks ingestion pipeline (Edge Functions).
- **Phase 8** — Wire live data into all screens. Mock layer becomes adapter layer.
- **Phase 9** — Anthropic integration for AI builder + natural-language search.
- **Phase 10** — Edge cases, empty/loading/error states, accessibility, App Store + Play Store submission prep.

## Open questions / unresolved

These need decisions before the relevant phase but not today:

- Bottom nav structure: 5 tabs (Home / Fixtures / Search / Builders / Profile) per the design source reference image — confirmed visually but not yet implemented.
- Sportmonks plan tier: trial first, paid plan choice depends on league coverage needs (Premier League, EFL Championship, La Liga, Serie A, Bundesliga at MVP).
- Supabase region: EU-west (Nick is in London).
- Font licensing: Söhne is licensed and not bundled in V1; fallback to Inter / SF Pro Text via the system stack. Custom font loading deferred — decision needed on whether to ship Söhne licensed or pick a free alternative (Inter is the natural choice).
- The "bet slip" terminology in the saved-builders flow needs rewording for App Store policy compliance — decision deferred to closer to submission.

## App Store policy notes

Apple and Google both have policies on gambling-adjacent apps. Count is a *research and history journal*, not a sportsbook — users do not place bets in the app, no money flows, no odds quoted in V1. Positioning matters in the store listing. The "bet builder" terminology is fine as long as copy never claims certainty or facilitates a transaction. Age gate (17+ iOS, 18+ Android) and possible geographic restrictions will be needed. Both developer accounts already active (used previously for the Dezrez app).

## Environment

- Codespaces is the primary dev surface.
- Node 24 in Codespaces (Expo SDK 54 officially supports Node 20.19.4+; 24 works fine in practice).
- pnpm 10.32+.
- `.env.example` documents environment variables; `.env.local` is gitignored and never committed.
