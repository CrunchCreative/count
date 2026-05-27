# Count — Roadmap to V1

The path from where we are to apps live in the App Store and Google Play. Updated when scope changes or phases complete.

---

## V1 done definition

A user can:

1. Open the app on iOS or Android, see today's fixtures with statistical signals visible at a glance.
2. Tap any fixture and see deep research: an Overview of strongest angles, Team stats and Player stats comparative grids, and a "The Count" brief.
3. Search across fixtures, teams, players, referees using preset filters, custom criteria, or natural-language queries ("Ask The Count").
4. Build a multi-leg "builder" — either manually by tapping `+` on Safe pills, or engine-assisted by asking The Count for a builder.
5. Save builders, fixtures, and searches to a profile that persists across sessions.
6. See the historical outcome of past saved builders (win/loss tracking against the data feed) — no real-money interaction, just history.

V1 does **not** include: in-play data, odds display, live notifications, social features, fantasy integrations, or web access.

V1 must include: empty/loading/error states for every screen, age gate (17+ iOS, 18+ Android), and App Store / Play Store approval.

---

## Current position

**Done:** Phases 0, 0.5, 1A, 1B, 1C, 2A, 2B, 3, 3.5, 3.6, 3.6.1, 3.6.2. Foundation, design system, atomic primitives, app shell, full Dashboard, Note Pad subsystem, Fixtures listing, fixture detail route stub, persistent header with scroll-driven blur, scroll reset on tab focus, filter chip rendering. App boots on real iPhone via Expo Go.

**Next:** Phase 4 — fixture detail tab contents (Overview, Team stats, Player stats).

**Remaining work to V1:** ~9 phases. Two are UI-with-mock-data (Phase 4 fixture-detail tabs, Phase 5 The Count tab, Phase 7 search/builders), one is the pattern engine (Phase 6), three are data infrastructure (Phases 8–10), one is engine integration (Phase 11), one is polish + submission (Phase 12).

---

## Phase plan

Each phase is one Claude Code session unless flagged otherwise. Phases run sequentially unless marked parallelisable. Sub-phases (e.g. 3.5, 3.6) are surgical follow-ups that emerged during device testing — fully shipped, banked in PROJECT-STATE's "done" list.

### Phase 2.5 — Sportmonks API spike

Nick, manual, 1 hour. Sign up for Sportmonks, get a trial API key, hit 3–5 endpoints with `curl` or browser. Specific checks:

- (a) **Historical fixture stats** accessible on trial, not just upcoming — the pattern engine needs season-long historical data.
- (b) **League coverage** confirmed for the five MVP leagues: Premier League, EFL Championship, La Liga, Serie A, Bundesliga.
- (c) **xG / xGoT on base Statistics include** — Sportmonks restructured to single-tier pricing in 2026; confirm xG is no longer a paid add-on and lands in the standard stats payload.

No code written. Notes captured for reference.

**Depends on:** nothing.
**Output:** A short notes doc (`docs/sportmonks-spike.md`) summarising endpoint shapes and confirming the three checks above.
**Effort:** ~1 hour, Nick alone.
**Parallelisable with:** Phase 4.

### Phase 4 — Fixture detail tab contents: Overview, Team stats, Player stats

Three of the four tabs filled in:

- **Overview:** hero panel with kits + form + kickoff + win-probability segmented bar, Strongest angles addable list, H2H + Referee two-up panel, "Build a builder for this fixture" CTA panel routing to The Count tab pre-filled with the chosen risk tier.
- **Team stats:** window selector dropdown (L5 / L10 / L20 / Season), comparative grid with two stacked sides — home then away — each side has fixture column heads, scoreline pills, then category-grouped rows (ATTACK / SET PIECES / DISCIPLINE), each row with addable threshold pill on the left and 5 fixture-cell values with amber underline marks. Footer scroll hint + show-all toggle. xG / xGoT columns considered in the brief — they're in the Sportmonks base stats include now, so worth adding to the ATTACK category if the layout supports it.
- **Player stats:** collapsible per-stat sections (Player fouls committed, Player shots on target, Player shots, Player to be fouled, Player tackles, Player cards), each section open shows home then away player rows with kit number square + name + addable threshold pill + 5 value cells.

The Count tab remains a stub (placeholder under the tab content slot).

