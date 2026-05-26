// Data layer — teams, kits, fixtures, stats
// Exposes window.DATA when loaded

const TEAMS = {
  // Premier League
  MCI: { code: 'MCI', name: 'Man City', form: ['W','W','D','W','W'], kit: { pattern: 'solid', primary: '#6CABDD', secondary: '#1C2C5B', tertiary: '#FFFFFF' } },
  CRY: { code: 'CRY', name: 'Crystal Palace', form: ['W','D','L','L','L'], kit: { pattern: 'vertical_halves', primary: '#C8102E', secondary: '#1B458F', tertiary: '#FFFFFF' } },
  LIV: { code: 'LIV', name: 'Liverpool', form: ['W','W','W','D','W'], kit: { pattern: 'solid', primary: '#C8102E', secondary: '#00B2A9', tertiary: '#FFFFFF' } },
  ARS: { code: 'ARS', name: 'Arsenal', form: ['W','D','W','W','L'], kit: { pattern: 'horizontal_band', primary: '#C8102E', secondary: '#FFFFFF', tertiary: '#063672' } },
  NEW: { code: 'NEW', name: 'Newcastle', form: ['L','W','W','D','W'], kit: { pattern: 'vertical_stripes', primary: '#000000', secondary: '#FFFFFF', tertiary: '#41B6E6' } },
  BRI: { code: 'BRI', name: 'Brighton', form: ['D','L','W','W','D'], kit: { pattern: 'vertical_stripes', primary: '#0057B7', secondary: '#FFFFFF', tertiary: '#0057B7' } },
  BRE: { code: 'BRE', name: 'Brentford', form: ['L','W','D','L','W'], kit: { pattern: 'vertical_stripes', primary: '#C8102E', secondary: '#FFFFFF', tertiary: '#000000' } },
  EVE: { code: 'EVE', name: 'Everton', form: ['D','L','D','W','L'], kit: { pattern: 'solid', primary: '#003399', secondary: '#FFFFFF', tertiary: '#FFCC00' } },
  SOU: { code: 'SOU', name: 'Southampton', form: ['L','L','W','L','L'], kit: { pattern: 'vertical_stripes', primary: '#D71920', secondary: '#FFFFFF', tertiary: '#000000' } },
  BUR: { code: 'BUR', name: 'Burnley', form: ['W','L','D','L','L'], kit: { pattern: 'solid', primary: '#6C1D45', secondary: '#99D6EA', tertiary: '#FFFFFF' } },
  WOL: { code: 'WOL', name: 'Wolves', form: ['L','D','W','L','D'], kit: { pattern: 'solid', primary: '#FDB913', secondary: '#231F20', tertiary: '#FFFFFF' } },
  BOU: { code: 'BOU', name: 'Bournemouth', form: ['W','W','D','L','W'], kit: { pattern: 'vertical_stripes', primary: '#DA291C', secondary: '#000000', tertiary: '#FFFFFF' } },
  NFO: { code: 'NFO', name: 'Forest', form: ['L','W','L','L','D'], kit: { pattern: 'solid', primary: '#DD0000', secondary: '#FFFFFF', tertiary: '#000000' } },
  TOT: { code: 'TOT', name: 'Tottenham', form: ['W','L','W','D','L'], kit: { pattern: 'solid', primary: '#FFFFFF', secondary: '#132257', tertiary: '#132257' } },
  CHE: { code: 'CHE', name: 'Chelsea', form: ['D','W','W','L','W'], kit: { pattern: 'solid', primary: '#034694', secondary: '#FFFFFF', tertiary: '#DBA111' } },
  MUN: { code: 'MUN', name: 'Man United', form: ['L','W','D','W','L'], kit: { pattern: 'solid', primary: '#DA291C', secondary: '#000000', tertiary: '#FBE122' } },
  AVL: { code: 'AVL', name: 'Aston Villa', form: ['W','D','W','L','D'], kit: { pattern: 'solid', primary: '#670E36', secondary: '#95BFE5', tertiary: '#FFFFFF' } },
  FUL: { code: 'FUL', name: 'Fulham', form: ['L','W','L','D','W'], kit: { pattern: 'solid', primary: '#FFFFFF', secondary: '#000000', tertiary: '#CC0000' } },

  // La Liga
  VIL: { code: 'VIL', name: 'Villarreal', form: ['W','W','D','W','L'], kit: { pattern: 'solid', primary: '#FFE667', secondary: '#005CB9', tertiary: '#FFFFFF' } },
  BET: { code: 'BET', name: 'Real Betis', form: ['D','W','W','L','D'], kit: { pattern: 'vertical_stripes', primary: '#0A8F47', secondary: '#FFFFFF', tertiary: '#0A8F47' } },
  RMA: { code: 'RMA', name: 'Real Madrid', form: ['W','W','W','D','W'], kit: { pattern: 'solid', primary: '#FFFFFF', secondary: '#FEBE10', tertiary: '#00529F' } },
  BAR: { code: 'BAR', name: 'Barcelona', form: ['W','D','W','W','L'], kit: { pattern: 'vertical_halves', primary: '#A50044', secondary: '#004D98', tertiary: '#FFFFFF' } },
  ATM: { code: 'ATM', name: 'Atlético', form: ['W','L','D','W','W'], kit: { pattern: 'vertical_stripes', primary: '#CB3524', secondary: '#FFFFFF', tertiary: '#272E61' } },
  SEV: { code: 'SEV', name: 'Sevilla', form: ['L','D','W','L','D'], kit: { pattern: 'solid', primary: '#FFFFFF', secondary: '#D40026', tertiary: '#FFFFFF' } },
  GIR: { code: 'GIR', name: 'Girona', form: ['D','W','L','W','D'], kit: { pattern: 'vertical_stripes', primary: '#CD2129', secondary: '#FFFFFF', tertiary: '#CD2129' } },
  VAL: { code: 'VAL', name: 'Valencia', form: ['L','L','D','W','W'], kit: { pattern: 'solid', primary: '#FFFFFF', secondary: '#EE3524', tertiary: '#000000' } },

  // Serie A
  ATA: { code: 'ATA', name: 'Atalanta', form: ['W','L','W','D','W'], kit: { pattern: 'vertical_stripes', primary: '#171796', secondary: '#000000', tertiary: '#FFFFFF' } },
  ROM: { code: 'ROM', name: 'Roma', form: ['D','W','L','W','D'], kit: { pattern: 'solid', primary: '#8C0F22', secondary: '#F0BC42', tertiary: '#FFFFFF' } },
  INT: { code: 'INT', name: 'Inter', form: ['W','W','D','W','L'], kit: { pattern: 'vertical_stripes', primary: '#010E80', secondary: '#000000', tertiary: '#FFFFFF' } },
  MIL: { code: 'MIL', name: 'Milan', form: ['L','D','W','W','D'], kit: { pattern: 'vertical_stripes', primary: '#FB090B', secondary: '#000000', tertiary: '#FFFFFF' } },
  JUV: { code: 'JUV', name: 'Juventus', form: ['D','W','L','W','W'], kit: { pattern: 'vertical_stripes', primary: '#FFFFFF', secondary: '#000000', tertiary: '#000000' } },
  NAP: { code: 'NAP', name: 'Napoli', form: ['W','D','W','D','L'], kit: { pattern: 'solid', primary: '#12A0D7', secondary: '#FFFFFF', tertiary: '#003366' } },
  LAZ: { code: 'LAZ', name: 'Lazio', form: ['L','W','D','L','W'], kit: { pattern: 'solid', primary: '#A8C8E4', secondary: '#FFFFFF', tertiary: '#0F1C2D' } },
  FIO: { code: 'FIO', name: 'Fiorentina', form: ['D','D','W','L','D'], kit: { pattern: 'solid', primary: '#572E91', secondary: '#FFFFFF', tertiary: '#572E91' } },

  // Bundesliga
  BAY: { code: 'BAY', name: 'Bayern', form: ['W','W','W','D','W'], kit: { pattern: 'solid', primary: '#DC052D', secondary: '#FFFFFF', tertiary: '#0066B2' } },
  DOR: { code: 'DOR', name: 'Dortmund', form: ['W','L','D','W','D'], kit: { pattern: 'solid', primary: '#FDE100', secondary: '#000000', tertiary: '#FFFFFF' } },
  LEV: { code: 'LEV', name: 'Leverkusen', form: ['W','D','W','W','L'], kit: { pattern: 'horizontal_band', primary: '#E32221', secondary: '#000000', tertiary: '#FFFFFF' } },
  STU: { code: 'STU', name: 'Stuttgart', form: ['L','W','D','W','W'], kit: { pattern: 'solid', primary: '#FFFFFF', secondary: '#E32219', tertiary: '#E32219' } },
  LEI: { code: 'LEI', name: 'Leipzig', form: ['W','L','W','D','W'], kit: { pattern: 'solid', primary: '#FFFFFF', secondary: '#DD0741', tertiary: '#001F47' } },
  FRA: { code: 'FRA', name: 'Frankfurt', form: ['D','W','L','L','D'], kit: { pattern: 'solid', primary: '#000000', secondary: '#E1000F', tertiary: '#FFFFFF' } },

  // Ligue 1
  PSG: { code: 'PSG', name: 'PSG', form: ['W','W','W','W','D'], kit: { pattern: 'horizontal_band', primary: '#004170', secondary: '#FFFFFF', tertiary: '#DA291C' } },
  MAR: { code: 'MAR', name: 'Marseille', form: ['W','D','W','L','D'], kit: { pattern: 'solid', primary: '#FFFFFF', secondary: '#2FAEE0', tertiary: '#2FAEE0' } },
  MON: { code: 'MON', name: 'Monaco', form: ['D','W','L','W','W'], kit: { pattern: 'vertical_halves', primary: '#E03726', secondary: '#FFFFFF', tertiary: '#E03726' } },
  LYO: { code: 'LYO', name: 'Lyon', form: ['L','W','D','W','L'], kit: { pattern: 'solid', primary: '#FFFFFF', secondary: '#003B7B', tertiary: '#DA291C' } },

  // Eredivisie
  AJX: { code: 'AJX', name: 'Ajax', form: ['W','W','D','W','L'], kit: { pattern: 'horizontal_band', primary: '#FFFFFF', secondary: '#D2122E', tertiary: '#D2122E' } },
  PSV: { code: 'PSV', name: 'PSV', form: ['W','D','W','W','W'], kit: { pattern: 'horizontal_band', primary: '#ED1C24', secondary: '#FFFFFF', tertiary: '#ED1C24' } },
  FEY: { code: 'FEY', name: 'Feyenoord', form: ['L','W','D','W','D'], kit: { pattern: 'vertical_halves', primary: '#CC0000', secondary: '#FFFFFF', tertiary: '#000000' } },
};

