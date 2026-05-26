# Count — Product Brief

> **Note on currency.** This brief was written when Count was being built as a Next.js web app with a different design system. The product strategy, audience, principles, vocabulary, and market scope below remain current. Technical assumptions (web-first, Next.js, the old design references) are superseded by:
>
> - `docs/DESIGN.md` for the current design system (source of truth at `docs/design-source/the-count-v2/project/`)
> - `README.md` for the current stack (Expo + React Native, iOS + Android)

## What it is

The Count is a football betting research and pattern discovery platform. It transforms raw football event data — goals, shots, cards, corners, tackles, fouls, saves, throw-ins — into discoverable statistical patterns that help users build evidence-led betting decisions.

It is **not** a sportsbook. Users do not place bets on The Count. They use it to research fixtures, surface patterns, generate "builders" (multi-leg bet structures), and then place those bets elsewhere on a sportsbook of their choice.

The platform sits in the gap between traditional football statistics sites (which are dense, abstract, hard to action) and sportsbook interfaces (which sell action without showing the reasoning behind it). The Count's job is to make the reasoning fast, visual, and trustworthy.

## Who it is for

Predominantly men aged 20–50 in the UK and Europe who currently research football bets manually across multiple sites and apps. They are confident with numbers, sceptical of hype, and value time. Two distinct user types share the same product surface:

**Casual users** want fast, AI-assisted insight. They want to pick a fixture, get a confident summary, and have a builder generated for them with reasoning attached.

**Advanced users** want raw data visibility, full matrix research, statistical scanning, and the ability to manually identify patterns the AI hasn't surfaced. They will dismiss any product that hides the underlying numbers.

The Count must serve both types without forcing either into the other's workflow.

## What success looks like for the user

A user lands on The Count before kickoff. Within seconds, they can see which fixtures have the strongest patterns aligned today. They can click into any fixture and instantly understand the strongest betting angles, with hit rates, consistency scores, and supporting evidence visible without effort. They can ask the AI to build them a multi-leg builder for that fixture grounded in the historical data, and the AI produces something they can actually validate. They can save fixtures, save builders, and come back the next week to do it all again faster.

The user feels empowered, not manipulated. They feel they understand _why_ a pattern is strong, not just that it is.

## Core differentiator

> Fixture-centric comparative matrix research with explainable statistical intelligence.

The matrix view — horizontally scrollable, side-by-side comparison across teams, players, referees, and historical windows — is the product's signature interaction. No competitor offers this. AI Stats shows abstract values. Sportsbooks show odds. Stats sites show tables. The Count shows comparison.

## What the platform does

**Ingests** football event data from Sportmonks across five leagues at MVP: Premier League, EFL Championship, La Liga, Serie A, Bundesliga.

**Calculates** deterministic statistical signals — hit rates, consistency scores, volatility measures, streak detection, confidence ratings — across multiple historical windows (last 3, 5, 10, 20, season).

**Surfaces** these signals through three primary interfaces:

1. A **fixture-first home and listing view** showing today's and upcoming matches with their strongest pattern signals visible at a glance.
2. A **match research screen** with three modes — Summary (insight-led), Matrix (comparative grid), AI (conversational).
3. A **smart search engine** with preset searches (BTTS + Cards, SOT players, etc.), custom user-defined searches, and natural-language AI-assisted searches.

**Generates** AI-assisted builders on request. The user picks a fixture, asks something like _"build me a 5-leg builder for this match that would have won in the last three meetings"_, and the AI returns a suggested builder with each leg backed by hit rate evidence. Every leg must show its supporting data; nothing the AI proposes can fail the explainability test.

**Persists** user research — saved fixtures, saved builders, saved searches — across sessions via Supabase.

## Markets supported at MVP

- Match result (1X2)
- Double chance
- Both teams to score (BTTS)
- Total goals (over/under thresholds)
- Team total cards
- Team total corners
- Team total shots
- Team total shots on target
- Team total fouls
- Team total tackles
- Team total saves
- Team total throw-ins (where data available)
- Player shots, shots on target, fouls, tackles, cards
- First team to score / first goalscorer

## Markets out of scope at MVP

In-play / live betting. Bet slip integration with sportsbooks. Cash-out. Acca insurance. Multiples calculator beyond the AI builder.

## Product principles

**Fixture-first architecture.** The fixture is the primary object. Every screen begins from or returns to a fixture.

**Data-led intelligence.** The data determines the strongest angles. The product never invents trends to fill space.

**Explainable by default.** Every surfaced trend, every AI suggestion, every confidence rating must be traceable to its underlying data. If we cannot explain why something is shown, we do not show it.

**No certainty.** The product never claims a bet will win. It surfaces _trends_, _alignment_, _consistency_, _historical tendency_. Forbidden words: guaranteed, lock, easy money, banker, certain.

**Calm in chrome, vibrant in data.** The interface chrome (navigation, panels, backgrounds) is calm and analytical. Vibrancy is reserved for data signals — confidence indicators, pattern strength, AI-surfaced insights. Vibrancy carries information; it never conveys urgency.

**Anti-casino.** No flashing colours, no aggressive prompts, no countdown timers, no "BET NOW" energy, no addictive UX patterns.

## What the product is not

Not a tipster service. Not a community / social product. Not a fantasy football tool. Not a live score app. Not a stats encyclopaedia. Not in-play. Not a sportsbook. Not free predictions wrapped in marketing.

## Technical context (for designers building inside it)

The product is a Next.js web application, mobile-first responsive. Data comes from Sportmonks via Supabase Edge Functions; the frontend never sees Sportmonks shapes directly. The Pattern Engine is a deterministic TypeScript package that computes all statistical signals — designs that depend on data must use names from this engine (hit rate, consistency score, confidence rating) consistently. The AI layer is Claude, accessed via Edge Functions; AI-generated content is always interpretation of deterministic data, never invented.

There is no native app. There is no offline mode. There is no real-time / push functionality. The product is a research tool; users come to it with intent, do their research, and leave to act on it elsewhere.
