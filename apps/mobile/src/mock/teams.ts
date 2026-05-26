// Team registry — ported byte-for-byte from
// docs/design-source/the-count-v2/project/data.js.
//
// Sportmonks ingestion (Phase 7) will replace the team-list portion; the kit
// colourway data is likely to stay hand-maintained here even after ingestion
// (Sportmonks doesn't reliably ship kit patterns).

import type { Team } from '@count/types';

export const TEAMS: Record<string, Team> = {
  // Premier League
  MCI: { code: 'MCI', name: 'Man City',       form: ['W','W','D','W','W'], kit: { pattern: 'solid',            primary: '#6CABDD', secondary: '#1C2C5B', tertiary: '#FFFFFF' } },
  CRY: { code: 'CRY', name: 'Crystal Palace', form: ['W','D','L','L','L'], kit: { pattern: 'vertical_halves',  primary: '#C8102E', secondary: '#1B458F', tertiary: '#FFFFFF' } },
  LIV: { code: 'LIV', name: 'Liverpool',      form: ['W','W','W','D','W'], kit: { pattern: 'solid',            primary: '#C8102E', secondary: '#00B2A9', tertiary: '#FFFFFF' } },
  ARS: { code: 'ARS', name: 'Arsenal',        form: ['W','D','W','W','L'], kit: { pattern: 'horizontal_band',  primary: '#C8102E', secondary: '#FFFFFF', tertiary: '#063672' } },
  NEW: { code: 'NEW', name: 'Newcastle',      form: ['L','W','W','D','W'], kit: { pattern: 'vertical_stripes', primary: '#000000', secondary: '#FFFFFF', tertiary: '#41B6E6' } },
  BRI: { code: 'BRI', name: 'Brighton',       form: ['D','L','W','W','D'], kit: { pattern: 'vertical_stripes', primary: '#0057B7', secondary: '#FFFFFF', tertiary: '#0057B7' } },
  BRE: { code: 'BRE', name: 'Brentford',      form: ['L','W','D','L','W'], kit: { pattern: 'vertical_stripes', primary: '#C8102E', secondary: '#FFFFFF', tertiary: '#000000' } },
  EVE: { code: 'EVE', name: 'Everton',        form: ['D','L','D','W','L'], kit: { pattern: 'solid',            primary: '#003399', secondary: '#FFFFFF', tertiary: '#FFCC00' } },
  SOU: { code: 'SOU', name: 'Southampton',    form: ['L','L','W','L','L'], kit: { pattern: 'vertical_stripes', primary: '#D71920', secondary: '#FFFFFF', tertiary: '#000000' } },
  BUR: { code: 'BUR', name: 'Burnley',        form: ['W','L','D','L','L'], kit: { pattern: 'solid',            primary: '#6C1D45', secondary: '#99D6EA', tertiary: '#FFFFFF' } },
  WOL: { code: 'WOL', name: 'Wolves',         form: ['L','D','W','L','D'], kit: { pattern: 'solid',            primary: '#FDB913', secondary: '#231F20', tertiary: '#FFFFFF' } },
  BOU: { code: 'BOU', name: 'Bournemouth',    form: ['W','W','D','L','W'], kit: { pattern: 'vertical_stripes', primary: '#DA291C', secondary: '#000000', tertiary: '#FFFFFF' } },
  NFO: { code: 'NFO', name: 'Forest',         form: ['L','W','L','L','D'], kit: { pattern: 'solid',            primary: '#DD0000', secondary: '#FFFFFF', tertiary: '#000000' } },
  TOT: { code: 'TOT', name: 'Tottenham',      form: ['W','L','W','D','L'], kit: { pattern: 'solid',            primary: '#FFFFFF', secondary: '#132257', tertiary: '#132257' } },
  CHE: { code: 'CHE', name: 'Chelsea',        form: ['D','W','W','L','W'], kit: { pattern: 'solid',            primary: '#034694', secondary: '#FFFFFF', tertiary: '#DBA111' } },
  MUN: { code: 'MUN', name: 'Man United',     form: ['L','W','D','W','L'], kit: { pattern: 'solid',            primary: '#DA291C', secondary: '#000000', tertiary: '#FBE122' } },
  AVL: { code: 'AVL', name: 'Aston Villa',    form: ['W','D','W','L','D'], kit: { pattern: 'solid',            primary: '#670E36', secondary: '#95BFE5', tertiary: '#FFFFFF' } },
  FUL: { code: 'FUL', name: 'Fulham',         form: ['L','W','L','D','W'], kit: { pattern: 'solid',            primary: '#FFFFFF', secondary: '#000000', tertiary: '#CC0000' } },

  // La Liga
  VIL: { code: 'VIL', name: 'Villarreal',     form: ['W','W','D','W','L'], kit: { pattern: 'solid',            primary: '#FFE667', secondary: '#005CB9', tertiary: '#FFFFFF' } },
  BET: { code: 'BET', name: 'Real Betis',     form: ['D','W','W','L','D'], kit: { pattern: 'vertical_stripes', primary: '#0A8F47', secondary: '#FFFFFF', tertiary: '#0A8F47' } },
  RMA: { code: 'RMA', name: 'Real Madrid',    form: ['W','W','W','D','W'], kit: { pattern: 'solid',            primary: '#FFFFFF', secondary: '#FEBE10', tertiary: '#00529F' } },
  BAR: { code: 'BAR', name: 'Barcelona',      form: ['W','D','W','W','L'], kit: { pattern: 'vertical_halves',  primary: '#A50044', secondary: '#004D98', tertiary: '#FFFFFF' } },
  ATM: { code: 'ATM', name: 'Atlético',       form: ['W','L','D','W','W'], kit: { pattern: 'vertical_stripes', primary: '#CB3524', secondary: '#FFFFFF', tertiary: '#272E61' } },
  SEV: { code: 'SEV', name: 'Sevilla',        form: ['L','D','W','L','D'], kit: { pattern: 'solid',            primary: '#FFFFFF', secondary: '#D40026', tertiary: '#FFFFFF' } },
  GIR: { code: 'GIR', name: 'Girona',         form: ['D','W','L','W','D'], kit: { pattern: 'vertical_stripes', primary: '#CD2129', secondary: '#FFFFFF', tertiary: '#CD2129' } },
  VAL: { code: 'VAL', name: 'Valencia',       form: ['L','L','D','W','W'], kit: { pattern: 'solid',            primary: '#FFFFFF', secondary: '#EE3524', tertiary: '#000000' } },

  // Serie A
  ATA: { code: 'ATA', name: 'Atalanta',       form: ['W','L','W','D','W'], kit: { pattern: 'vertical_stripes', primary: '#171796', secondary: '#000000', tertiary: '#FFFFFF' } },
  ROM: { code: 'ROM', name: 'Roma',           form: ['D','W','L','W','D'], kit: { pattern: 'solid',            primary: '#8C0F22', secondary: '#F0BC42', tertiary: '#FFFFFF' } },
  INT: { code: 'INT', name: 'Inter',          form: ['W','W','D','W','L'], kit: { pattern: 'vertical_stripes', primary: '#010E80', secondary: '#000000', tertiary: '#FFFFFF' } },
  MIL: { code: 'MIL', name: 'Milan',          form: ['L','D','W','W','D'], kit: { pattern: 'vertical_stripes', primary: '#FB090B', secondary: '#000000', tertiary: '#FFFFFF' } },
  JUV: { code: 'JUV', name: 'Juventus',       form: ['D','W','L','W','W'], kit: { pattern: 'vertical_stripes', primary: '#FFFFFF', secondary: '#000000', tertiary: '#000000' } },
  NAP: { code: 'NAP', name: 'Napoli',         form: ['W','D','W','D','L'], kit: { pattern: 'solid',            primary: '#12A0D7', secondary: '#FFFFFF', tertiary: '#003366' } },
  LAZ: { code: 'LAZ', name: 'Lazio',          form: ['L','W','D','L','W'], kit: { pattern: 'solid',            primary: '#A8C8E4', secondary: '#FFFFFF', tertiary: '#0F1C2D' } },
  FIO: { code: 'FIO', name: 'Fiorentina',     form: ['D','D','W','L','D'], kit: { pattern: 'solid',            primary: '#572E91', secondary: '#FFFFFF', tertiary: '#572E91' } },

  // Bundesliga
  BAY: { code: 'BAY', name: 'Bayern',         form: ['W','W','W','D','W'], kit: { pattern: 'solid',            primary: '#DC052D', secondary: '#FFFFFF', tertiary: '#0066B2' } },
  DOR: { code: 'DOR', name: 'Dortmund',       form: ['W','L','D','W','D'], kit: { pattern: 'solid',            primary: '#FDE100', secondary: '#000000', tertiary: '#FFFFFF' } },
  LEV: { code: 'LEV', name: 'Leverkusen',     form: ['W','D','W','W','L'], kit: { pattern: 'horizontal_band',  primary: '#E32221', secondary: '#000000', tertiary: '#FFFFFF' } },
  STU: { code: 'STU', name: 'Stuttgart',      form: ['L','W','D','W','W'], kit: { pattern: 'solid',            primary: '#FFFFFF', secondary: '#E32219', tertiary: '#E32219' } },
  LEI: { code: 'LEI', name: 'Leipzig',        form: ['W','L','W','D','W'], kit: { pattern: 'solid',            primary: '#FFFFFF', secondary: '#DD0741', tertiary: '#001F47' } },
  FRA: { code: 'FRA', name: 'Frankfurt',      form: ['D','W','L','L','D'], kit: { pattern: 'solid',            primary: '#000000', secondary: '#E1000F', tertiary: '#FFFFFF' } },

  // Ligue 1
  PSG: { code: 'PSG', name: 'PSG',            form: ['W','W','W','W','D'], kit: { pattern: 'horizontal_band',  primary: '#004170', secondary: '#FFFFFF', tertiary: '#DA291C' } },
  MAR: { code: 'MAR', name: 'Marseille',      form: ['W','D','W','L','D'], kit: { pattern: 'solid',            primary: '#FFFFFF', secondary: '#2FAEE0', tertiary: '#2FAEE0' } },
  MON: { code: 'MON', name: 'Monaco',         form: ['D','W','L','W','W'], kit: { pattern: 'vertical_halves',  primary: '#E03726', secondary: '#FFFFFF', tertiary: '#E03726' } },
  LYO: { code: 'LYO', name: 'Lyon',           form: ['L','W','D','W','L'], kit: { pattern: 'solid',            primary: '#FFFFFF', secondary: '#003B7B', tertiary: '#DA291C' } },

  // Eredivisie
  AJX: { code: 'AJX', name: 'Ajax',           form: ['W','W','D','W','L'], kit: { pattern: 'horizontal_band',  primary: '#FFFFFF', secondary: '#D2122E', tertiary: '#D2122E' } },
  PSV: { code: 'PSV', name: 'PSV',            form: ['W','D','W','W','W'], kit: { pattern: 'horizontal_band',  primary: '#ED1C24', secondary: '#FFFFFF', tertiary: '#ED1C24' } },
  FEY: { code: 'FEY', name: 'Feyenoord',      form: ['L','W','D','W','D'], kit: { pattern: 'vertical_halves',  primary: '#CC0000', secondary: '#FFFFFF', tertiary: '#000000' } },
};

export function getTeam(code: string): Team | undefined {
  return TEAMS[code];
}
