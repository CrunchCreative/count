// FIXTURE_DETAILS_BY_ID — the deeper per-fixture record consumed by the
// fixture-detail screen. The MCI/CRY reference is a verbatim port of
// docs/design-source/the-count-v2/project/data.js lines 126–147; every other
// fixture id runs through a deterministic synthesiser so all ~40 fixtures in
// FIXTURES_ALL resolve to a renderable Overview.
//
// Determinism matters — the same id must produce the same values on every
// render. All randomness comes from cheap hashes of stable fields
// (team codes, signal, referee name). No Math.random.

import type {
  FixtureDetail,
  FixtureListItem,
  FixtureMatrix,
  FixtureXG,
  StrongestAngle,
  TeamMatrixFixture,
  TeamMatrixSide,
  TeamMatrixStat,
} from '@count/types';
import { FIXTURES_BY_ID } from './fixtures-all';
import { TEAMS } from './teams';

// ─── MCI/CRY verbatim override ──────────────────────────────────────────────
// Source: design-source/the-count-v2/project/data.js, lines 126–147.

type MciCryShape = Pick<
  FixtureDetail,
  | 'homeRank'
  | 'awayRank'
  | 'homeForm'
  | 'awayForm'
  | 'winProb'
  | 'refereeDetail'
  | 'h2h'
  | 'strongestAngles'
  | 'xg'
>;

const MCI_CRY_OVERRIDE: MciCryShape = {
  homeRank: '2ND · 74 PTS',
  awayRank: '15TH · 44 PTS',
  homeForm: ['W', 'W', 'D', 'W', 'W'],
  awayForm: ['W', 'D', 'L', 'L', 'L'],
  winProb: { home: 80, draw: 12, away: 8 },
  refereeDetail: {
    name: 'Michael Oliver',
    cpm: 4.2,
    homeWinPct: 38,
    cardsAboveAvg: true,
  },
  h2h: { home: 4, away: 1, last: '5-2 MCI' },
  strongestAngles: [
    {
      threshold: '2.5+',
      hits: '5/5',
      title: 'Match over 2.5 goals',
      body: 'City scoring 2+ in every fixture · Palace conceding 2+ in 4/5',
    },
    {
      threshold: '8+',
      hits: '5/5',
      title: 'City corners 8 or more',
      body: 'Floor of 8 across last 5 · Palace defends deep, expect crosses',
    },
    {
      threshold: '1+',
      hits: '5/5',
      title: 'Haaland shot on target',
      body: '1+ SOT in every fixture · 2+ in 3 of last 5',
    },
    {
      threshold: '1+',
      hits: '5/5',
      title: 'Doku committed foul',
      body: '1+ foul every fixture · high carrier, attracts contact',
    },
  ],
  xg: {
    home: { xg: 2.4, xgot: 1.6 },
    away: { xg: 0.9, xgot: 0.5 },
  },
};

// 4B: MCI/CRY verbatim first-five overlay applied on top of the synthesised
// 38-fixture matrix. Source: docs/design-source/the-count-v2/project/data.js
// lines 168–209. Only the first 5 entries of each side's fixtures + each
// named stat get overwritten — everything past index 4 stays synthesised.

const MCI_HOME_5: TeamMatrixFixture[] = [
  { date: '09 May', opp: 'BRE', oppHome: true,  result: '3-0', wdl: 'W' },
  { date: '04 May', opp: 'EVE', oppHome: false, result: '3-3', wdl: 'D' },
  { date: '25 Apr', opp: 'SOU', oppHome: true,  result: '2-1', wdl: 'W' },
  { date: '22 Apr', opp: 'BUR', oppHome: false, result: '0-1', wdl: 'L' },
  { date: '19 Apr', opp: 'ARS', oppHome: true,  result: '2-1', wdl: 'W' },
];

const MCI_HOME_5_VALUES: Record<string, Record<string, number[]>> = {
  ATTACK:        { GOALS: [3, 3, 2, 1, 2], 'SHOTS OT': [10, 4, 6, 9, 5] },
  'SET PIECES':  { CORNERS: [10, 9, 10, 11, 8] },
  DISCIPLINE:    { FOULS: [8, 5, 9, 12, 5] },
};

