// Fixture-summary domain type — seeded from docs/design-source/the-count-v2/project/data.js.
// Covers the Dashboard's Today's-row fixtures, the Featured match's visible subset,
// and (via Pick<>) the base of ResearchItem. Phase 3+ screens may extend it.

export type SignalTier = 'high' | 'mid' | 'low';

export interface FixtureSummary {
  /** Stable id, used for routing (e.g. 'mci-cry'). */
  id: string;
  /** Full league name, e.g. 'Premier League'. */
  league: string;
  /** Two-letter league abbreviation, e.g. 'PL'. Optional — only present on Today's row. */
  leagueShort?: string;
  /** Kickoff time string, e.g. '17:30'. */
  kickoff: string;
  /** Venue name, e.g. 'Etihad'. */
  venue: string;
  /** Signal score 0-100. */
  signal: number;
  /** Home team code. */
  home: string;
  /** Away team code. */
  away: string;
  /** Referee display name. Only present on Today's row. */
  ref?: string;
  /** Referee cards-per-match. Only present on Today's row. */
  refCpm?: string;
  /** Marks the featured fixture in Today's row for elev styling. */
  primary?: boolean;
}
