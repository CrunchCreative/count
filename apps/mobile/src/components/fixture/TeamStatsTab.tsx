// TeamStatsTab — top-level assembly of the fixture-detail Team-stats tab.
//
// Composes (top → bottom):
//   1. H2 title + body paragraph
//   2. Window selector + filter pill row
//   3. xG / xGoT context block (read-only, two paired GlassPanels)
//   4. MatrixCard — the signature comparative-research interaction
//
// Owns the two pieces of tab-local state: window size (5/10/20/38) and the
// show-all-stats toggle. Everything below this component reads from these.
//
// Match Overview's outer `marginTop: 24` so the tab content lines up
// consistently with the route stub's tab-content gap.

import { useState, type ReactElement } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import type { FixtureDetail } from '@count/types';
import { GlassSelect } from '@count/ui';
import { colors, typography } from '@count/tokens';
import { MatrixCard } from './MatrixCard';
import { XGContextBlock } from './XGContextBlock';
import { FilterPill } from './FilterPill';
import type { WindowSize } from './matrix-constants';

const WINDOW_OPTIONS = [
  { id: '5',  label: 'Last 5 matches' },
  { id: '10', label: 'Last 10 matches' },
  { id: '20', label: 'Last 20 matches' },
  { id: '38', label: 'Season' },
];

export interface TeamStatsTabProps {
  fixture: FixtureDetail;
}

export function TeamStatsTab({ fixture }: TeamStatsTabProps): ReactElement {
  const [windowSize, setWindowSize] = useState<WindowSize>(5);
  const [showAll, setShowAll] = useState(false);

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={h2Style}>Team stats</Text>
      <Text style={bodyStyle}>
        Match-by-match research across the selected window. The threshold pill on each row shows the highest value the team hit in every fixture — a safe anchor for builder legs.
      </Text>

      <View style={selectorRowStyle}>
        <View style={{ flex: 1 }}>
          <GlassSelect
            label="WINDOW"
            value={String(windowSize)}
            options={WINDOW_OPTIONS}
            onChange={(id) => setWindowSize(Number(id) as WindowSize)}
          />
        </View>
        <FilterPill count={2} />
      </View>

      <XGContextBlock xg={fixture.xg} homeCode={fixture.home} awayCode={fixture.away} />

      <MatrixCard
        matrix={fixture.matrix}
        homeCode={fixture.home}
        awayCode={fixture.away}
        fixtureId={fixture.id}
        windowSize={windowSize}
        showAll={showAll}
        onToggleShowAll={() => setShowAll((v) => !v)}
      />
    </View>
  );
}

const h2Style = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 22,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.3,
};

const bodyStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.regular,
  marginTop: 6,
  lineHeight: 13 * 1.5,
};

const selectorRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'stretch',
  gap: 8,
  marginTop: 14,
};
