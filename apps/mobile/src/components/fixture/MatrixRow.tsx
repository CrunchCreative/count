// MatrixRow + sibling row primitives.
//
// 4B.5 — categories removed. Each stat is now a LABEL ROW followed by a
// DATA ROW. Sticky and cells halves of the data row both declare height
// ROW_HEIGHT_STAT_DATA, so they align row-for-row across the sticky/scroll
// boundary. The label row is full-width on the sticky side (height
// ROW_HEIGHT_STAT_LABEL) and matches a blank spacer of the same height on
// the cells side.
//
// SafePill alignment with cells: both halves of the data row are
// height-equal and use alignItems: center, so the SafePill (whatever its
// natural rendered height) centres in the row, AND the cells centre in
// their row. Both at the same y-coordinate. No more compensation math.

import type { ReactElement } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import type { Leg, TeamMatrixFixture, TeamMatrixStat } from '@count/types';
import { Kit, SafePill, ScorePill } from '@count/ui';
import { colors, typography } from '@count/tokens';
import { TEAMS } from '../../mock/teams';
import { deriveThresholdForWindow } from '../../mock/fixture-details';
import { MatrixCell } from './MatrixCell';
import {
  CELL_GAP,
  CELL_WIDTH,
  ROW_HEIGHT_FIXTURE_HEADER,
  ROW_HEIGHT_STAT_DATA,
  ROW_HEIGHT_STAT_LABEL,
  STICKY_COL_WIDTH,
  type WindowSize,
} from './matrix-constants';

// ─── Date formatting ────────────────────────────────────────────────────────

const MONTH_NUM: Record<string, string> = {
  Jan: '1',  Feb: '2',  Mar: '3',  Apr: '4',
  May: '5',  Jun: '6',  Jul: '7',  Aug: '8',
  Sep: '9',  Oct: '10', Nov: '11', Dec: '12',
};

function formatDateShort(date: string): string {
  const parts = date.split(' ');
  if (parts.length !== 2) return date;
  const [day, monthName] = parts;
  const monthNum = MONTH_NUM[monthName!];
  return monthNum ? `${day}/${monthNum}` : date;
}

// ─── Stat label row (sticky side: full label; cells side: blank spacer) ────

export function MatrixStatLabelSticky({ statName }: { statName: string }): ReactElement {
  return (
    <View style={statLabelStickyStyle}>
      <Text style={statNameStyle} numberOfLines={1}>
        {statName}
      </Text>
    </View>
  );
}

export function MatrixStatLabelGap(): ReactElement {
  return <View style={{ height: ROW_HEIGHT_STAT_LABEL }} />;
}

// ─── Stat data row halves ───────────────────────────────────────────────────

export interface MatrixStatStickyProps {
  statName: string;
  stat: TeamMatrixStat;
  windowSize: WindowSize;
  fixtureId: string;
  teamCode: string;
  teamName: string;
}

export function MatrixStatSticky({
  statName,
  stat,
  windowSize,
  fixtureId,
  teamCode,
  teamName,
}: MatrixStatStickyProps): ReactElement {
  const derived = deriveThresholdForWindow(stat.values, windowSize, stat.dir);

  const leg: Leg | undefined =
    derived.tier === 'muted'
      ? undefined
      : {
          id: `${fixtureId}::team::${teamCode}::${statName}::floor::w${windowSize}`,
          fixtureId,
          threshold: derived.threshold,
          hits: derived.hits,
          total: derived.total,
          tier: derived.tier,
          title: `${teamName} ${statName.toLowerCase()}`,
          reason: `Threshold ${derived.threshold} hit in every match across L${windowSize}`,
        };

  return (
    <View style={statStickyStyle}>
      <SafePill
        threshold={derived.threshold}
        hits={derived.hits}
        total={derived.total}
        tier={derived.tier}
        leg={leg}
        size="large"
      />
    </View>
  );
}

export interface MatrixStatCellsProps {
  statName: string;
  stat: TeamMatrixStat;
  windowSize: WindowSize;
  fixtureId: string;
  teamCode: string;
  teamName: string;
}

