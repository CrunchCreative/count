// Hero-carousel slide data — ported byte-for-byte from
// docs/design-source/the-count-v2/project/data.js CAROUSEL.

import type { CarouselSlide } from '@count/types';

export const CAROUSEL: CarouselSlide[] = [
  {
    kind: 'pattern-hit',
    label: 'PATTERN HIT',
    sub: 'YESTERDAY',
    title: 'Liverpool treble landed',
    body: 'Over 4 corners · BTTS · Both teams carded — all three legs from yesterday’s Safe builder.',
    cta: 'See the workings',
  },
  {
    kind: 'engine',
    label: 'ENGINE BRIEF',
    sub: 'TODAY · 06:00',
    title: '11 strong angles surfaced',
    body: 'Corners cluster across Premier League · 4 referees flagged cards-heavy · Haaland SOT floor steady.',
    cta: 'Open today’s scan',
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
