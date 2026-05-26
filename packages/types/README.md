# @count/types

Shared domain types for Count — `Fixture`, `Team`, `League`, `Builder`, `Pattern`, `Signal`, and the rest of the vocabulary used across the app.

The shapes are seeded from `docs/design-source/the-count-v2/project/data.js` and `data-builders.js`, which document the canonical structure of every entity in the system. As we wire up real data via Sportmonks and Supabase in later phases, these types stay the single source of truth — Supabase rows, Sportmonks responses, and pattern-engine outputs all map onto them.

When a new entity emerges, it goes here first.
