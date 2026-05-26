// Research-item domain type — seeded from docs/design-source/the-count-v2/project/data.js
// TOP_RESEARCH list. Extends a subset of FixtureSummary with the angle payload.

import type { FixtureSummary } from './fixture';

export interface ResearchAngle {
  /** Threshold label, e.g. '10+', 'BTTS', '5+', '—'. */
  threshold: string;
  /** Hit ratio, e.g. '5/5', '4/5'. */
  hits: string;
  /** Angle title. */
  title: string;
  /** Supporting one-liner. */
  body: string;
  /** Optional tier override; otherwise derived from hits. */
  tier?: 'teal' | 'amber' | 'muted';
}

export interface ResearchItem
  extends Pick<
    FixtureSummary,
    'id' | 'league' | 'kickoff' | 'venue' | 'signal' | 'home' | 'away'
  > {
  angle: ResearchAngle;
}