// Hero carousel slides (dashboard)
const CAROUSEL = [
  {
    kind: 'pattern-hit',
    label: 'PATTERN HIT',
    sub: 'YESTERDAY',
    title: 'Liverpool treble landed',
    body: 'Over 4 corners · BTTS · Both teams carded — all three legs from yesterday\u2019s Safe builder.',
    cta: 'See the workings',
  },
  {
    kind: 'engine',
    label: 'ENGINE BRIEF',
    sub: 'TODAY · 06:00',
    title: '11 strong angles surfaced',
    body: 'Corners cluster across Premier League · 4 referees flagged cards-heavy · Haaland SOT floor steady.',
    cta: 'Open today\u2019s scan',
  },
  {
    kind: 'depth',
    label: 'DEPTH SCAN',
    sub: 'L20 WINDOW',
    title: 'City corners hold over 20',
    body: '8+ corners in 18 of last 20. Floor stays even when Palace defends deep.',
    cta: 'Open team matrix',
  },
];

// Today's fixtures (Premier League slice)
const TODAY = [
  { id: 'mci-cry', league: 'Premier League', leagueShort: 'PL', kickoff: '17:30', signal: 92, home: 'MCI', away: 'CRY', ref: 'M. Oliver', refCpm: '4.2', venue: 'Etihad', primary: true },
  { id: 'liv-ars', league: 'Premier League', leagueShort: 'PL', kickoff: '20:00', signal: 87, home: 'LIV', away: 'ARS', ref: 'A. Taylor', refCpm: '5.1', venue: 'Anfield' },
  { id: 'new-bri', league: 'Premier League', leagueShort: 'PL', kickoff: '15:00', signal: 68, home: 'NEW', away: 'BRI', ref: 'S. Attwell', refCpm: '3.4', venue: 'St James\u2019 Park' },
  { id: 'che-mun', league: 'Premier League', leagueShort: 'PL', kickoff: '12:30', signal: 71, home: 'CHE', away: 'MUN', ref: 'P. Tierney', refCpm: '3.9', venue: 'Stamford Bridge' },
  { id: 'tot-eve', league: 'Premier League', leagueShort: 'PL', kickoff: '14:00', signal: 64, home: 'TOT', away: 'EVE', ref: 'D. Coote', refCpm: '3.7', venue: 'Tottenham Stadium' },
  { id: 'bre-wol', league: 'Premier League', leagueShort: 'PL', kickoff: '15:00', signal: 58, home: 'BRE', away: 'WOL', ref: 'C. Pawson', refCpm: '4.0', venue: 'Gtech' },
];

