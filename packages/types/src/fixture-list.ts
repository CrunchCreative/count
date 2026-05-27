// Fixture-list domain types — drive the Fixtures tab (`FixturesList`).
// `FixtureListItem` is the cardinal record per league; `FixturesByLeague` is the
// shape of `FIXTURES_ALL` ported from docs/design-source/the-count-v2/project/data.js.

import type { LegTier } from './leg';

export interface FixtureListItem {
  id: string;
  /** Full league name, e.g. 'Premier League'. */
  league: string;
  kickoff: string;
  venue: string;
  /** Home team code, e.g. 'MCI'. */
  home: string;
  /** Away team code. */
  away: string;
  /** Signal score 0-100. */
  signal: number;
  topAngle: {
    /** Display threshold — '8+', '↑4.5', '—'. */
    threshold: string;
    /** Display hits string, e.g. '5/5'. */
    hits: string;
    title: string;
    tier: LegTier;
  };
}

/** Keyed by league name, e.g. 'Premier League': FixtureListItem[]. */
export type FixturesByLeague = Record<string, FixtureListItem[]>;