**Brief discipline (lessons from Phase 2B + 3.5/3.6.2):** The comparative-grid tabs are denser and more compound than anything yet shipped. Every compound component spec MUST state parent flex-direction, sibling order, and child sizing rules explicitly. CSS values from the design source MUST be cited by selector AND line number, with parent/child DOM relationships called out so segments-vs-containers don't get conflated. Don't assume the agent can infer layout from the prototype.

**Depends on:** Phase 3 ✓ done. Phase 2.5 ideally (Sportmonks shapes for xG/xGoT) — but mock data can proceed without.
**Output:** Three of four fixture-detail tabs working with mock data. Addable pills on each tab feed the Note Pad.
**Effort:** 1–2 Claude Code sessions. Team stats grid alone is substantial — likely splits into 4A (Overview + tab strip wiring) and 4B (Team stats + Player stats grids).

### Phase 5 — The Count tab + Dashboard tug-of-war back-fill

The fourth tab. Three blocks:

- **Fixture Preview** — multi-paragraph prose summary with inline coloured spans (teal for safe patterns, amber for headline pattern). Mock content this phase; Anthropic integration is Phase 11.
- **Suggested Builder** — leg-count seg control (2 / 3 / 4 / 5 / 6), risk-tier seg control (Safe / Balanced), "Generate" CTA → result block with picked legs and computed combined implied probability. "Save to Builders" footer (still stubbed in this phase, real save in Phase 7).
- **Fixture Intel** — "Available soon" skeleton panel as placeholder for line-up changes / injury / weather / opponent-adjusted form.

Also slots the **tug-of-war chart** into the Dashboard featured-match panel (where it originally belonged before Phase 2B deferred it). Source reference: `docs/design-source/the-count-v2/project/components/tug-of-war.jsx` and the `.tow / .tow-bar / .tow-row` CSS blocks in `styles.css`.

**Depends on:** Phase 4 (fixture detail shell + tabs).
**Output:** Fixture detail complete on all four tabs with mock data. Dashboard featured panel gets the deferred visualisation.
**Effort:** 1 Claude Code session.

### Phase 6 — Pattern engine against static data

Implement `@count/pattern-engine`. Pure TypeScript. Given a typed input (fixtures, events), produce typed outputs (hit rates, consistency scores, volatility, streaks, confidence ratings). Validate against a static historical dataset (e.g. one season of Premier League data, mocked or downloaded once from Sportmonks).

**Why now:** the screens are built; we know exactly what outputs they consume. The engine isn't speculative.

**Depends on:** Phases 4, 5 (so we know what outputs are needed). Phase 2.5 ideally (so we know what input shapes Sportmonks delivers).
**Output:** A unit-tested deterministic engine that the mock data layer can adopt.
**Effort:** 1 long Claude Code session. The engine maths matters more than the framing.

### Phase 7 — Search + Builders screens (mock data)

