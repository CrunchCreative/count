// Featured-match fixture summary — Dashboard-visible subset of FIXTURE_MCI_CRY
// from docs/design-source/the-count-v2/project/data.js. Only the fields the
// Dashboard's <FeaturedMatch> reads are ported; thresholds / matrix / players /
// referee / h2h belong to Phase 3 (fixture detail screen).

import type { FixtureSummary } from '@count/types';

export const FEATURED: FixtureSummary = {
  id: 'mci-cry',
  league: 'Premier League',
  kickoff: '17:30',
  venue: 'Etihad',
  signal: 92,
  home: 'MCI',
  away: 'CRY',
};
