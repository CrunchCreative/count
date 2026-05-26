# Count — Roadmap to V1

The path from where we are to apps live in the App Store and Google Play. Updated when scope changes or phases complete.

---

## V1 done definition

A user can:

1. Open the app on iOS or Android, see today's fixtures with statistical signals visible at a glance.
2. Tap any fixture and see deep research: a Summary view of strongest angles, a Matrix view of side-by-side comparative stats, and an AI brief.
3. Search across fixtures, teams, players, referees using preset filters, custom criteria, or natural-language queries.
4. Build a multi-leg "builder" — either manually by tapping `+` on Safe pills, or AI-assisted by asking for a builder for a fixture.
5. Save builders, fixtures, and searches to a profile that persists across sessions.
6. See the historical outcome of past saved builders (win/loss tracking against the data feed) — no real-money interaction, just history.

V1 does **not** include: in-play data, odds display, live notifications, social features, fantasy integrations, or web access.

V1 must include: empty/loading/error states for every screen, age gate (17+ iOS, 18+ Android), and App Store / Play Store approval.

---

## Current position

**Done:** Phases 0, 0.5, 1A, 1B, 1C. Foundation, design system, atomic primitives. App boots on real iPhone via Expo Go. See PROJECT-STATE.md for detail.

**Next:** Phase 2.

**Remaining work to V1:** ~8 phases, of which 5 are UI-with-mock-data (fast), 2 are data infrastructure (slow), 1 is AI integration, plus polish/submission.

---

## Phase plan

Each phase is one Claude Code session unless flagged otherwise. Phases run sequentially unless marked parallelisable.

### Phase 2 — Bottom nav + Dashboard screen

Replace the React Navigation default tab bar with the custom 5-item glass nav (Home / Fixtures / Search / Builders / Profile). Build the Dashboard screen with all sections: header, featured fixture hero, date strip, fixture rows, "Strongest angles today," and the slip bar (empty state).

**Depends on:** Phase 1C. ✓ done.
**Probably needs:** team kit SVGs from `kit.jsx` ported into `@count/ui`. Fixture rows show kits.
**Output:** A real Dashboard rendering against typed mock data, navigable bottom nav.
**Effort:** 1 Claude Code session (~30–40 min). Possibly 2 if team kits get split out.

### Phase 2.5 — Sportmonks API spike

Nick, manual, 1 hour. Sign up for Sportmonks, get a trial API key, hit 3–5 endpoints with `curl` or browser. Goal: confirm the data shapes Count needs actually exist. No code written. Notes captured for reference.

**Depends on:** nothing.
**Output:** A short notes doc (`docs/sportmonks-spike.md`) summarising endpoint shapes and confirming assumptions.
**Effort:** ~1 hour, Nick alone.
**Parallelisable with:** Phase 2 or 3.

### Phase 3 — Fixture detail screen

The match research screen with three tabs: Summary (insight-led), Matrix (the signature side-by-side comparison view), AI (conversational placeholder). All against mock data. The Matrix view is the product's signature interaction — this is the most important screen.

**Depends on:** Phase 2 (uses bottom nav, same component vocabulary).
**Output:** Full fixture detail screen, navigable from a fixture row tap.
**Effort:** 1–2 Claude Code sessions. The Matrix view alone is substantial.

### Phase 4 — Pattern engine against static data

Implement `@count/pattern-engine`. Pure TypeScript. Given a typed input (fixtures, events), produce typed outputs (hit rates, consistency scores, volatility, streaks, confidence ratings). Validate against a static historical dataset (e.g. one season of Premier League data, mocked or downloaded once from Sportmonks).

**Why now:** the screens are built; we know exactly what outputs they consume. The engine isn't speculative.

**Depends on:** Phases 2 + 3 (so we know what outputs are needed). Phase 2.5 ideally (so we know what input shapes Sportmonks delivers).
**Output:** A unit-tested deterministic engine that the mock data layer can adopt.
**Effort:** 1 long Claude Code session. The engine maths matters more than the framing.

### Phase 5 — Search + Builders screens

