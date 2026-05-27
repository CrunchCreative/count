// FixtureDetail — the richer per-fixture record the fixture-detail screen
// consumes. Composes the lighter `FixtureListItem` (used by the listing card
// and the route's resolution lookup) with the deeper shape Overview, Team
// stats, Player stats, and The Count need. Phase 4A populates only what
// Overview reads; Phase 4B / 4C / 5 will reshape with their own additions.
//
// Source: docs/design-source/the-count-v2/project/data.js lines 126–147 for
// the MCI/CRY reference fixture. Phase 4A synthesises plausible per-fixture
// values for every other id in FIXTURES_ALL.

import type { FormResult } from './team';
import type { FixtureListItem } from './fixture-list';

export interface FixtureWinProb {
  /** Percentage 0–100. Home + draw + away should sum to 100. */
  home: number;
  draw: number;
  away: number;
}

export interface FixtureRefereeDetail {
  /** Full display name, e.g. 'Michael Oliver'. */
  name: string;
  /** Cards per match, decimal. */
  cpm: number;
  /** Home-win percentage under this referee, 0–100. */
  homeWinPct: number;
  /** Whether this referee's CPM is above the league average — drives the
   *  'Cards above avg' affordance on the referee panel. */
  cardsAboveAvg: boolean;
}

export interface FixtureH2H {
  /** Home wins in last 5 meetings. */
  home: number;
  /** Away wins in last 5 meetings. */
  away: number;
  /** Last meeting summary, e.g. '5-2 MCI'. */
  last: string;
}

export interface StrongestAngle {
  /** Display threshold, e.g. '2.5+', '8+', 'BTTS'. */
  threshold: string;
  /** Display hits string, e.g. '5/5'. */
  hits: string;
  /** Single-line headline, e.g. 'Match over 2.5 goals'. */
  title: string;
  /** Supporting one-liner under the title. */
  body: string;
}

// 4B: comparative team-matrix data.
//
// Architecture note: values are ALL stored for the full 38-fixture window.
// The visible window (5/10/20/38) is a *display* concern handled in the
// component; threshold and hits are *derived* per window via
// deriveThresholdForWindow. Storing only 5 values and re-synthesising for
// larger windows would produce different floors than displaying a slice of
// the same 38, so we commit to 38 stored values per stat per team.

export interface TeamMatrixStat {
  /** Match-by-match stat values, indexed 0 = most recent. Always length 38. */
  values: number[];
  /** Direction of the betting threshold this stat supports.
   *  - 'gte': over-style (e.g. "City shots ≥ 4"). Threshold is the floor.
   *  - 'lte': under-style (e.g. "City fouls ≤ 12"). Threshold is the ceiling.
   *  Used by deriveThresholdForWindow and by the cell tap-to-add semantic.
   */
  dir: 'gte' | 'lte';
  /** Target value, only present for 'lte' stats (used to render dim cells for
   *  values that exceeded the target). For 'gte' stats, the target is implicit
   *  in the derived window floor. */
  target?: number;
  /** Whether this stat is shown by default or only when "Show all stats" is on. */
  defaultVisible: boolean;
}

/** Fixture-by-fixture column header data — opponent code, date, scoreline, W/D/L. */
export interface TeamMatrixFixture {
  /** Short date label, e.g. '09 May'. */
  date: string;
  /** Opponent team code, e.g. 'BRE'. */
  opp: string;
  /** Whether the recorded fixture was played at the opponent's home. */
  oppHome: boolean;
  /** Final scoreline as a string, e.g. '3-0'. */
  result: string;
  /** Win/draw/loss outcome for this team. */
  wdl: 'W' | 'D' | 'L';
}

export interface TeamMatrixSide {
  /** 38 historical fixtures, indexed 0 = most recent. */
  fixtures: TeamMatrixFixture[];
  /** Stats grouped by category. Order in the map is render order. */
  stats: Record<string, Record<string, TeamMatrixStat>>;
}

export interface XGData {
  /** xG value, decimal — typical range 0.5–3.5. */
  xg: number;
  /** xGoT (expected goals on target) value, decimal — typical range 0.3–2.5. */
  xgot: number;
}

export interface FixtureMatrix {
  home: TeamMatrixSide;
  away: TeamMatrixSide;
}

export interface FixtureXG {
  home: XGData;
  away: XGData;
}

/** The fixture-detail screen's full record. Composes FixtureListItem and adds
 *  Overview-tab fields plus the Team-stats matrix + xG context. Player-matrix
 *  and threshold slots are reserved for Phase 4C and are NOT declared here. */
export interface FixtureDetail extends FixtureListItem {
  /** League position + points, e.g. '2ND · 74 PTS'. */
  homeRank: string;
  awayRank: string;
  /** Form sequences. Overview overrides Team.form so the listing card and
   *  detail screen can show different windows per source intent. */
  homeForm: FormResult[];
  awayForm: FormResult[];
  winProb: FixtureWinProb;
  refereeDetail: FixtureRefereeDetail;
  h2h: FixtureH2H;
  strongestAngles: StrongestAngle[];
  /** 4B — comparative team-matrix data over the last 38 fixtures, per side. */
  matrix: FixtureMatrix;
  /** 4B — read-only xG / xGoT context, per side. */
  xg: FixtureXG;
}
