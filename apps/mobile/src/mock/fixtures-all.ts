// FIXTURES_ALL — typed port of docs/design-source/the-count-v2/project/data.js
// (lines 287–338). Drives the Fixtures tab.
//
// The source keys fixtures by league with no per-record `league` field; the
// JSX flat-injects it at render time via `{...f, league}`. Here we inject up
// front so the typed mock satisfies `FixtureListItem` directly (league is
// required on the type), and `FIXTURES_BY_ID` becomes a trivial flatten.

import type { FixtureListItem, FixturesByLeague } from '@count/types';

type FixtureMinusLeague = Omit<FixtureListItem, 'league'>;

const RAW: Record<string, FixtureMinusLeague[]> = {
  'Premier League': [
    { id: 'mci-cry', kickoff: '17:30', venue: 'Etihad',             home: 'MCI', away: 'CRY', signal: 92, topAngle: { threshold: '8+',   hits: '5/5', title: 'City corners 8+',         tier: 'teal' } },
    { id: 'liv-ars', kickoff: '20:00', venue: 'Anfield',            home: 'LIV', away: 'ARS', signal: 87, topAngle: { threshold: '10+',  hits: '5/5', title: 'Combined corners 10+',   tier: 'teal' } },
    { id: 'che-mun', kickoff: '12:30', venue: 'Stamford Bridge',    home: 'CHE', away: 'MUN', signal: 71, topAngle: { threshold: '4.5+', hits: '4/5', title: 'Cards over 4.5',         tier: 'amber' } },
    { id: 'new-bri', kickoff: '15:00', venue: 'St James’ Park',     home: 'NEW', away: 'BRI', signal: 68, topAngle: { threshold: '2.5+', hits: '4/5', title: 'Goals over 2.5',         tier: 'amber' } },
    { id: 'tot-eve', kickoff: '15:00', venue: 'Tottenham Stadium',  home: 'TOT', away: 'EVE', signal: 64, topAngle: { threshold: '1+',   hits: '4/5', title: 'Tottenham SOT 4+',       tier: 'amber' } },
    { id: 'avl-ful', kickoff: '17:30', venue: 'Villa Park',         home: 'AVL', away: 'FUL', signal: 58, topAngle: { threshold: '1+',   hits: '3/5', title: 'BTTS leaning',           tier: 'muted' } },
    { id: 'bre-wol', kickoff: '15:00', venue: 'Gtech',              home: 'BRE', away: 'WOL', signal: 52, topAngle: { threshold: '—',    hits: '2/5', title: 'No 5/5 angles surfaced', tier: 'muted' } },
    { id: 'sou-bou', kickoff: '15:00', venue: 'St Mary’s',          home: 'SOU', away: 'BOU', signal: 47, topAngle: { threshold: '—',    hits: '2/5', title: 'Low-signal fixture',     tier: 'muted' } },
    { id: 'bur-nfo', kickoff: '15:00', venue: 'Turf Moor',          home: 'BUR', away: 'NFO', signal: 44, topAngle: { threshold: '—',    hits: '2/5', title: 'Pattern engine quiet',   tier: 'muted' } },
    { id: 'eve-mci', kickoff: '20:00', venue: 'Goodison',           home: 'EVE', away: 'MCI', signal: 78, topAngle: { threshold: '8+',   hits: '4/5', title: 'City corners floor',     tier: 'amber' } },
  ],
  'La Liga': [
    { id: 'rma-bar', kickoff: '21:00', venue: 'Bernabéu',           home: 'RMA', away: 'BAR', signal: 89, topAngle: { threshold: '3.5+', hits: '5/5', title: 'Match over 3.5 goals',   tier: 'teal' } },
    { id: 'vil-bet', kickoff: '21:00', venue: 'La Cerámica',        home: 'VIL', away: 'BET', signal: 74, topAngle: { threshold: 'BTTS', hits: '4/5', title: 'Both teams to score',    tier: 'amber' } },
    { id: 'atm-sev', kickoff: '18:30', venue: 'Metropolitano',      home: 'ATM', away: 'SEV', signal: 66, topAngle: { threshold: '4+',   hits: '4/5', title: 'Atléti corners 4+',      tier: 'amber' } },
    { id: 'gir-val', kickoff: '16:15', venue: 'Montilivi',          home: 'GIR', away: 'VAL', signal: 54, topAngle: { threshold: '—',    hits: '3/5', title: 'Mid-table watch',        tier: 'muted' } },
    { id: 'bar-atm', kickoff: '20:00', venue: 'Camp Nou',           home: 'BAR', away: 'ATM', signal: 81, topAngle: { threshold: '2.5+', hits: '5/5', title: 'Goals over 2.5',         tier: 'teal' } },
    { id: 'sev-rma', kickoff: '21:00', venue: 'Sánchez Pizjuán',    home: 'SEV', away: 'RMA', signal: 72, topAngle: { threshold: '2+',   hits: '4/5', title: 'Madrid SOT floor',       tier: 'amber' } },
    { id: 'val-vil', kickoff: '14:00', venue: 'Mestalla',           home: 'VAL', away: 'VIL', signal: 49, topAngle: { threshold: '—',    hits: '2/5', title: 'Pattern engine quiet',   tier: 'muted' } },
  ],
  'Serie A': [
    { id: 'ata-rom', kickoff: '19:45', venue: 'Gewiss',             home: 'ATA', away: 'ROM', signal: 71, topAngle: { threshold: '5+',   hits: '4/5', title: 'Cards 5 or more',        tier: 'amber' } },
    { id: 'int-mil', kickoff: '20:45', venue: 'San Siro',           home: 'INT', away: 'MIL', signal: 88, topAngle: { threshold: '5+',   hits: '5/5', title: 'Combined cards 5+',      tier: 'teal' } },
    { id: 'juv-nap', kickoff: '17:00', venue: 'Allianz Stadium',    home: 'JUV', away: 'NAP', signal: 76, topAngle: { threshold: '2+',   hits: '4/5', title: 'Napoli SOT 2+',          tier: 'amber' } },
    { id: 'laz-fio', kickoff: '17:00', venue: 'Olimpico',           home: 'LAZ', away: 'FIO', signal: 61, topAngle: { threshold: '4+',   hits: '4/5', title: 'Lazio corners 4+',       tier: 'amber' } },
    { id: 'mil-juv', kickoff: '20:45', venue: 'San Siro',           home: 'MIL', away: 'JUV', signal: 83, topAngle: { threshold: '2.5+', hits: '5/5', title: 'Match over 2.5 goals',   tier: 'teal' } },
    { id: 'nap-ata', kickoff: '19:45', venue: 'Diego Maradona',     home: 'NAP', away: 'ATA', signal: 67, topAngle: { threshold: '8+',   hits: '4/5', title: 'Combined corners 8+',    tier: 'amber' } },
    { id: 'fio-laz', kickoff: '12:30', venue: 'Artemio Franchi',    home: 'FIO', away: 'LAZ', signal: 55, topAngle: { threshold: '—',    hits: '3/5', title: 'Cards above avg',        tier: 'muted' } },
  ],
  'Bundesliga': [
    { id: 'bay-dor', kickoff: '18:30', venue: 'Allianz Arena',      home: 'BAY', away: 'DOR', signal: 91, topAngle: { threshold: '3.5+', hits: '5/5', title: 'Klassiker goal-fest',    tier: 'teal' } },
    { id: 'lev-stu', kickoff: '15:30', venue: 'BayArena',           home: 'LEV', away: 'STU', signal: 79, topAngle: { threshold: '2+',   hits: '5/5', title: 'Leverkusen SOT 2+',      tier: 'teal' } },
    { id: 'lei-fra', kickoff: '15:30', venue: 'Red Bull Arena',     home: 'LEI', away: 'FRA', signal: 63, topAngle: { threshold: '5+',   hits: '4/5', title: 'Combined corners 5+',    tier: 'amber' } },
    { id: 'dor-lev', kickoff: '15:30', venue: 'Signal Iduna',       home: 'DOR', away: 'LEV', signal: 73, topAngle: { threshold: '3+',   hits: '4/5', title: 'Goal threat both sides', tier: 'amber' } },
    { id: 'stu-bay', kickoff: '18:30', venue: 'MHPArena',           home: 'STU', away: 'BAY', signal: 69, topAngle: { threshold: '2+',   hits: '4/5', title: 'Bayern SOT floor',       tier: 'amber' } },
    { id: 'fra-lei', kickoff: '15:30', venue: 'Deutsche Bank Park', home: 'FRA', away: 'LEI', signal: 56, topAngle: { threshold: '—',    hits: '3/5', title: 'Yellow card watch',      tier: 'muted' } },
  ],
  'Ligue 1': [
    { id: 'psg-mar', kickoff: '20:45', venue: 'Parc des Princes',   home: 'PSG', away: 'MAR', signal: 86, topAngle: { threshold: '2+',   hits: '5/5', title: 'PSG SOT floor',          tier: 'teal' } },
    { id: 'mon-lyo', kickoff: '17:00', venue: 'Louis II',           home: 'MON', away: 'LYO', signal: 70, topAngle: { threshold: '2.5+', hits: '4/5', title: 'Goals over 2.5',         tier: 'amber' } },
    { id: 'mar-psg', kickoff: '21:00', venue: 'Vélodrome',          home: 'MAR', away: 'PSG', signal: 65, topAngle: { threshold: '5+',   hits: '4/5', title: 'Cards 5 or more',        tier: 'amber' } },
    { id: 'lyo-mon', kickoff: '17:00', venue: 'Groupama',           home: 'LYO', away: 'MON', signal: 53, topAngle: { threshold: '—',    hits: '3/5', title: 'Pattern engine quiet',   tier: 'muted' } },
    { id: 'psg-lyo', kickoff: '20:45', venue: 'Parc des Princes',   home: 'PSG', away: 'LYO', signal: 77, topAngle: { threshold: '3+',   hits: '4/5', title: 'PSG corners 3+',         tier: 'amber' } },
  ],
  'Eredivisie': [
    { id: 'ajx-psv', kickoff: '20:00', venue: 'Johan Cruijff Arena', home: 'AJX', away: 'PSV', signal: 84, topAngle: { threshold: '2.5+', hits: '5/5', title: 'Goals over 2.5',         tier: 'teal' } },
    { id: 'fey-ajx', kickoff: '14:30', venue: 'De Kuip',             home: 'FEY', away: 'AJX', signal: 75, topAngle: { threshold: '5+',   hits: '4/5', title: 'Cards in De Klassieker', tier: 'amber' } },
    { id: 'psv-fey', kickoff: '16:45', venue: 'Philips Stadion',     home: 'PSV', away: 'FEY', signal: 62, topAngle: { threshold: '2+',   hits: '4/5', title: 'PSV SOT 2+',             tier: 'amber' } },
  ],
};

export const FIXTURES_ALL: FixturesByLeague = Object.fromEntries(
  Object.entries(RAW).map(([league, fixtures]) => [
    league,
    fixtures.map((f) => ({ ...f, league })),
  ]),
);

/** Flat lookup of every fixture in `FIXTURES_ALL` by id. */
export const FIXTURES_BY_ID: Record<string, FixtureListItem> = Object.values(
  FIXTURES_ALL,
).reduce((acc, list) => {
  for (const f of list) acc[f.id] = f;
  return acc;
}, {} as Record<string, FixtureListItem>);