const CRY_AWAY_5: TeamMatrixFixture[] = [
  { date: '09 May', opp: 'EVE', oppHome: false, result: '0-0', wdl: 'D' },
  { date: '04 May', opp: 'WOL', oppHome: true,  result: '2-2', wdl: 'D' },
  { date: '25 Apr', opp: 'BOU', oppHome: false, result: '0-1', wdl: 'L' },
  { date: '22 Apr', opp: 'NFO', oppHome: true,  result: '3-1', wdl: 'W' },
  { date: '19 Apr', opp: 'LIV', oppHome: false, result: '1-3', wdl: 'L' },
];

const CRY_AWAY_5_VALUES: Record<string, Record<string, number[]>> = {
  ATTACK:        { GOALS: [2, 2, 0, 3, 1], 'SHOTS OT': [8, 5, 1, 7, 7] },
  'SET PIECES':  { CORNERS: [5, 1, 1, 1, 8] },
  DISCIPLINE:    { FOULS: [5, 8, 11, 13, 10] },
};

// ─── Hash + helpers ─────────────────────────────────────────────────────────

/** Sum of char codes — cheap deterministic hash for strings. */
function charSum(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) n += s.charCodeAt(i);
  return n;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function ordinalSuffix(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'TH';
  switch (n % 10) {
    case 1: return 'ST';
    case 2: return 'ND';
    case 3: return 'RD';
    default: return 'TH';
  }
}

/** Deterministic 1–20 position from a team code. */
function teamPosition(code: string): number {
  return (charSum(code) % 20) + 1;
}

/** Plausible league points for a given position + signal. */
function teamPoints(position: number, signal: number): number {
  return (20 - position) * 4 + (signal % 6);
}

function rankString(code: string, signal: number): string {
  const pos = teamPosition(code);
  const pts = teamPoints(pos, signal);
  return `${pos}${ordinalSuffix(pos)} · ${pts} PTS`;
}

function winProbFor(fx: FixtureListItem): FixtureDetail['winProb'] {
  const homePos = teamPosition(fx.home);
  const awayPos = teamPosition(fx.away);
  const homeAdvantage = 8;
  const rankDelta = clamp(awayPos - homePos, -15, 15);
  let rawHome = 38 + rankDelta * 1.6 + homeAdvantage + (fx.signal - 60) * 0.2;
  rawHome = clamp(rawHome, 10, 80);
  let rawAway = clamp(100 - rawHome - 18, 8, 50);
  let draw = 100 - rawHome - rawAway;
  let home = Math.round(rawHome);
  let away = Math.round(rawAway);
  draw = 100 - home - away;
  // Rounding can leave draw at <0 or >100; absorb into draw, then clamp.
  if (draw < 4) {
    const deficit = 4 - draw;
    away = Math.max(4, away - deficit);
    draw = 100 - home - away;
  }
  return { home, draw, away };
}

function refereeFor(fx: FixtureListItem): FixtureDetail['refereeDetail'] {
  const name = fx.referee.name.replace(/^([A-Z])\.\s+/, (_, initial: string) => `${initial}. `);
  const homeWinPct = (charSum(name) % 30) + 30;
  return {
    name,
    cpm: fx.referee.cardsPerMatch,
    homeWinPct,
    cardsAboveAvg: fx.referee.cardsPerMatch > 4.3,
  };
}

function h2hFor(fx: FixtureListItem, winProb: FixtureDetail['winProb']): FixtureDetail['h2h'] {
  const home = clamp(Math.round((winProb.home / 100) * 5), 0, 5);
  const away = 5 - home;
  const homeScore = home > away ? 2 : home === away ? 1 : 0;
  const awayScore = away > home ? 2 : away === home ? 1 : 0;
  const winnerCode = home > away ? fx.home : away > home ? fx.away : fx.home;
  const last = `${homeScore}-${awayScore} ${winnerCode}`;
  return { home, away, last };
}

// ─── Strongest angles pool ──────────────────────────────────────────────────
// Generic library-quality angles — bodies use the allowed vocabulary
// (trend / consistency / floor / threshold) per decision 7. No "lock",
// "guaranteed", or odds talk.

interface AngleTemplate {
  threshold: string;
  hits: string;
  title: string;
  body: (homeName: string) => string;
}

