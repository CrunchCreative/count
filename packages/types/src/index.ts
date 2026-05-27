// Domain types — Fixture, Team, League, Builder, Pattern, etc.
// Seeded from docs/design-source/the-count-v2/project/data.js + data-builders.js shapes.

export type { Team, TeamKit, KitPattern, FormResult } from './team';
export type { FixtureSummary, SignalTier } from './fixture';
export type { ResearchItem, ResearchAngle } from './research';
export type { CarouselSlide, CarouselKind } from './carousel';
export type { Leg, LegTier } from './leg';
export type { FixtureListItem, FixturesByLeague } from './fixture-list';
export type {
  FixtureDetail,
  FixtureWinProb,
  FixtureRefereeDetail,
  FixtureH2H,
  StrongestAngle,
  TeamMatrixStat,
  TeamMatrixFixture,
  TeamMatrixSide,
  FixtureMatrix,
  XGData,
  FixtureXG,
} from './fixture-detail';
