// Today's fixtures — ported byte-for-byte from
// docs/design-source/the-count-v2/project/data.js TODAY (Premier League slice).

import type { FixtureSummary } from '@count/types';

export const TODAY: FixtureSummary[] = [
  { id: 'mci-cry', league: 'Premier League', leagueShort: 'PL', kickoff: '17:30', signal: 92, home: 'MCI', away: 'CRY', ref: 'M. Oliver',  refCpm: '4.2', venue: 'Etihad',            primary: true },
  { id: 'liv-ars', league: 'Premier League', leagueShort: 'PL', kickoff: '20:00', signal: 87, home: 'LIV', away: 'ARS', ref: 'A. Taylor',  refCpm: '5.1', venue: 'Anfield' },
  { id: 'new-bri', league: 'Premier League', leagueShort: 'PL', kickoff: '15:00', signal: 68, home: 'NEW', away: 'BRI', ref: 'S. Attwell', refCpm: '3.4', venue: 'St James’ Park' },
  { id: 'che-mun', league: 'Premier League', leagueShort: 'PL', kickoff: '12:30', signal: 71, home: 'CHE', away: 'MUN', ref: 'P. Tierney', refCpm: '3.9', venue: 'Stamford Bridge' },
  { id: 'tot-eve', league: 'Premier League', leagueShort: 'PL', kickoff: '14:00', signal: 64, home: 'TOT', away: 'EVE', ref: 'D. Coote',   refCpm: '3.7', venue: 'Tottenham Stadium' },
  { id: 'bre-wol', league: 'Premier League', leagueShort: 'PL', kickoff: '15:00', signal: 58, home: 'BRE', away: 'WOL', ref: 'C. Pawson',  refCpm: '4.0', venue: 'Gtech' },
];