const ANGLE_POOL: AngleTemplate[] = [
  {
    threshold: '2.5+',
    hits: '5/5',
    title: 'Match over 2.5 goals',
    body: (h) => `${h} scoring 2+ in every fixture · trend across last 5`,
  },
  {
    threshold: '4.5+',
    hits: '4/5',
    title: 'Cards over 4.5',
    body: () => 'Cards-heavy referee · both teams averaging above the threshold',
  },
  {
    threshold: 'BTTS',
    hits: '4/5',
    title: 'Both teams to score',
    body: (h) => `${h} attack consistent · away side scoring in 4 of last 5`,
  },
  {
    threshold: '10+',
    hits: '4/5',
    title: 'Combined corners 10+',
    body: () => 'Floor of 10 across recent meetings · both sides press wide',
  },
  {
    threshold: '8+',
    hits: '5/5',
    title: 'Home corners 8 or more',
    body: (h) => `${h} corners trending above floor in every fixture`,
  },
  {
    threshold: '1+',
    hits: '4/5',
    title: 'Lead striker shot on target',
    body: () => 'Recent consistency on the SOT threshold · 1+ in 4 of 5',
  },
];

function pickAngles(fx: FixtureListItem, homeName: string): StrongestAngle[] {
  // Lead angle is the fixture's listing-card topAngle.
  const lead: StrongestAngle = {
    threshold: fx.topAngle.threshold,
    hits: fx.topAngle.hits,
    title: fx.topAngle.title,
    body: `Trend across last 5 · primary signal for this fixture`,
  };
  // Deterministic selection: rotate the pool by signal parity + first-letter hash.
  const rot = (fx.signal + charSum(fx.home)) % ANGLE_POOL.length;
  const ordered = [...ANGLE_POOL.slice(rot), ...ANGLE_POOL.slice(0, rot)];
  // Pick 3 that don't duplicate the lead title.
  const supporting: StrongestAngle[] = [];
  for (const tpl of ordered) {
    if (supporting.length === 3) break;
    if (tpl.title.toLowerCase() === lead.title.toLowerCase()) continue;
    supporting.push({
      threshold: tpl.threshold,
      hits: tpl.hits,
      title: tpl.title,
      body: tpl.body(homeName),
    });
  }
  return [lead, ...supporting];
}

// ─── 4B: Matrix + xG synthesiser ────────────────────────────────────────────
//
// All randomness routes through mulberry32 seeded by a deterministic
// stringHash of (fixtureId, teamCode, side, statName, ...). No Math.random
// anywhere. Same id → same values on every render.

/** Deterministic 32-bit hash. Char-code sum × 31 modulo 2³¹, per phase brief. */
function stringHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 38 integers in [min, max], slightly centre-biased via two-draw average. */
function synthesiseStatValues(seed: number, range: readonly [number, number]): number[] {
  const rng = mulberry32(seed);
  const [min, max] = range;
  const out: number[] = [];
  for (let i = 0; i < 38; i++) {
    const v = (rng() + rng()) / 2;
    out.push(Math.round(min + v * (max - min)));
  }
  return out;
}

interface StatDef {
  dir: 'gte' | 'lte';
  defaultVisible: boolean;
  range: readonly [number, number];
}

// Categories + stats are fixed for V1 mock. Order here is render order.
// All stats are 'gte' (over-style) in V1; 'lte' stays a reserved code path
// for follow-up player-stats work.
const TEAM_STAT_DEFINITIONS: Record<string, Record<string, StatDef>> = {
  ATTACK: {
    GOALS:      { dir: 'gte', defaultVisible: true,  range: [0, 5] },
    'SHOTS OT': { dir: 'gte', defaultVisible: true,  range: [0, 12] },
  },
  'SET PIECES': {
    CORNERS:     { dir: 'gte', defaultVisible: true,  range: [0, 14] },
    'THROW INS': { dir: 'gte', defaultVisible: false, range: [10, 30] },
  },
  DISCIPLINE: {
    FOULS:    { dir: 'gte', defaultVisible: true,  range: [4, 18] },
    OFFSIDES: { dir: 'gte', defaultVisible: false, range: [0, 6] },
  },
  DEFENCE: {
    TACKLES: { dir: 'gte', defaultVisible: false, range: [8, 24] },
  },
  GOALKEEPING: {
    SAVES: { dir: 'gte', defaultVisible: false, range: [0, 10] },
  },
};

/** Pool of EPL codes the synthesiser rotates opponents through. The team's own
 *  code is filtered out per side. Real-data ingestion (Phase 8) replaces this. */
