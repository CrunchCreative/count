# @count/api

Supabase client wrappers and typed query functions for Count.

This package owns every data-fetching boundary in the app — fixtures, teams, leagues, builders, saved searches, user profile. The mobile app does not talk to Supabase directly; it imports typed functions from here.

## Why a separate package

- The app stays unaware of where data comes from. Today it's Supabase + mock data; tomorrow it might be edge functions or a different backend.
- Types come from `@count/types`, so query return values are always domain types — no raw Postgres row shapes leaking into the UI.
- If we ever add a marketing site or admin tool, they can share this same data layer.

## What lives here (later)

- `supabaseClient.ts` — configured `@supabase/supabase-js` client.
- `queries/<entity>.ts` — typed functions for each entity (e.g. `getFixturesForDate`, `getFixtureById`, `saveBuilder`).
- Auth helpers (sign in with email link, OAuth Apple/Google).

Skeleton only at this phase — real implementation arrives when Supabase schema is defined.
