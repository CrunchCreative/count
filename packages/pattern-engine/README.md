# @count/pattern-engine

Deterministic statistical pattern engine for Count.

Given event data (goals, shots, cards, corners, tackles, fouls, saves, throw-ins) for a team, player, referee, or fixture, this engine produces the signals that the app surfaces:

- Hit rates (e.g. "8+ corners in 18 of last 20")
- Consistency scores (how stable a hit rate is across the window)
- Volatility measures
- Streak detection (current run, longest run, run after specific contexts)
- Confidence ratings (0–100 signal strength)
- Window comparisons (L3 vs L5 vs L10 vs L20 vs season)

## Design constraints

- **Pure TypeScript**. No React Native, no Supabase, no fetch, no Date.now mid-calc, no randomness without a seed. The engine takes inputs, produces outputs, has no side effects.
- **Deterministic**. Same inputs → same outputs, always. Critical for unit testing and for trust.
- **Unit-testable in isolation**. Vitest, pure node. No mocks needed for anything.
- **Owns no data fetching**. Data comes in via function arguments, typed by `@count/types`. The engine doesn't know or care whether the data came from Supabase, Sportmonks, or a mock.

## Why a separate package

Three reasons:

1. **Trust.** Every credibility-critical number the app shows comes from here. If it lives in `apps/mobile` it gets entangled with UI concerns. Separated, it can be audited and tested in isolation.
2. **Reusability.** A future admin tool, marketing site stat-of-the-week, or batch ingestion job can all use the same engine without dragging in React Native.
3. **Performance discipline.** Forcing the boundary makes accidental I/O impossible.

Skeleton only at this phase — real implementation arrives when fixture data shapes stabilise.
