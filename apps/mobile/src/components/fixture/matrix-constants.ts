// Shared dimensions + window enum for the team-matrix subsystem.
//
// 4B.5 — stat row split into TWO rows: label (small) and data (taller).
// The label row holds the uppercase stat name; the data row holds the
// SafePill on the sticky side and the cells on the scrolling side. Both
// halves of each pair share the same height constant so the regions stay
// vertically aligned row-for-row.
//
// Categories and ROW_HEIGHT_CATEGORY are gone — categories removed in 4B.5.

export type WindowSize = 5 | 10 | 20 | 38;

// Side head: kit + team name + "LAST N OF 38" count.
export const ROW_HEIGHT_HEAD = 36;

// Fixture header row carries 3 internal items per column:
// date + H/A, kit + opp code, scoreline pill.
export const ROW_HEIGHT_FIXTURE_HEADER = 44;

// Per-stat split rows.
export const ROW_HEIGHT_STAT_LABEL = 22;   // small label row, full width
export const ROW_HEIGHT_STAT_DATA = 44;    // SafePill + cells, centred

// Vertical separator between home and away sides — handled by MatrixCard.
export const ROW_GAP_SIDES = 50;

// Horizontal dimensions.
export const STICKY_COL_WIDTH = 96;
export const CELL_WIDTH = 50;
export const CELL_GAP = 4;