// Top research today (ranks 2-4 since featured is rank 1)
const TOP_RESEARCH = [
  {
    id: 'liv-ars',
    league: 'Premier League', kickoff: '20:00', venue: 'Anfield',
    signal: 87, home: 'LIV', away: 'ARS',
    angle: { threshold: '10+', hits: '5/5', title: 'Combined corners 10 or more', body: 'Both teams average 6+ corners · plus 2 more strong angles' }
  },
  {
    id: 'vil-bet',
    league: 'La Liga', kickoff: '21:00', venue: 'La Cerámica',
    signal: 74, home: 'VIL', away: 'BET',
    angle: { threshold: 'BTTS', hits: '4/5', title: 'Both teams to score', body: 'Both sides hit BTTS in 4 of last 5 · referee tendency aligned' }
  },
  {
    id: 'ata-rom',
    league: 'Serie A', kickoff: '19:45', venue: 'Gewiss',
    signal: 71, home: 'ATA', away: 'ROM',
    angle: { threshold: '5+', hits: '4/5', title: 'Cards 5 or more', body: 'Cards-heavy referee · both teams averaging 2+ cards', tier: 'amber' }
  },
];

// MCI vs CRY — full fixture data
const FIXTURE_MCI_CRY = {
  id: 'mci-cry',
  league: 'Premier League',
  kickoff: '17:30',
  date: 'Sat',
  venue: 'Etihad',
  home: 'MCI',
  away: 'CRY',
  signal: 92,
  homeRank: '2ND · 74 PTS',
  awayRank: '15TH · 44 PTS',
  homeForm: ['W','W','D','W','W'],
  awayForm: ['W','D','L','L','L'],
  winProb: { home: 80, draw: 12, away: 8 },
  referee: { name: 'Michael Oliver', cpm: 4.2, homeWinPct: 38, cardsAboveAvg: true },
  h2h: { home: 4, away: 1, last: '5-2 MCI' },
  strongestAngles: [
    { threshold: '2.5+', hits: '5/5', title: 'Match over 2.5 goals', body: 'City scoring 2+ in every fixture · Palace conceding 2+ in 4/5' },
    { threshold: '8+', hits: '5/5', title: 'City corners 8 or more', body: 'Floor of 8 across last 5 · Palace defends deep, expect crosses' },
    { threshold: '1+', hits: '5/5', title: 'Haaland shot on target', body: '1+ SOT in every fixture · 2+ in 3 of last 5' },
    { threshold: '1+', hits: '5/5', title: 'Doku committed foul', body: '1+ foul every fixture · high carrier, attracts contact' },
  ],
  // Consistent thresholds — tug-of-war chart
  // depth_tier: 'L10' (long bar, teal) | 'L5' (mid bar, amber) | 'none' (empty)
  thresholds: {
    home: [
      { stat: 'CORNERS', threshold: '8+', depth: 'L10' },
      { stat: 'CARDS',   threshold: '↓3', depth: 'L10' },
      { stat: 'SHOTS',   threshold: '18+', depth: 'L5' },
      { stat: 'SOT',     threshold: null, depth: 'none' },
      { stat: 'TACKLES', threshold: null, depth: 'none' },
    ],
    away: [
      { stat: 'CORNERS', threshold: '3+', depth: 'L5' },
      { stat: 'CARDS',   threshold: '1+', depth: 'L5' },
      { stat: 'SHOTS',   threshold: null, depth: 'none' },
      { stat: 'SOT',     threshold: '1+', depth: 'L5' },
      { stat: 'TACKLES', threshold: null, depth: 'none' },
    ],
  },
  // Team matrix — 5 last fixtures per team
  matrix: {
    home: {
      fixtures: [
        { date: '09 May', opp: 'BRE', oppHome: true,  result: '3-0', wdl: 'W' },
        { date: '04 May', opp: 'EVE', oppHome: false, result: '3-3', wdl: 'D' },
        { date: '25 Apr', opp: 'SOU', oppHome: true,  result: '2-1', wdl: 'W' },
        { date: '22 Apr', opp: 'BUR', oppHome: false, result: '0-1', wdl: 'L' },
        { date: '19 Apr', opp: 'ARS', oppHome: true,  result: '2-1', wdl: 'W' },
      ],
      stats: {
        ATTACK: {
          GOALS:     { threshold: '1+',  hits: 5, values: [3,3,2,1,2], dir: 'gte' },
          'SHOTS OT':{ threshold: '4+',  hits: 5, values: [10,4,6,9,5], dir: 'gte' },
        },
        'SET PIECES': {
          CORNERS:   { threshold: '8+',  hits: 5, values: [10,9,10,11,8], dir: 'gte' },
        },
        DISCIPLINE: {
          FOULS:     { threshold: '↓12', hits: 4, values: [8,5,9,12,5], dir: 'lte', target: 12 },
        },
      },
    },
    away: {
      fixtures: [
        { date: '10 May', opp: 'EVE', oppHome: false, result: '2-2', wdl: 'D' },
        { date: '07 May', opp: 'WOL', oppHome: true,  result: '2-1', wdl: 'W' },
        { date: '03 May', opp: 'BOU', oppHome: false, result: '3-0', wdl: 'L' },
        { date: '30 Apr', opp: 'NFO', oppHome: false, result: '1-3', wdl: 'L' },
        { date: '25 Apr', opp: 'LIV', oppHome: false, result: '3-1', wdl: 'L' },
      ],
      stats: {
        ATTACK: {
          GOALS:     { threshold: '—',  hits: 4, values: [2,2,0,3,1], dir: 'gte' },
          'SHOTS OT':{ threshold: '1+', hits: 5, values: [8,5,1,7,7], dir: 'gte' },
        },
        'SET PIECES': {
          CORNERS:   { threshold: '1+', hits: 5, values: [5,1,1,1,8], dir: 'gte' },
        },
        DISCIPLINE: {
          FOULS:     { threshold: '↑5+', hits: 5, values: [5,8,11,13,10], dir: 'gte', target: 5 },
        },
      },
    },
  },
  // Player matrix
  players: {
    'Player fouls committed': {
      home: [
        { num: 45, name: 'Khusanov',  threshold: '—',  hits: '2/5', values: [0,3,0,1,0] },
        { num: 42, name: 'Semenyo',   threshold: '—',  hits: '2/5', values: [1,0,0,0,2] },
        { num: 20, name: 'B Silva',   threshold: '—',  hits: '2/5', values: [1,1,0,0,0] },
        { num: 9,  name: 'Haaland',   threshold: '—',  hits: '3/5', values: [1,0,2,1,0] },
        { num: 11, name: 'Doku',      threshold: '1+', hits: '5/5', values: [2,1,2,1,1], pillTier: 'teal' },
        { num: 5,  name: 'Stones',    threshold: '—',  hits: '0/5', values: [0,0,0,0,0] },
      ],
      away: [
        { num: 20, name: 'Wharton',   threshold: '—',  hits: '2/5', values: [0,0,0,1,3] },
        { num: 24, name: 'Sosa',      threshold: '—',  hits: '2/5', values: [2,1,0,0,0] },
        { num: 11, name: 'B Johnson', threshold: '—',  hits: '3/5', values: [0,3,1,1,0] },
        { num: 34, name: 'Riad',      threshold: '1+', hits: '3/5', values: [1,2,1,0,0], pillTier: 'amber' },
        { num: 2,  name: 'Munoz',     threshold: '3+', hits: '2/5', values: [6,3,0,0,0], pillTier: 'teal' },
        { num: 12, name: 'Uche',      threshold: '—',  hits: '2/5', values: [0,0,1,1,0] },
      ],
    },
    'Player shots on target': {
      home: [
        { num: 9,  name: 'Haaland',   threshold: '1+', hits: '5/5', values: [3,2,4,2,3], pillTier: 'teal' },
        { num: 11, name: 'Doku',      threshold: '1+', hits: '4/5', values: [1,2,0,1,1], pillTier: 'amber' },
        { num: 20, name: 'B Silva',   threshold: '—',  hits: '3/5', values: [1,0,1,1,0] },
        { num: 42, name: 'Semenyo',   threshold: '—',  hits: '3/5', values: [2,0,1,1,0] },
        { num: 5,  name: 'Stones',    threshold: '—',  hits: '1/5', values: [0,0,0,1,0] },
      ],
      away: [
        { num: 14, name: 'Mateta',    threshold: '1+', hits: '4/5', values: [2,1,1,0,1], pillTier: 'amber' },
        { num: 7,  name: 'Eze',       threshold: '—',  hits: '3/5', values: [1,2,0,1,0] },
        { num: 10, name: 'Olise',     threshold: '—',  hits: '3/5', values: [1,0,1,1,0] },
        { num: 11, name: 'B Johnson', threshold: '—',  hits: '2/5', values: [1,1,0,0,0] },
        { num: 2,  name: 'Munoz',     threshold: '—',  hits: '1/5', values: [0,1,0,0,0] },
      ],
    },
    'Player shots': {
      home: [
        { num: 9,  name: 'Haaland',   threshold: '3+', hits: '5/5', values: [5,4,6,3,5], pillTier: 'teal' },
        { num: 11, name: 'Doku',      threshold: '2+', hits: '4/5', values: [3,2,1,3,2], pillTier: 'amber' },
        { num: 20, name: 'B Silva',   threshold: '1+', hits: '5/5', values: [2,1,2,1,1], pillTier: 'teal' },
      ],
      away: [],
    },
    'Player to be fouled': {
      home: [
        { num: 11, name: 'Doku',      threshold: '2+', hits: '5/5', values: [3,2,4,2,3], pillTier: 'teal' },
      ],
      away: [],
    },
    'Player tackles': {
      home: [],
      away: [],
    },
    'Player cards': {
      home: [],
      away: [],
    },
  },
};