const OPPONENT_POOL = [
  'MCI', 'LIV', 'ARS', 'CHE', 'MUN', 'TOT', 'NEW', 'BRI', 'AVL', 'BRE',
  'WOL', 'EVE', 'SOU', 'BUR', 'NFO', 'BOU', 'FUL', 'CRY',
];

/** Plausible scoreline pool (team-perspective: [us, them]). Bias is built in
 *  by repetition — low scores show up more often than 4-1s. */
const PLAUSIBLE_SCORES: ReadonlyArray<readonly [number, number]> = [
  [1, 1], [2, 1], [1, 2], [2, 0], [0, 2], [1, 0], [0, 1],
  [1, 1], [2, 1], [1, 2], [2, 0], [0, 2], [1, 0], [0, 1],
  [2, 2], [3, 1], [1, 3], [3, 0], [0, 3], [3, 2], [2, 3],
  [0, 0], [3, 3], [4, 1], [1, 4],
];

/** Today's date as the anchor for the most-recent (index 0) fixture. Counting
 *  back ~6 days per index gives ~225 days for the full 38, roughly one
 *  season's spread. Phase 8 (real data) supplies actual fixture dates. */
const TODAY_BASELINE = new Date('2026-05-27');
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatShortDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  return `${day} ${MONTH_LABELS[d.getMonth()]}`;
}

function synthesiseFixtures(seed: number, teamCode: string): TeamMatrixFixture[] {
  const rng = mulberry32(seed);
  const opponents = OPPONENT_POOL.filter((c) => c !== teamCode);
  const out: TeamMatrixFixture[] = [];
  for (let i = 0; i < 38; i++) {
    const date = new Date(TODAY_BASELINE);
    date.setDate(date.getDate() - i * 6);
    const opp = opponents[Math.floor(rng() * opponents.length)]!;
    const oppHome = rng() < 0.5;
    const [us, them] = PLAUSIBLE_SCORES[Math.floor(rng() * PLAUSIBLE_SCORES.length)]!;
    const wdl: 'W' | 'D' | 'L' = us > them ? 'W' : us === them ? 'D' : 'L';
    out.push({
      date: formatShortDate(date),
      opp,
      oppHome,
      result: `${us}-${them}`,
      wdl,
    });
  }
  return out;
}

function synthesiseSide(
  fixtureId: string,
  teamCode: string,
  side: 'home' | 'away',
): TeamMatrixSide {
  const sideSeed = stringHash(`${fixtureId}::${teamCode}::${side}`);
  const fixtures = synthesiseFixtures(sideSeed, teamCode);
  const stats: Record<string, Record<string, TeamMatrixStat>> = {};
  for (const [catName, catStats] of Object.entries(TEAM_STAT_DEFINITIONS)) {
    stats[catName] = {};
    for (const [statName, def] of Object.entries(catStats)) {
      const statSeed = sideSeed ^ stringHash(statName);
      stats[catName]![statName] = {
        values: synthesiseStatValues(statSeed, def.range),
        dir: def.dir,
        defaultVisible: def.defaultVisible,
      };
    }
  }
  return { fixtures, stats };
}

function synthesiseMatrixForFixture(
  fixtureId: string,
  homeCode: string,
  awayCode: string,
): FixtureMatrix {
  return {
    home: synthesiseSide(fixtureId, homeCode, 'home'),
    away: synthesiseSide(fixtureId, awayCode, 'away'),
  };
}

function synthesiseXG(fixtureId: string, homeCode: string, awayCode: string): FixtureXG {
  const rng = mulberry32(stringHash(`${fixtureId}::xg::${homeCode}::${awayCode}`));
  const homeXG = 0.5 + rng() * 3.0;
  const homeXGoT = Math.min(homeXG, 0.3 + rng() * 2.2);
  const awayXG = 0.5 + rng() * 2.5;
  const awayXGoT = Math.min(awayXG, 0.3 + rng() * 1.8);
  return {
    home: { xg: Math.round(homeXG * 10) / 10, xgot: Math.round(homeXGoT * 10) / 10 },
    away: { xg: Math.round(awayXG * 10) / 10, xgot: Math.round(awayXGoT * 10) / 10 },
  };
}

/**
 * Apply the MCI/CRY verbatim first-five overlay to a synthesised matrix.
 * Mutates `matrix.home.fixtures[0..4]`, the first five values of the named
 * MCI stats, the equivalent away-side fixtures from CRY's window, and the
 * named CRY stats. Indices 5–37 keep their synthesised values.
 */