Search screen (preset filters, custom searches, "Ask The Count" natural-language input placeholder). Builders screen (current builder being assembled — surfaces what's in the Note Pad, saved builders list, builder result detail with leg-by-leg outcome).

**Save-to-Builders flow becomes real here.** The Phase 3 stubbed CTA now writes to a `builders` store and clears the Note Pad. The Builders screen reads from that store. Persistence is local-only (AsyncStorage) until Phase 8 brings Supabase in.

**Depends on:** Phases 3 ✓ + 5 (uses Note Pad and shared primitives).
**Output:** All 5 primary screens of the app are now navigable with mock data. App is feature-complete-looking, just not data-real.
**Effort:** 1–2 Claude Code sessions.

**At this point:** the app is demoable end-to-end on a phone. Could be shown to potential users for feedback before committing to real data.

### Phase 8 — Supabase auth + schema

Create the Supabase project (Nick, one-time, EU-west region). Implement auth flows (Apple Sign In, Google, magic link). Design and migrate the schema for users, saved fixtures, saved builders, saved searches. Wire `@count/api` with typed client functions. Migrate local-only Builders storage to Supabase.

**Depends on:** Phases 3–7 (knows what data needs persisting).
**Output:** Real auth on real backend. Mock data still in use for fixtures/events; only user-owned data hits Supabase.
**Effort:** 1–2 sessions. Auth flows are fiddly. Nick handles Supabase account + region setup.

### Phase 9 — Sportmonks ingestion pipeline

Edge Functions on Supabase that fetch from Sportmonks, transform to Count's typed domain shapes (via `@count/types`), upsert to Postgres. Scheduled to run on whatever cadence Sportmonks' rate limits allow. Includes back-fill of one season.

**Depends on:** Phase 8 (needs Supabase). Phase 2.5 (needs spike findings).
**Output:** Real football data flowing into Postgres on a schedule.
**Effort:** 1–2 sessions. Data transformation is the bulk; rate limiting and back-fill are real concerns.

### Phase 10 — Wire real data into screens

Replace mock data adapters with real `@count/api` calls everywhere. The mock layer becomes a fallback/dev mode. Loading and error states get fleshed out.

**Depends on:** Phase 9 (data is in DB).
**Output:** The app is real. Real fixtures, real signals from `@count/pattern-engine` against real data, real users.
**Effort:** 1 session, but a long one — every screen touches data.

### Phase 11 — Anthropic integration for The Count

Engine-assisted Suggested Builder generation. Natural-language search ("Ask The Count"). Both routed through Supabase Edge Functions so the API key never lives in the client. Outputs are *always* grounded in deterministic data from the pattern engine — The Count explains and synthesises, it doesn't invent.

**Depends on:** Phase 10 (real data to ground the engine in).
**Output:** The Count's intelligent surfaces become real.
**Effort:** 1 session for the wiring, plus prompt engineering time that's hard to scope.

### Phase 12 — Polish + submission

Empty / loading / error states audited everywhere. Accessibility pass (VoiceOver, TalkBack, text scaling, contrast). Age gate. App Store / Play Store listing copy. Privacy policy. Terms. Test on multiple device sizes. App icons, splash screens, screenshots for store listings. EAS Build + EAS Submit configuration. First-submission shepherding through Apple's review (expect 2–3 weeks back-and-forth on a gambling-adjacent app).

Includes deferred items: Android device pass (still pending from Phases 2A/2B/3 and all 3.5/3.6 sub-phases), logo PNG re-export with proper glow bleed, font decision (Söhne licensed vs Inter).

**Depends on:** Phase 11 (everything else is done).
**Output:** Live on App Store and Google Play.
**Effort:** 2–4 weeks elapsed, including review time. Submission alone is unpredictable.

---

## Critical path

UI-and-engine track: Phases 4 → 5 → 6 → 7. Data track: Phases 8 → 9 → 10. The Count integration: Phase 11. Submission gate: Phase 12.

The longest single-task risk is Apple review on the first submission. The longest single-phase risks are Phase 9 (ingestion pipeline — Sportmonks rate limits and data shape mismatches are real and hard to predict) and Phase 4 (the comparative-grid tabs — densest layout work in the codebase, where the Phase 2B "agent misreads layout direction" pattern + Phase 3.5/3.6.2 "agent misreads CSS container/segment relationships" pattern would hurt most).

Nothing else is fundamentally blocking.

---

## Things deliberately NOT in V1

These come up — we say no, until V1 ships and we've learned what users actually want:

- Web app of any kind (marketing site can wait; sign-up funnel is in the mobile app).
- In-play / live data.
- **Odds display.** Available as a Sportmonks add-on (€14–€69) but held back to keep V1 firmly positioned as "research and history journal" for App Store purposes. The `Leg` type carries a reserved `odds?` slot for V1.1; no V1 component reads or renders it. Target-builder odds feature ("build me a 3/1") becomes a V1.1 release lever.
- Push notifications.
- Sportsbook integration (deep linking, account linking, cash-out, etc.).
- Social features (sharing builders, comments, follows).
- Fantasy football integrations.
- Multi-language support (English only at launch).
- Multiple sports (football only at launch).

---

## How this doc stays current

After every shipped phase, this file gets updated:

1. The phase moves from "remaining" to "done" — mark it complete in PROJECT-STATE.md too.
2. If the phase taught us something that changes future phases, edit those phases' scope.
3. If a new phase needs inserting (unknown unknowns surface), add it with a sensible number — sub-phase suffixes (3.5, 3.6) for surgical follow-ups, full integer increments for new major phases.
4. **Re-upload both PROJECT-STATE.md and ROADMAP.md to the Claude project files panel** so future chats see the current version. The repo is the source of truth but chats only see what's in the panel.

This is Nick's discipline to maintain. If a chat detects ROADMAP.md is stale (e.g. references phases we've talked about completing but it doesn't reflect), prompt to update.