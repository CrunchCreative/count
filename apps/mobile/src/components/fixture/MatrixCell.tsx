// MatrixCell — the tappable cell inside the scrolling region of a
// team-matrix row.
//
// 4B.1 dimensions: each cell occupies a CELL_WIDTH × ROW_HEIGHT_STAT slot
// (44 × 48), with the visible 36×36 box centred inside it. The slot's job is
// to keep iteration spacing constant and the box's job is to read as a tap
// target — splitting them lets the box stay proportional to source design
// while the row height accommodates the SafePill in the sticky column.
//
// Visual model (ported and adapted from source PlayerValueCell):
//   - Zero cells: flat grey square, white 0.02 bg, white 0.10 border, no
//     shadow. Not tappable. Renders '0' in muted mono.
//   - Non-zero cells: amber gradient (0.18 → 0.08) under amber-bright text,
//     0.30 amber border, soft amber iOS shadow. Tappable.
//   - In-pad cells (already added to Note Pad): same amber gradient + text,
//     border switches to teal 0.60 and the iOS shadow tints teal — the
//     decision logged for visual feedback on cell-tap-adds.
//
// Tap semantics: tapping cell value N adds a leg pinned at (N-1)+ threshold.
// A bet at (N-1)+ would have won on a match that returned N. Hits at that
// threshold within the window come from rowValues so the leg's hits/total
// stay accurate without lookup-by-ref.
//
// Pressable pattern follows gotcha #10: single static container style on the
// Pressable, tone branches on the inner View via children-as-function.

import type { ReactElement } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Leg } from '@count/types';
import { useNotePad } from '@count/ui';
import { colors, typography } from '@count/tokens';
import {
  CELL_WIDTH,
  ROW_HEIGHT_STAT,
  type WindowSize,
} from './matrix-constants';

export interface MatrixCellProps {
  value: number;
  matchIndex: number;
  /** The full 38-fixture value array for this stat. Used to compute hits at
   *  the (value − 1) threshold within the current window. */
  rowValues: number[];
  windowSize: WindowSize;
  fixtureId: string;
  teamCode: string;
  teamName: string;
  statName: string;
}

// Internal box size — the visible cell visual. Centred inside the CELL_WIDTH
// × ROW_HEIGHT_STAT slot. Cell-internal dimension; deliberately not in
// matrix-constants.ts because it's about the cell's own paint, not the
// grid layout.
const CELL_BOX_SIZE = 36;

export function MatrixCell({
  value,
  matchIndex,
  rowValues,
  windowSize,
  fixtureId,
  teamCode,
  teamName,
  statName,
}: MatrixCellProps): ReactElement {
  // Hook must be called unconditionally; zero-cells just don't read inPad.
  const notePad = useNotePad();

  if (value === 0) {
    return (
      <View style={slotStyle}>
        <View style={zeroBoxStyle}>
          <Text style={zeroCellTextStyle}>0</Text>
        </View>
      </View>
    );
  }

  const legId = `${fixtureId}::team::${teamCode}::${statName}::cell-${matchIndex}::value-${value}`;
  const inPad = notePad.isInPad(legId);
  const threshold = value - 1;
  const hits = rowValues
    .slice(0, windowSize)
    .filter((v) => v >= threshold).length;
  const leg: Leg = {
    id: legId,
    fixtureId,
    threshold: `${threshold}+`,
    hits,
    total: windowSize,
    tier: hits === windowSize ? 'teal' : hits >= windowSize - 1 ? 'amber' : 'muted',
    title: `${teamName} ${statName.toLowerCase()} ${threshold}+`,
    reason: `Value ${value} from fixture ${matchIndex + 1} of ${windowSize} — bet at ${threshold}+ would win here`,
  };

  return (
    <Pressable
      onPress={() => notePad.toggleLeg(leg)}
      accessibilityRole="button"
      accessibilityLabel={`${statName} ${value} in fixture ${matchIndex + 1}, ${inPad ? 'remove' : 'add'} threshold ${threshold}+`}
      style={slotStyle}
    >
      {({ pressed }) => (
        <View style={inPad ? inPadShadowStyle : amberShadowStyle}>
          <View
            style={
              inPad
                ? inPadInnerStyle
                : pressed
                  ? amberPressedInnerStyle
                  : amberInnerStyle
            }
          >
            <LinearGradient
              colors={['rgba(232,181,58,0.18)', 'rgba(232,181,58,0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={amberCellTextStyle}>{value}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

// Slot — CELL_WIDTH × ROW_HEIGHT_STAT wrapper that owns the iteration
// spacing. The box centres inside.
const slotStyle: ViewStyle = {
  width: CELL_WIDTH,
  height: ROW_HEIGHT_STAT,
  alignItems: 'center',
  justifyContent: 'center',
};

const zeroBoxStyle: ViewStyle = {
  width: CELL_BOX_SIZE,
  height: CELL_BOX_SIZE,
  borderRadius: 4,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.02)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
};

const zeroCellTextStyle = {
  color: colors.text.faint,
  fontFamily: typography.fontMono,
  fontSize: 13,
  fontWeight: typography.weight.regular,
};

const amberShadowStyle: ViewStyle = {
  width: CELL_BOX_SIZE,
  height: CELL_BOX_SIZE,
  borderRadius: 4,
  ...Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.amber.bright,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    default: {},
  }),
};

const inPadShadowStyle: ViewStyle = {
  width: CELL_BOX_SIZE,
  height: CELL_BOX_SIZE,
  borderRadius: 4,
  ...Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.teal.bright,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 4,
    },
    default: {},
  }),
};

const amberInnerStyle: ViewStyle = {
  width: CELL_BOX_SIZE,
  height: CELL_BOX_SIZE,
  borderRadius: 4,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: 'rgba(232,181,58,0.30)',
};

const amberPressedInnerStyle: ViewStyle = {
  ...amberInnerStyle,
  opacity: 0.75,
};

const inPadInnerStyle: ViewStyle = {
  ...amberInnerStyle,
  borderColor: 'rgba(93,202,165,0.60)',
};

const amberCellTextStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontMono,
  fontSize: 13,
  fontWeight: typography.weight.medium,
};
