// OverviewTab — top-level assembly of the fixture-detail Overview tab.
//
// Composes (top → bottom):
//   1. FixtureHeroPanel       (kits / form / kickoff / ranks / win-prob bar)
//   2. StrongestAnglesPanel   (engine-toned section + addable angle rows)
//   3. H2HRefereePair         (two-up panels)
//   4. BuildABuilderPanel     (CTA — Phase 5 routes the destination)
//
// Source: docs/design-source/the-count-v2/project/screens/fixture.jsx
// `function OverviewTab` (line ~66 onwards). The outer `marginTop: 24`
// mirrors the route stub's tab-content wrapper at line 51.
//
// Inter-section spacing is owned by each sub-component (SectionHead provides
// its own marginTop: 22; H2HRefereePair and BuildABuilderPanel carry their
// own marginTop: 14) — consistent with the source pattern.

import type { ReactElement } from 'react';
import { View } from 'react-native';
import type { FixtureDetail } from '@count/types';
import { BuildABuilderPanel } from './BuildABuilderPanel';
import { FixtureHeroPanel } from './FixtureHeroPanel';
import { H2HRefereePair } from './H2HRefereePair';
import { StrongestAnglesPanel } from './StrongestAnglesPanel';

export interface OverviewTabProps {
  fixture: FixtureDetail;
}

export function OverviewTab({ fixture }: OverviewTabProps): ReactElement {
  return (
    <View style={{ marginTop: 24 }}>
      <FixtureHeroPanel fixture={fixture} />
      <StrongestAnglesPanel fixture={fixture} />
      <H2HRefereePair fixture={fixture} />
      <BuildABuilderPanel onPick={() => {}} />
    </View>
  );
}