function applyMciCryOverlay(matrix: FixtureMatrix): FixtureMatrix {
  // Home (MCI) fixtures + named stat values.
  for (let i = 0; i < 5; i++) {
    matrix.home.fixtures[i] = MCI_HOME_5[i]!;
  }
  for (const [cat, statValues] of Object.entries(MCI_HOME_5_VALUES)) {
    for (const [stat, vals] of Object.entries(statValues)) {
      const target = matrix.home.stats[cat]?.[stat];
      if (target) {
        for (let i = 0; i < 5; i++) target.values[i] = vals[i]!;
      }
    }
  }
  // Away (CRY) fixtures + named stat values.
  for (let i = 0; i < 5; i++) {
    matrix.away.fixtures[i] = CRY_AWAY_5[i]!;
  }
  for (const [cat, statValues] of Object.entries(CRY_AWAY_5_VALUES)) {
    for (const [stat, vals] of Object.entries(statValues)) {
      const target = matrix.away.stats[cat]?.[stat];
      if (target) {
        for (let i = 0; i < 5; i++) target.values[i] = vals[i]!;
      }
    }
  }
  return matrix;
}

/**
 * Given a stat's 38 values, a window size, and a direction, derive the
 * SafePill displayed for that row.
 *
 * For 'gte': returns the floor — the minimum value the team hit across all
 *   N matches in the window. Threshold = "Xth+", hits = total = N, tier teal.
 *   If the floor is 0, threshold = "—", tier muted, leg non-addable.
 *
 * For 'lte': returns the ceiling — the maximum value the team's stat stayed
 *   under across all N matches. Threshold = "↓X", tier amber. Unused in 4B
 *   mock since every team stat is 'gte'; kept for future player-stats parity.
 */
export function deriveThresholdForWindow(
  values: number[],
  window: number,
  dir: 'gte' | 'lte',
): { threshold: string; hits: number; total: number; tier: 'teal' | 'amber' | 'muted' } {
  const slice = values.slice(0, window);
  if (dir === 'gte') {
    const floor = Math.min(...slice);
    if (floor <= 0) {
      return { threshold: '—', hits: 0, total: window, tier: 'muted' };
    }
    return { threshold: `${floor}+`, hits: window, total: window, tier: 'teal' };
  }
  const ceil = Math.max(...slice);
  return { threshold: `↓${ceil}`, hits: window, total: window, tier: 'amber' };
}

// ─── Synthesiser + dictionary ───────────────────────────────────────────────

function synthesiseDetail(fx: FixtureListItem): FixtureDetail {
  const homeTeam = TEAMS[fx.home];
  const awayTeam = TEAMS[fx.away];
  const homeForm = homeTeam?.form ?? (['W', 'D', 'W', 'L', 'W'] as FixtureDetail['homeForm']);
  const awayForm = awayTeam?.form ?? (['L', 'W', 'D', 'L', 'D'] as FixtureDetail['awayForm']);
  const winProb = winProbFor(fx);
  const strongestAngles = pickAngles(fx, homeTeam?.name ?? fx.home);
  const matrix = synthesiseMatrixForFixture(fx.id, fx.home, fx.away);
  const xg = synthesiseXG(fx.id, fx.home, fx.away);
  const detail: FixtureDetail = {
    ...fx,
    homeRank: rankString(fx.home, fx.signal),
    awayRank: rankString(fx.away, fx.signal + 11),
    homeForm,
    awayForm,
    winProb,
    refereeDetail: refereeFor(fx),
    h2h: h2hFor(fx, winProb),
    strongestAngles,
    matrix,
    xg,
  };
  if (fx.id === 'mci-cry') {
    applyMciCryOverlay(detail.matrix);
    return { ...detail, ...MCI_CRY_OVERRIDE };
  }
  return detail;
}

export const FIXTURE_DETAILS_BY_ID: Record<string, FixtureDetail> =
  Object.values(FIXTURES_BY_ID).reduce<Record<string, FixtureDetail>>((acc, fx) => {
    acc[fx.id] = synthesiseDetail(fx);
    return acc;
  }, {});

/** Convenience accessor — returns undefined for unknown ids, matching
 *  FIXTURES_BY_ID's behaviour. */
export function getFixtureDetail(id: string): FixtureDetail | undefined {
  return FIXTURE_DETAILS_BY_ID[id];
}