export function MatrixStatCells({
  statName,
  stat,
  windowSize,
  fixtureId,
  teamCode,
  teamName,
}: MatrixStatCellsProps): ReactElement {
  const values = stat.values.slice(0, windowSize);
  return (
    <View style={cellsRowStyle}>
      {values.map((value, idx) => (
        <MatrixCell
          key={idx}
          value={value}
          matchIndex={idx}
          rowValues={stat.values}
          windowSize={windowSize}
          fixtureId={fixtureId}
          teamCode={teamCode}
          teamName={teamName}
          statName={statName}
        />
      ))}
    </View>
  );
}

// ─── Fixture header row ─────────────────────────────────────────────────────

export function MatrixFixtureHeaderRow({
  fixtures,
}: {
  fixtures: TeamMatrixFixture[];
}): ReactElement {
  return (
    <View style={fixtureHeaderRowStyle}>
      {fixtures.map((f, idx) => {
        const oppTeam = TEAMS[f.opp];
        const venue = f.oppHome ? 'A' : 'H';
        return (
          <View key={idx} style={fixtureHeaderColStyle}>
            <Text style={dateRowStyle} numberOfLines={1}>
              {`${formatDateShort(f.date)} (${venue})`}
            </Text>
            <View style={kitCodeRowStyle}>
              {oppTeam ? <Kit variant="mini" team={oppTeam} /> : null}
              <Text style={oppCodeStyle} numberOfLines={1}>
                {f.opp}
              </Text>
            </View>
            <ScorePill result={f.result} wdl={f.wdl} />
          </View>
        );
      })}
    </View>
  );
}

// ─── Side head ──────────────────────────────────────────────────────────────

export interface MatrixSideHeadProps {
  teamCode: string;
  windowSize: WindowSize;
}

export function MatrixSideHead({ teamCode, windowSize }: MatrixSideHeadProps): ReactElement {
  const team = TEAMS[teamCode];
  const displayName = team?.name ?? teamCode;
  return (
    <View style={sideHeadStyle}>
      <View style={sideHeadLeftStyle}>
        {team ? <Kit variant="shirt" team={team} size={20} /> : null}
        <Text style={sideHeadNameStyle} numberOfLines={1}>
          {displayName}
        </Text>
      </View>
      <Text style={sideHeadCountStyle}>LAST {windowSize} OF 38</Text>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const STICKY_PAD_X = 8;

const statLabelStickyStyle: ViewStyle = {
  height: ROW_HEIGHT_STAT_LABEL,
  paddingHorizontal: STICKY_PAD_X,
  justifyContent: 'flex-end',
  paddingBottom: 4,
};

const statNameStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontSans,
  fontSize: 8,
  fontWeight: typography.weight.medium,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const statStickyStyle: ViewStyle = {
  width: STICKY_COL_WIDTH,
  height: ROW_HEIGHT_STAT_DATA,
  paddingHorizontal: STICKY_PAD_X,
  justifyContent: 'center',
  alignItems: 'flex-start',
};

const cellsRowStyle: ViewStyle = {
  height: ROW_HEIGHT_STAT_DATA,
  flexDirection: 'row',
  alignItems: 'center',
  gap: CELL_GAP,
};

const fixtureHeaderRowStyle: ViewStyle = {
  height: ROW_HEIGHT_FIXTURE_HEADER,
  flexDirection: 'row',
  alignItems: 'stretch',
  gap: CELL_GAP,
};

const fixtureHeaderColStyle: ViewStyle = {
  width: CELL_WIDTH,
  height: ROW_HEIGHT_FIXTURE_HEADER,
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingVertical: 2,
  gap: 4,
};

const dateRowStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 9,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.2,
};

const kitCodeRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
};

const oppCodeStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontMono,
  fontSize: 9,
  fontWeight: typography.weight.medium,
  letterSpacing: 0.2,
};

const sideHeadStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  marginBottom: 8,
};

const sideHeadLeftStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  flexShrink: 1,
};

const sideHeadNameStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 16,
  fontWeight: typography.weight.medium,
  flexShrink: 1,
};

const sideHeadCountStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 9,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
};

export { STICKY_COL_WIDTH };