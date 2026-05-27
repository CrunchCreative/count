// MatrixSide — one team's section inside the matrix card.
//
// 4B.5 — categories removed. The body is now a flat list of stats. Each
// stat renders TWO row pairs:
//   - LABEL ROW PAIR: stat name in sticky-left, blank spacer on cells side
//   - DATA ROW PAIR: SafePill in sticky-left, cells in scrolling-right
//
// Both halves of each pair declare the same height constant
// (ROW_HEIGHT_STAT_LABEL or ROW_HEIGHT_STAT_DATA) so the sticky and
// scrolling regions align row-for-row.
//
// Scroll sync via shared scrollRef/syncRef + ownFlag/syncFlag — unchanged
// from prior phases.

import {
  Fragment,
  useMemo,
  type ReactElement,
  type MutableRefObject,
  type RefObject,
} from 'react';
import {
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from 'react-native';
import type { TeamMatrixSide, TeamMatrixStat } from '@count/types';
import { TEAMS } from '../../mock/teams';
import {
  CELL_GAP,
  CELL_WIDTH,
  ROW_HEIGHT_FIXTURE_HEADER,
  STICKY_COL_WIDTH,
  type WindowSize,
} from './matrix-constants';
import {
  MatrixFixtureHeaderRow,
  MatrixSideHead,
  MatrixStatCells,
  MatrixStatLabelGap,
  MatrixStatLabelSticky,
  MatrixStatSticky,
} from './MatrixRow';

interface FlatStat {
  statName: string;
  stat: TeamMatrixStat;
}

function buildFlatStatList(
  stats: TeamMatrixSide['stats'],
  showAll: boolean,
): FlatStat[] {
  const out: FlatStat[] = [];
  for (const catStats of Object.values(stats)) {
    for (const [statName, stat] of Object.entries(catStats)) {
      if (showAll || stat.defaultVisible) {
        out.push({ statName, stat });
      }
    }
  }
  return out;
}

export interface MatrixSideProps {
  teamCode: string;
  data: TeamMatrixSide;
  windowSize: WindowSize;
  showAll: boolean;
  fixtureId: string;
  scrollRef: RefObject<ScrollView | null>;
  syncRef: RefObject<ScrollView | null>;
  ownFlag: MutableRefObject<boolean>;
  syncFlag: MutableRefObject<boolean>;
}

export function MatrixSide({
  teamCode,
  data,
  windowSize,
  showAll,
  fixtureId,
  scrollRef,
  syncRef,
  ownFlag,
  syncFlag,
}: MatrixSideProps): ReactElement {
  const teamName = TEAMS[teamCode]?.name ?? teamCode;
  const fixtures = data.fixtures.slice(0, windowSize);

  const stats = useMemo(
    () => buildFlatStatList(data.stats, showAll),
    [data.stats, showAll],
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (ownFlag.current) {
      ownFlag.current = false;
      return;
    }
    const x = e.nativeEvent.contentOffset.x;
    if (syncRef.current) {
      syncFlag.current = true;
      syncRef.current.scrollTo({ x, animated: false });
    }
  };

  const cellsContentWidth =
    windowSize * CELL_WIDTH + (windowSize - 1) * CELL_GAP;

  return (
    <View>
      <MatrixSideHead teamCode={teamCode} windowSize={windowSize} />

      <View style={rowContainerStyle}>
        {/* Sticky-left column. Blank spacer for the fixture-header row,
            then per stat: label row + data row (with SafePill). */}
        <View style={{ width: STICKY_COL_WIDTH }}>
          <View style={{ height: ROW_HEIGHT_FIXTURE_HEADER }} />
          {stats.map(({ statName, stat }, idx) => (
            <Fragment key={`L-${idx}`}>
              <MatrixStatLabelSticky statName={statName} />
              <MatrixStatSticky
                statName={statName}
                stat={stat}
                windowSize={windowSize}
                fixtureId={fixtureId}
                teamCode={teamCode}
                teamName={teamName}
              />
            </Fragment>
          ))}
        </View>

        {/* Scrolling right region. Fixture header at top, then per stat:
            label-gap spacer + cells row. The label-gap is a blank View
            matching the label-row height on the sticky side, keeping
            row-for-row alignment. */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          bounces={false}
          style={scrollViewStyle}
        >
          <View style={{ width: cellsContentWidth }}>
            <MatrixFixtureHeaderRow fixtures={fixtures} />
            {stats.map(({ statName, stat }, idx) => (
              <Fragment key={`R-${idx}`}>
                <MatrixStatLabelGap />
                <MatrixStatCells
                  statName={statName}
                  stat={stat}
                  windowSize={windowSize}
                  fixtureId={fixtureId}
                  teamCode={teamCode}
                  teamName={teamName}
                />
              </Fragment>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const rowContainerStyle: ViewStyle = {
  flexDirection: 'row',
};

const scrollViewStyle: ViewStyle = {
  flex: 1,
};