Search screen (preset filters, custom searches, AI search input placeholder). Builders screen (current builder being assembled, saved builders list, builder result detail with leg-by-leg outcome). All mock data.

**Depends on:** Phases 2 and 3 (uses same primitives).
**Output:** All 5 primary screens of the app are now navigable with mock data. App is feature-complete-looking, just not data-real.
**Effort:** 1–2 Claude Code sessions.

**At this point:** the app is demoable end-to-end on a phone. Could be shown to potential users for feedback before committing to real data.

### Phase 6 — Supabase auth + schema

Create the Supabase project (Nick, one-time, EU-west region). Implement auth flows (Apple Sign In, Google, magic link). Design and migrate the schema for users, saved fixtures, saved builders, saved searches. Wire `@count/api` with typed client functions.

**Depends on:** Phases 2–5 (knows what data needs persisting).
**Output:** Real auth on real backend. Mock data still in use for fixtures/events; only user-owned data hits Supabase.
**Effort:** 1–2 sessions. Auth flows are fiddly. Nick handles Supabase account + region setup.

### Phase 7 — Sportmonks ingestion pipeline

Edge Functions on Supabase that fetch from Sportmonks, transform to Count's typed domain shapes (via `@count/types`), upsert to Postgres. Scheduled to run on whatever cadence Sportmonks' rate limits allow. Includes back-fill of one season.

**Depends on:** Phase 6 (needs Supabase). Phase 2.5 (needs spike findings).
**Output:** Real football data flowing into Postgres on a schedule.
**Effort:** 1–2 sessions. Data transformation is the bulk; rate limiting and back-fill are real concerns.

### Phase 8 — Wire real data into screens

Replace mock data adapters with real `@count/api` calls everywhere. The mock layer becomes a fallback/dev mode. Loading and error states get fleshed out.

**Depends on:** Phase 7 (data is in DB).
**Output:** The app is real. Real fixtures, real signals from `@count/pattern-engine` against real data, real users.
**Effort:** 1 session, but a long one — every screen touches data.

### Phase 9 — Anthropic integration

AI-assisted builder generation. Natural-language search. Both routed through Supabase Edge Functions so the API key never lives in the client. Outputs are *always* grounded in deterministic data from the pattern engine — the AI explains and synthesises, it doesn't invent.

**Depends on:** Phase 8 (real data to ground the AI in).
**Output:** The AI surfaces of the app become real.
**Effort:** 1 session for the wiring, plus prompt engineering time that's hard to scope.

### Phase 10 — Polish + submission

Empty / loading / error states audited everywhere. Accessibility pass (VoiceOver, TalkBack, text scaling, contrast). Age gate. App Store / Play Store listing copy. Privacy policy. Terms. Test on multiple device sizes. App icons, splash screens, screenshots for store listings. EAS Build + EAS Submit configuration. First-submission shepherding through Apple's review (expect 2–3 weeks back-and-forth on a gambling-adjacent app).

**Depends on:** Phase 9 (everything else is done).
**Output:** Live on App Store and Google Play.
**Effort:** 2–4 weeks elapsed, including review time. Submission alone is unpredictable.

---

## Critical path

Phases 2 → 3 → 4 → 5 are the UI-and-engine track. Phases 6 → 7 → 8 are the data track. Phase 9 layers on top. Phase 10 is the gate.

The longest single-task risk is Apple review on the first submission. The longest single-phase risk is Phase 7 (ingestion pipeline — Sportmonks rate limits and data shape mismatches are real and hard to predict).

Nothing else is fundamentally blocking.

---

## Things deliberately NOT in V1

These come up — we say no, until V1 ships and we've learned what users actually want:

- Web app of any kind (marketing site can wait; sign-up funnel is in the mobile app).
- In-play / live data.
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
3. If a new phase needs inserting (unknown unknowns surface), add it with a sensible number.
4. Re-upload to the Claude project so future chats see the current version.

This is Nick's discipline to maintain. If a chat detects ROADMAP.md is stale (e.g. references phases we've talked about completing but it doesn't reflect), prompt to update.
