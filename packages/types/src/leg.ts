// Leg + LegTier — the unit added to / removed from the Note Pad.
// A Leg represents a single statistical angle a user has flagged for research.
// Composed of: who (fixtureId), what (threshold + title), how strong (hits/total),
// and the visual tier the source mapped it to. `odds?: never` reserves the field
// for V1.1 while preventing accidental V1 usage (decision 12 in PROJECT-STATE).

export type LegTier = 'teal' | 'amber' | 'muted';

export interface Leg {
  /** Unique within a single pad — e.g. `${fixtureId}::list-top` or `${fixtureId}::team::${stat}`. */
  id: string;
  fixtureId: string;
  /** Display threshold — '8+', '↑4.5', 'BTTS', '—'. */
  threshold: string;
  hits: number;
  total: number;
  tier: LegTier;
  title: string;
  /** Optional supporting one-liner. */
  reason?: string;
  /** Reserved for V1.1 odds; no V1 component reads this. */
  odds?: never;
}