// Builder result data
const BUILDER_RESULT = {
  fixture: 'Man City vs Crystal Palace',
  type: 'Balanced',
  legs: [
    { title: 'Match over 2.5 goals', threshold: '2.5+', hits: '5/5', tier: 'teal', detail: 'Hit 5 of last 5 · 92% confidence floor' },
    { title: 'City corners 8 or more', threshold: '8+', hits: '5/5', tier: 'teal', detail: '10 avg over window · Palace concedes 6.4' },
    { title: 'Haaland shot on target', threshold: '1+', hits: '5/5', tier: 'teal', detail: '2.8 SOT avg · clear penalty threat' },
    { title: 'Cards over 4.5', threshold: '↑4.5', hits: '4/5', tier: 'amber', detail: 'Oliver above avg · 4.2 cards/match' },
  ],
  combined: { odds: '+420', impliedProb: 19.2, modelProb: 31.4, edge: '+12.2pp' },
};

// Full Fixtures list data — grouped by league
// Each fixture: { id, league, kickoff, venue, home, away, signal, topAngle }
const FIXTURES_ALL = {
  'Premier League': [
    { id: 'mci-cry', kickoff: '17:30', venue: 'Etihad',          home: 'MCI', away: 'CRY', signal: 92, topAngle: { threshold: '8+',  hits: '5/5', title: 'City corners 8+',         tier: 'teal' } },
    { id: 'liv-ars', kickoff: '20:00', venue: 'Anfield',         home: 'LIV', away: 'ARS', signal: 87, topAngle: { threshold: '10+', hits: '5/5', title: 'Combined corners 10+',     tier: 'teal' } },
    { id: 'che-mun', kickoff: '12:30', venue: 'Stamford Bridge', home: 'CHE', away: 'MUN', signal: 71, topAngle: { threshold: '4.5+', hits: '4/5', title: 'Cards over 4.5',          tier: 'amber' } },
    { id: 'new-bri', kickoff: '15:00', venue: 'St James\u2019 Park', home: 'NEW', away: 'BRI', signal: 68, topAngle: { threshold: '2.5+', hits: '4/5', title: 'Goals over 2.5',          tier: 'amber' } },
    { id: 'tot-eve', kickoff: '15:00', venue: 'Tottenham Stadium', home: 'TOT', away: 'EVE', signal: 64, topAngle: { threshold: '1+', hits: '4/5', title: 'Tottenham SOT 4+',         tier: 'amber' } },
    { id: 'avl-ful', kickoff: '17:30', venue: 'Villa Park',      home: 'AVL', away: 'FUL', signal: 58, topAngle: { threshold: '1+',  hits: '3/5', title: 'BTTS leaning',             tier: 'muted' } },
    { id: 'bre-wol', kickoff: '15:00', venue: 'Gtech',           home: 'BRE', away: 'WOL', signal: 52, topAngle: { threshold: '—',   hits: '2/5', title: 'No 5/5 angles surfaced',   tier: 'muted' } },
    { id: 'sou-bou', kickoff: '15:00', venue: 'St Mary\u2019s',  home: 'SOU', away: 'BOU', signal: 47, topAngle: { threshold: '—',   hits: '2/5', title: 'Low-signal fixture',       tier: 'muted' } },
    { id: 'bur-nfo', kickoff: '15:00', venue: 'Turf Moor',       home: 'BUR', away: 'NFO', signal: 44, topAngle: { threshold: '—',   hits: '2/5', title: 'Pattern engine quiet',     tier: 'muted' } },
    { id: 'eve-mci', kickoff: '20:00', venue: 'Goodison',        home: 'EVE', away: 'MCI', signal: 78, topAngle: { threshold: '8+',  hits: '4/5', title: 'City corners floor',       tier: 'amber' } },
  ],
  'La Liga': [
    { id: 'rma-bar', kickoff: '21:00', venue: 'Bernabéu',         home: 'RMA', away: 'BAR', signal: 89, topAngle: { threshold: '3.5+', hits: '5/5', title: 'Match over 3.5 goals',    tier: 'teal' } },
    { id: 'vil-bet', kickoff: '21:00', venue: 'La Cerámica',      home: 'VIL', away: 'BET', signal: 74, topAngle: { threshold: 'BTTS', hits: '4/5', title: 'Both teams to score',     tier: 'amber' } },
    { id: 'atm-sev', kickoff: '18:30', venue: 'Metropolitano',    home: 'ATM', away: 'SEV', signal: 66, topAngle: { threshold: '4+',  hits: '4/5', title: 'Atléti corners 4+',       tier: 'amber' } },
    { id: 'gir-val', kickoff: '16:15', venue: 'Montilivi',        home: 'GIR', away: 'VAL', signal: 54, topAngle: { threshold: '—',   hits: '3/5', title: 'Mid-table watch',         tier: 'muted' } },
    { id: 'bar-atm', kickoff: '20:00', venue: 'Camp Nou',         home: 'BAR', away: 'ATM', signal: 81, topAngle: { threshold: '2.5+', hits: '5/5', title: 'Goals over 2.5',         tier: 'teal' } },
    { id: 'sev-rma', kickoff: '21:00', venue: 'Sánchez Pizjuán',  home: 'SEV', away: 'RMA', signal: 72, topAngle: { threshold: '2+',  hits: '4/5', title: 'Madrid SOT floor',        tier: 'amber' } },
    { id: 'val-vil', kickoff: '14:00', venue: 'Mestalla',         home: 'VAL', away: 'VIL', signal: 49, topAngle: { threshold: '—',   hits: '2/5', title: 'Pattern engine quiet',    tier: 'muted' } },
  ],
  'Serie A': [
    { id: 'ata-rom', kickoff: '19:45', venue: 'Gewiss',           home: 'ATA', away: 'ROM', signal: 71, topAngle: { threshold: '5+',  hits: '4/5', title: 'Cards 5 or more',         tier: 'amber' } },
    { id: 'int-mil', kickoff: '20:45', venue: 'San Siro',         home: 'INT', away: 'MIL', signal: 88, topAngle: { threshold: '5+',  hits: '5/5', title: 'Combined cards 5+',       tier: 'teal' } },
    { id: 'juv-nap', kickoff: '17:00', venue: 'Allianz Stadium',  home: 'JUV', away: 'NAP', signal: 76, topAngle: { threshold: '2+',  hits: '4/5', title: 'Napoli SOT 2+',           tier: 'amber' } },
    { id: 'laz-fio', kickoff: '17:00', venue: 'Olimpico',         home: 'LAZ', away: 'FIO', signal: 61, topAngle: { threshold: '4+',  hits: '4/5', title: 'Lazio corners 4+',        tier: 'amber' } },
    { id: 'mil-juv', kickoff: '20:45', venue: 'San Siro',         home: 'MIL', away: 'JUV', signal: 83, topAngle: { threshold: '2.5+', hits: '5/5', title: 'Match over 2.5 goals',   tier: 'teal' } },
    { id: 'nap-ata', kickoff: '19:45', venue: 'Diego Maradona',   home: 'NAP', away: 'ATA', signal: 67, topAngle: { threshold: '8+',  hits: '4/5', title: 'Combined corners 8+',     tier: 'amber' } },
    { id: 'fio-laz', kickoff: '12:30', venue: 'Artemio Franchi',  home: 'FIO', away: 'LAZ', signal: 55, topAngle: { threshold: '—',   hits: '3/5', title: 'Cards above avg',         tier: 'muted' } },
  ],
  'Bundesliga': [
    { id: 'bay-dor', kickoff: '18:30', venue: 'Allianz Arena',    home: 'BAY', away: 'DOR', signal: 91, topAngle: { threshold: '3.5+', hits: '5/5', title: 'Klassiker goal-fest',    tier: 'teal' } },
    { id: 'lev-stu', kickoff: '15:30', venue: 'BayArena',         home: 'LEV', away: 'STU', signal: 79, topAngle: { threshold: '2+',  hits: '5/5', title: 'Leverkusen SOT 2+',       tier: 'teal' } },
    { id: 'lei-fra', kickoff: '15:30', venue: 'Red Bull Arena',   home: 'LEI', away: 'FRA', signal: 63, topAngle: { threshold: '5+',  hits: '4/5', title: 'Combined corners 5+',     tier: 'amber' } },
    { id: 'dor-lev', kickoff: '15:30', venue: 'Signal Iduna',     home: 'DOR', away: 'LEV', signal: 73, topAngle: { threshold: '3+',  hits: '4/5', title: 'Goal threat both sides',  tier: 'amber' } },
    { id: 'stu-bay', kickoff: '18:30', venue: 'MHPArena',         home: 'STU', away: 'BAY', signal: 69, topAngle: { threshold: '2+',  hits: '4/5', title: 'Bayern SOT floor',        tier: 'amber' } },
    { id: 'fra-lei', kickoff: '15:30', venue: 'Deutsche Bank Park', home: 'FRA', away: 'LEI', signal: 56, topAngle: { threshold: '—',   hits: '3/5', title: 'Yellow card watch',     tier: 'muted' } },
  ],
  'Ligue 1': [
    { id: 'psg-mar', kickoff: '20:45', venue: 'Parc des Princes', home: 'PSG', away: 'MAR', signal: 86, topAngle: { threshold: '2+',  hits: '5/5', title: 'PSG SOT floor',           tier: 'teal' } },
    { id: 'mon-lyo', kickoff: '17:00', venue: 'Louis II',         home: 'MON', away: 'LYO', signal: 70, topAngle: { threshold: '2.5+', hits: '4/5', title: 'Goals over 2.5',         tier: 'amber' } },
    { id: 'mar-psg', kickoff: '21:00', venue: 'Vélodrome',        home: 'MAR', away: 'PSG', signal: 65, topAngle: { threshold: '5+',  hits: '4/5', title: 'Cards 5 or more',         tier: 'amber' } },
    { id: 'lyo-mon', kickoff: '17:00', venue: 'Groupama',         home: 'LYO', away: 'MON', signal: 53, topAngle: { threshold: '—',   hits: '3/5', title: 'Pattern engine quiet',    tier: 'muted' } },
    { id: 'psg-lyo', kickoff: '20:45', venue: 'Parc des Princes', home: 'PSG', away: 'LYO', signal: 77, topAngle: { threshold: '3+',  hits: '4/5', title: 'PSG corners 3+',          tier: 'amber' } },
  ],
  'Eredivisie': [
    { id: 'ajx-psv', kickoff: '20:00', venue: 'Johan Cruijff Arena', home: 'AJX', away: 'PSV', signal: 84, topAngle: { threshold: '2.5+', hits: '5/5', title: 'Goals over 2.5',         tier: 'teal' } },
    { id: 'fey-ajx', kickoff: '14:30', venue: 'De Kuip',          home: 'FEY', away: 'AJX', signal: 75, topAngle: { threshold: '5+',  hits: '4/5', title: 'Cards in De Klassieker',  tier: 'amber' } },
    { id: 'psv-fey', kickoff: '16:45', venue: 'Philips Stadion',  home: 'PSV', away: 'FEY', signal: 62, topAngle: { threshold: '2+',  hits: '4/5', title: 'PSV SOT 2+',              tier: 'amber' } },
  ],
};

window.DATA = {
  TEAMS,
  CAROUSEL,
  TODAY,
  TOP_RESEARCH,
  FIXTURE_MCI_CRY,
  BUILDER_RESULT,
  FIXTURES_ALL,
};
