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
  /** Match official + their card-discipline averages. Drives the referee row on
   *  the Fixtures-list card. Full referee record (homeWinPct, cardsAboveAvg)
   *  lives on the deeper fixture shape used by the fixture-detail screen. */
  referee: {
    /** Display name, e.g. 'M. Oliver'. */
    name: string;
    /** Yellow cards issued per match, decimal — e.g. 4.2. */
    cardsPerMatch: number;
    /** Red cards issued per match, decimal — e.g. 0.13. */
    redsPerMatch: number;
  };
}

/** Keyed by league name, e.g. 'Premier League': FixtureListItem[]. */
export type FixturesByLeague = Record<string, FixtureListItem[]>;
