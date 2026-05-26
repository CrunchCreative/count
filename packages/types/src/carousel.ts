// Carousel-slide domain type — seeded from docs/design-source/the-count-v2/project/data.js
// CAROUSEL array. Drives the Dashboard's hero carousel.

export type CarouselKind = 'pattern-hit' | 'engine' | 'depth';

export interface CarouselSlide {
  kind: CarouselKind;
  /** Badge label, e.g. 'PATTERN HIT'. */
  label: string;
  /** Meta sub-label, e.g. 'YESTERDAY'. */
  sub: string;
  /** Slide title. */
  title: string;
  /** Body copy. */
  body: string;
  /** Call-to-action label. */
  cta: string;
}
