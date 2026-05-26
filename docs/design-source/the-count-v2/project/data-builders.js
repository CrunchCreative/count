// Seed builder data — rich set covering pending, won, lost across multiple leagues
// Used by app.jsx and the canvas pages.

window.SEED_BUILDERS = [
  // ─── PENDING (4) — awaiting fixtures
  {
    id: 'b-pending-1',
    name: 'Saturday corners stack',
    savedAt: '2026-05-13T09:30:00.000Z',
    status: 'pending',
    riskTier: 'Safe',
    legs: [
      { id: 'mci-cry::corners-8',  fixtureId: 'mci-cry', threshold: '8+',  hits: 5, total: 5, tier: 'teal',  title: 'City corners 8 or more',  reason: 'Floor of 8 across last 5',     category: 'Corners', legStatus: 'pending' },
      { id: 'liv-ars::corners-10', fixtureId: 'liv-ars', threshold: '10+', hits: 5, total: 5, tier: 'teal',  title: 'Combined corners 10+',     reason: 'Both teams average 6+ corners', category: 'Corners', legStatus: 'pending' },
      { id: 'rma-bar::goals-3-5',  fixtureId: 'rma-bar', threshold: '3.5+', hits: 5, total: 5, tier: 'teal', title: 'Match over 3.5 goals',     reason: 'El Clásico averaging 3.8 goals', category: 'Goals',  legStatus: 'pending' },
    ],
  },
  {
    id: 'b-pending-2',
    name: 'Haaland anchor · weekend',
    savedAt: '2026-05-12T19:15:00.000Z',
    status: 'pending',
    riskTier: 'Safe',
    legs: [
      { id: 'mci-cry::haaland-sot',  fixtureId: 'mci-cry', threshold: '1+', hits: 5, total: 5, tier: 'teal', title: 'Haaland shot on target', reason: '1+ SOT in 5 of 5',         category: 'SOT',   legStatus: 'pending' },
      { id: 'mci-cry::haaland-shots',fixtureId: 'mci-cry', threshold: '3+', hits: 5, total: 5, tier: 'teal', title: 'Haaland 3+ shots',       reason: 'L5 floor of 3 shots',      category: 'Shots', legStatus: 'pending' },
    ],
  },
  {
    id: 'b-pending-3',
    name: 'Klassiker goal-fest',
    savedAt: '2026-05-13T07:45:00.000Z',
    status: 'pending',
    riskTier: 'Balanced',
    legs: [
      { id: 'bay-dor::goals-3-5',  fixtureId: 'bay-dor', threshold: '3.5+', hits: 5, total: 5, tier: 'teal', title: 'Match over 3.5 goals',  reason: 'Klassiker averaging 4 goals', category: 'Goals',   legStatus: 'pending' },
      { id: 'bay-dor::bay-sot-4',  fixtureId: 'bay-dor', threshold: '4+',   hits: 4, total: 5, tier: 'amber',title: 'Bayern SOT 4+',         reason: 'L5 floor of 4 SOT',           category: 'SOT',     legStatus: 'pending' },
      { id: 'bay-dor::cards-4-5',  fixtureId: 'bay-dor', threshold: '4.5+', hits: 4, total: 5, tier: 'amber',title: 'Cards over 4.5',         reason: 'Klassiker tension',           category: 'Cards',   legStatus: 'pending' },
      { id: 'bay-dor::muller-prop',fixtureId: 'bay-dor', threshold: '1+',   hits: 4, total: 5, tier: 'amber',title: 'Müller to be fouled 1+', reason: 'Fouled regularly in derbies',  category: 'Players', legStatus: 'pending' },
    ],
  },
  {
    id: 'b-pending-4',
    name: 'Sunday cards research',
    savedAt: '2026-05-13T08:00:00.000Z',
    status: 'pending',
    riskTier: 'Balanced',
    legs: [
      { id: 'int-mil::cards-5',  fixtureId: 'int-mil', threshold: '5+',  hits: 5, total: 5, tier: 'teal', title: 'Combined cards 5+',     reason: 'Derby tension',         category: 'Cards', legStatus: 'pending' },
      { id: 'che-mun::cards-4-5',fixtureId: 'che-mun', threshold: '4.5+',hits: 4, total: 5, tier: 'amber',title: 'Cards over 4.5',         reason: 'Oliver above avg',      category: 'Cards', legStatus: 'pending' },
    ],
  },

  // ─── WON (9)
  {
    id: 'b-won-1',
    name: 'Haaland anchor · last week',
    savedAt: '2026-05-09T18:30:00.000Z',
    status: 'won',
    riskTier: 'Safe',
    legs: [
      { id: 'b-won-1::1', fixtureId: 'mci-cry', threshold: '1+', hits: 5, total: 5, tier: 'teal', title: 'Haaland shot on target', reason: '1+ SOT every fixture', category: 'SOT',   legStatus: 'won', actualResult: 'Haaland had 3 SOT' },
      { id: 'b-won-1::2', fixtureId: 'mci-cry', threshold: '3+', hits: 5, total: 5, tier: 'teal', title: 'Haaland 3+ shots',       reason: 'L5 floor of 3 shots',  category: 'Shots', legStatus: 'won', actualResult: 'Haaland had 5 shots' },
    ],
  },
  {
    id: 'b-won-2',
    name: 'Corners stack · 3 May',
    savedAt: '2026-05-03T15:00:00.000Z',
    status: 'won',
    riskTier: 'Safe',
    legs: [
      { id: 'b-won-2::1', fixtureId: 'mci-cry', threshold: '8+',  hits: 5, total: 5, tier: 'teal', title: 'City corners 8+',        reason: 'L5 floor of 8',    category: 'Corners', legStatus: 'won', actualResult: 'City had 11 corners' },
      { id: 'b-won-2::2', fixtureId: 'liv-ars', threshold: '10+', hits: 5, total: 5, tier: 'teal', title: 'Combined corners 10+',   reason: '6+ each side',     category: 'Corners', legStatus: 'won', actualResult: 'Combined 12 corners' },
      { id: 'b-won-2::3', fixtureId: 'rma-bar', threshold: '5+',  hits: 4, total: 5, tier: 'amber',title: 'Madrid corners 5+',     reason: 'High volume',      category: 'Corners', legStatus: 'won', actualResult: 'Madrid had 7 corners' },
    ],
  },
  {
    id: 'b-won-3',
    name: 'Goals trifecta',
    savedAt: '2026-04-26T19:45:00.000Z',
    status: 'won',
    riskTier: 'Balanced',
    legs: [
      { id: 'b-won-3::1', fixtureId: 'rma-bar', threshold: '3.5+', hits: 5, total: 5, tier: 'teal', title: 'Goals over 3.5',  reason: 'Both attack-heavy', category: 'Goals',   legStatus: 'won', actualResult: 'Final 4-2' },
      { id: 'b-won-3::2', fixtureId: 'mil-juv', threshold: '2.5+', hits: 5, total: 5, tier: 'teal', title: 'Goals over 2.5',  reason: 'Above L5 trend',    category: 'Goals',   legStatus: 'won', actualResult: 'Final 3-1' },
      { id: 'b-won-3::3', fixtureId: 'mci-cry', threshold: '1+',   hits: 5, total: 5, tier: 'teal', title: 'Haaland SOT',     reason: '5/5 floor',         category: 'SOT',     legStatus: 'won', actualResult: 'Haaland 2 SOT' },
    ],
  },
  {
    id: 'b-won-4',
    name: 'Derby cards',
    savedAt: '2026-04-19T20:45:00.000Z',
    status: 'won',
    riskTier: 'Safe',
    legs: [
      { id: 'b-won-4::1', fixtureId: 'int-mil', threshold: '5+', hits: 5, total: 5, tier: 'teal', title: 'Combined cards 5+', reason: 'Derby intensity', category: 'Cards', legStatus: 'won', actualResult: 'Match had 7 cards' },
      { id: 'b-won-4::2', fixtureId: 'mar-psg', threshold: '5+', hits: 4, total: 5, tier: 'amber',title: 'Cards 5+',          reason: 'Vélodrome heat',  category: 'Cards', legStatus: 'won', actualResult: 'Match had 6 cards' },
    ],
  },
  {
    id: 'b-won-5',
    name: 'Doku fouls anchor',
    savedAt: '2026-04-12T17:30:00.000Z',
    status: 'won',
    riskTier: 'Safe',
    legs: [
      { id: 'b-won-5::1', fixtureId: 'mci-cry', threshold: '1+', hits: 5, total: 5, tier: 'teal', title: 'Doku to be fouled 1+', reason: 'Attracts contact', category: 'Players', legStatus: 'won', actualResult: 'Doku fouled 3 times' },
    ],
  },
  {
    id: 'b-won-6',
    name: 'PSG SOT floor',
    savedAt: '2026-04-05T20:45:00.000Z',
    status: 'won',
    riskTier: 'Safe',
    legs: [
      { id: 'b-won-6::1', fixtureId: 'psg-mar', threshold: '2+', hits: 5, total: 5, tier: 'teal', title: 'PSG SOT 2+',       reason: 'Floor of 2',    category: 'SOT',     legStatus: 'won', actualResult: 'PSG had 5 SOT' },
      { id: 'b-won-6::2', fixtureId: 'psg-mar', threshold: '8+', hits: 5, total: 5, tier: 'teal', title: 'PSG corners 8+',   reason: 'High volume',   category: 'Corners', legStatus: 'won', actualResult: 'PSG had 9 corners' },
    ],
  },
  {
    id: 'b-won-7',
    name: 'City corner double',
    savedAt: '2026-03-29T15:00:00.000Z',
    status: 'won',
    riskTier: 'Safe',
    legs: [
      { id: 'b-won-7::1', fixtureId: 'mci-cry', threshold: '8+',  hits: 5, total: 5, tier: 'teal', title: 'City corners 8+',       reason: 'L5 floor',          category: 'Corners', legStatus: 'won', actualResult: 'City had 10 corners' },
      { id: 'b-won-7::2', fixtureId: 'mci-cry', threshold: '4+',  hits: 5, total: 5, tier: 'teal', title: 'City SOT 4+',           reason: 'High volume',       category: 'SOT',     legStatus: 'won', actualResult: 'City had 6 SOT' },
    ],
  },
  {
    id: 'b-won-8',
    name: 'BTTS clean',
    savedAt: '2026-03-22T19:45:00.000Z',
    status: 'won',
    riskTier: 'Safe',
    legs: [
      { id: 'b-won-8::1', fixtureId: 'ata-rom', threshold: 'BTTS', hits: 5, total: 5, tier: 'teal', title: 'Both teams to score', reason: 'BTTS in 5/5', category: 'Goals', legStatus: 'won', actualResult: 'Final 2-1' },
    ],
  },
  {
    id: 'b-won-9',
    name: 'Klassiker corners',
    savedAt: '2026-03-15T18:30:00.000Z',
    status: 'won',
    riskTier: 'Balanced',
    legs: [
      { id: 'b-won-9::1', fixtureId: 'bay-dor', threshold: '8+', hits: 4, total: 5, tier: 'amber', title: 'Combined corners 8+', reason: 'Both attack wide', category: 'Corners', legStatus: 'won', actualResult: 'Combined 11 corners' },
      { id: 'b-won-9::2', fixtureId: 'bay-dor', threshold: '3+', hits: 5, total: 5, tier: 'teal',  title: 'Bayern goals 3+',     reason: 'L5 floor',         category: 'Goals',   legStatus: 'won', actualResult: 'Bayern scored 4' },
    ],
  },

  // ─── LOST (6)
  {
    id: 'b-lost-1',
    name: 'Friday cards-heavy',
    savedAt: '2026-05-08T19:00:00.000Z',
    status: 'lost',
    riskTier: 'Balanced',
    legs: [
      { id: 'b-lost-1::1', fixtureId: 'che-mun', threshold: '4.5+', hits: 4, total: 5, tier: 'amber', title: 'Cards over 4.5',     reason: 'Oliver above avg', category: 'Cards', legStatus: 'lost', actualResult: 'Only 3 cards' },
      { id: 'b-lost-1::2', fixtureId: 'int-mil', threshold: '5+',   hits: 5, total: 5, tier: 'teal',  title: 'Combined cards 5+', reason: 'Derby tension',     category: 'Cards', legStatus: 'won',  actualResult: 'Match had 7 cards' },
      { id: 'b-lost-1::3', fixtureId: 'ata-rom', threshold: '5+',   hits: 4, total: 5, tier: 'amber', title: 'Cards 5+',          reason: 'Cards-heavy ref',   category: 'Cards', legStatus: 'lost', actualResult: 'Only 4 cards' },
    ],
  },
  {
    id: 'b-lost-2',
    name: 'Six-leg long shot',
    savedAt: '2026-04-30T20:00:00.000Z',
    status: 'lost',
    riskTier: 'Balanced',
    legs: [
      { id: 'b-lost-2::1', fixtureId: 'rma-bar', threshold: '3.5+', hits: 5, total: 5, tier: 'teal',  title: 'Goals over 3.5',    reason: 'Both attack',       category: 'Goals',   legStatus: 'won',  actualResult: 'Final 4-2' },
      { id: 'b-lost-2::2', fixtureId: 'rma-bar', threshold: 'BTTS', hits: 4, total: 5, tier: 'amber', title: 'BTTS — yes',         reason: 'Both scoring',      category: 'Goals',   legStatus: 'won',  actualResult: 'Both scored' },
      { id: 'b-lost-2::3', fixtureId: 'rma-bar', threshold: '6+',   hits: 4, total: 5, tier: 'amber', title: 'Madrid corners 6+', reason: 'Possession edge',   category: 'Corners', legStatus: 'won',  actualResult: 'Madrid had 8' },
      { id: 'b-lost-2::4', fixtureId: 'rma-bar', threshold: '2+',   hits: 4, total: 5, tier: 'amber', title: 'Mbappé SOT 2+',     reason: 'L5 anchor',         category: 'SOT',     legStatus: 'won',  actualResult: 'Mbappé 3 SOT' },
      { id: 'b-lost-2::5', fixtureId: 'rma-bar', threshold: '5+',   hits: 4, total: 5, tier: 'amber', title: 'Cards 5+',          reason: 'Clásico tension',   category: 'Cards',   legStatus: 'lost', actualResult: 'Only 4 cards' },
      { id: 'b-lost-2::6', fixtureId: 'rma-bar', threshold: '4+',   hits: 3, total: 5, tier: 'muted', title: 'Vinícius shots 4+', reason: 'Ramping role',      category: 'Shots',   legStatus: 'lost', actualResult: 'Vinícius 2 shots' },
    ],
  },
  {
    id: 'b-lost-3',
    name: 'Eight-leg moonshot',
    savedAt: '2026-04-22T15:00:00.000Z',
    status: 'lost',
    riskTier: 'Higher risk',
    legs: [
      { id: 'b-lost-3::1', fixtureId: 'mci-cry', threshold: '8+',  hits: 5, total: 5, tier: 'teal',  title: 'City corners 8+',    reason: 'Floor',         category: 'Corners', legStatus: 'won',  actualResult: 'City 10' },
      { id: 'b-lost-3::2', fixtureId: 'liv-ars', threshold: '10+', hits: 5, total: 5, tier: 'teal',  title: 'Corners 10+',        reason: '6+ each',       category: 'Corners', legStatus: 'won',  actualResult: 'Combined 12' },
      { id: 'b-lost-3::3', fixtureId: 'rma-bar', threshold: '3.5+',hits: 5, total: 5, tier: 'teal',  title: 'Goals over 3.5',     reason: 'Both attack',   category: 'Goals',   legStatus: 'won',  actualResult: 'Final 4-2' },
      { id: 'b-lost-3::4', fixtureId: 'int-mil', threshold: '5+',  hits: 5, total: 5, tier: 'teal',  title: 'Cards 5+',           reason: 'Derby tension', category: 'Cards',   legStatus: 'won',  actualResult: 'Match 7 cards' },
      { id: 'b-lost-3::5', fixtureId: 'mci-cry', threshold: '1+',  hits: 5, total: 5, tier: 'teal',  title: 'Haaland SOT 1+',     reason: 'Anchor',        category: 'SOT',     legStatus: 'won',  actualResult: 'Haaland 2 SOT' },
      { id: 'b-lost-3::6', fixtureId: 'mci-cry', threshold: '2+',  hits: 4, total: 5, tier: 'amber', title: 'Doku shots 2+',      reason: 'Wide carrier',  category: 'Shots',   legStatus: 'lost', actualResult: 'Doku 1 shot' },
      { id: 'b-lost-3::7', fixtureId: 'che-mun', threshold: '2.5+',hits: 4, total: 5, tier: 'amber', title: 'Goals over 2.5',     reason: 'Open game',     category: 'Goals',   legStatus: 'lost', actualResult: 'Final 1-1' },
      { id: 'b-lost-3::8', fixtureId: 'tot-eve', threshold: '4+',  hits: 3, total: 5, tier: 'muted', title: 'Spurs SOT 4+',       reason: 'Volume edge',   category: 'SOT',     legStatus: 'lost', actualResult: 'Spurs 2 SOT' },
    ],
  },
  {
    id: 'b-lost-4',
    name: 'Riskier balanced',
    savedAt: '2026-04-15T17:00:00.000Z',
    status: 'lost',
    riskTier: 'Balanced',
    legs: [
      { id: 'b-lost-4::1', fixtureId: 'vil-bet', threshold: 'BTTS', hits: 4, total: 5, tier: 'amber', title: 'BTTS',           reason: 'Both scoring',   category: 'Goals', legStatus: 'won',  actualResult: 'Both scored' },
      { id: 'b-lost-4::2', fixtureId: 'vil-bet', threshold: '3+',   hits: 3, total: 5, tier: 'muted', title: 'Villarreal SOT 3+', reason: 'Ramping form', category: 'SOT',   legStatus: 'lost', actualResult: 'Villarreal 2 SOT' },
    ],
  },
  {
    id: 'b-lost-5',
    name: 'Player shots wide',
    savedAt: '2026-03-30T19:45:00.000Z',
    status: 'lost',
    riskTier: 'Higher risk',
    legs: [
      { id: 'b-lost-5::1', fixtureId: 'juv-nap', threshold: '3+', hits: 4, total: 5, tier: 'amber', title: 'Vlahović 3+ shots',     reason: 'Volume',       category: 'Shots', legStatus: 'lost', actualResult: 'Vlahović 2 shots' },
      { id: 'b-lost-5::2', fixtureId: 'juv-nap', threshold: '2+', hits: 4, total: 5, tier: 'amber', title: 'Kvaratskhelia 2+ shots',reason: 'Ramping role', category: 'Shots', legStatus: 'lost', actualResult: 'Kvara 1 shot' },
    ],
  },
  {
    id: 'b-lost-6',
    name: 'Long cards build',
    savedAt: '2026-03-18T20:00:00.000Z',
    status: 'lost',
    riskTier: 'Higher risk',
    legs: [
      { id: 'b-lost-6::1', fixtureId: 'ata-rom', threshold: '5+',  hits: 4, total: 5, tier: 'amber', title: 'Cards 5+',         reason: 'Hot ref',       category: 'Cards', legStatus: 'lost', actualResult: 'Only 4 cards' },
      { id: 'b-lost-6::2', fixtureId: 'che-mun', threshold: '4.5+',hits: 4, total: 5, tier: 'amber', title: 'Cards over 4.5',   reason: 'Above-avg ref', category: 'Cards', legStatus: 'won',  actualResult: '5 cards' },
      { id: 'b-lost-6::3', fixtureId: 'mar-psg', threshold: '5+',  hits: 4, total: 5, tier: 'amber', title: 'Cards 5+',         reason: 'Derby heat',    category: 'Cards', legStatus: 'lost', actualResult: '4 cards' },
      { id: 'b-lost-6::4', fixtureId: 'int-mil', threshold: '6+',  hits: 3, total: 5, tier: 'muted', title: 'Cards 6+',         reason: 'Higher target', category: 'Cards', legStatus: 'lost', actualResult: '5 cards' },
      { id: 'b-lost-6::5', fixtureId: 'bay-dor', threshold: '5+',  hits: 3, total: 5, tier: 'muted', title: 'Cards 5+',         reason: 'Klassiker',     category: 'Cards', legStatus: 'lost', actualResult: '3 cards' },
      { id: 'b-lost-6::6', fixtureId: 'liv-ars', threshold: '6+',  hits: 3, total: 5, tier: 'muted', title: 'Cards 6+',         reason: 'Above-avg ref', category: 'Cards', legStatus: 'won',  actualResult: '7 cards' },
    ],
  },
];

