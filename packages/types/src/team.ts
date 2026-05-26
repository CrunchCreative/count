// Team + kit domain types — seeded from docs/design-source/the-count-v2/project/data.js.
// Sportmonks ingestion (Phase 7) replaces the mock TEAMS registry that consumes these types;
// the kit colourway data will likely stay hand-maintained even after ingestion.

export type KitPattern =
  | 'solid'
  | 'vertical_halves'
  | 'vertical_stripes'
  | 'horizontal_band';

export type FormResult = 'W' | 'D' | 'L';

export interface TeamKit {
  pattern: KitPattern;
  primary: string;
  secondary: string;
  tertiary?: string;
}

export interface Team {
  /** Unique short code — 'MCI', 'CRY', etc. */
  code: string;
  /** Display name. */
  name: string;
  /** Last 5 results, oldest → newest. */
  form: FormResult[];
  kit: TeamKit;
}
