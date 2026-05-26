// Top-research items — ported byte-for-byte from
// docs/design-source/the-count-v2/project/data.js TOP_RESEARCH (ranks 2-4).

import type { ResearchItem } from '@count/types';

export const TOP_RESEARCH: ResearchItem[] = [
  {
    id: 'liv-ars',
    league: 'Premier League',
    kickoff: '20:00',
    venue: 'Anfield',
    signal: 87,
    home: 'LIV',
    away: 'ARS',
    angle: {
      threshold: '10+',
      hits: '5/5',
      title: 'Combined corners 10 or more',
      body: 'Both teams average 6+ corners · plus 2 more strong angles',
    },
  },
  {
    id: 'vil-bet',
    league: 'La Liga',
    kickoff: '21:00',
    venue: 'La Cerámica',
    signal: 74,
    home: 'VIL',
    away: 'BET',
    angle: {
      threshold: 'BTTS',
      hits: '4/5',
      title: 'Both teams to score',
      body: 'Both sides hit BTTS in 4 of last 5 · referee tendency aligned',
    },
  },
  {
    id: 'ata-rom',
    league: 'Serie A',
    kickoff: '19:45',
    venue: 'Gewiss',
    signal: 71,
    home: 'ATA',
    away: 'ROM',
    angle: {
      threshold: '5+',
      hits: '4/5',
      title: 'Cards 5 or more',
      body: 'Cards-heavy referee · both teams averaging 2+ cards',
      tier: 'amber',
    },
  },
];