// Builder performance analytics — pre-computed mock data for the Performance page.
window.PERFORMANCE_DATA = {
  // 26-week win rate trend (last 6 months)
  winRateTrend: [
    { week: 'Wk 1',  rate: 52 },
    { week: 'Wk 2',  rate: 48 },
    { week: 'Wk 3',  rate: 55 },
    { week: 'Wk 4',  rate: 50 },
    { week: 'Wk 5',  rate: 58 },
    { week: 'Wk 6',  rate: 54 },
    { week: 'Wk 7',  rate: 60 },
    { week: 'Wk 8',  rate: 56 },
    { week: 'Wk 9',  rate: 63 },
    { week: 'Wk 10', rate: 58 },
    { week: 'Wk 11', rate: 65 },
    { week: 'Wk 12', rate: 60 },
    { week: 'Wk 13', rate: 68 },
    { week: 'Wk 14', rate: 62 },
    { week: 'Wk 15', rate: 64 },
    { week: 'Wk 16', rate: 58 },
    { week: 'Wk 17', rate: 67 },
    { week: 'Wk 18', rate: 63 },
    { week: 'Wk 19', rate: 70 },
    { week: 'Wk 20', rate: 64 },
    { week: 'Wk 21', rate: 66 },
    { week: 'Wk 22', rate: 60 },
    { week: 'Wk 23', rate: 65 },
    { week: 'Wk 24', rate: 58 },
    { week: 'Wk 25', rate: 62 },
    { week: 'Wk 26', rate: 60 },
  ],
  byLegType: [
    { label: 'Corners',      rate: 72 },
    { label: 'SOT',          rate: 68 },
    { label: 'Goals',        rate: 64 },
    { label: 'Shots',        rate: 48 },
    { label: 'Player props', rate: 56 },
    { label: 'Cards',        rate: 38 },
  ],
  byRiskTier: [
    { label: 'Safe',         rate: 78 },
    { label: 'Balanced',     rate: 54 },
    { label: 'Higher risk',  rate: 22 },
  ],
  byLeague: [
    { label: 'Premier League', count: 18, rate: 68 },
    { label: 'La Liga',        count: 12, rate: 60 },
    { label: 'Serie A',        count: 9,  rate: 56 },
    { label: 'Bundesliga',     count: 6,  rate: 50 },
    { label: 'Ligue 1',        count: 4,  rate: 42 },
  ],
  insights: {
    working: [
      'Your Safe-tier corner builders win 72% — well above the 58% market implied probability.',
      'Sticking to 2–3 leg builders has paid off: 67% win rate vs 28% for 5+ leg builds.',
      'Premier League corner research is your strongest area — 18 builds, 68% hit rate.',
    ],
    watchOut: [
      'Your 6+ leg builders win 14% — long builders compound risk quickly.',
      'Cards-heavy builds are your weakest category at 38%. The market correctly prices referee tendencies.',
      'Higher-risk tier sits at 22%. The extra value rarely pays for the added variance.',
    ],
  },
};
