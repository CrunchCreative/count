// MatrixCard — the elevated glass card that holds both sides of the
// team-stats matrix plus the scroll-hint + show-all footer.
//
// Owns the cross-side scroll-sync state: a ScrollView ref per side and a
// matching mutable flag per side. When a side detects manual scroll it sets
// the sibling's flag and calls scrollTo on the sibling; the sibling's
// onScroll reads the flag, resets it, and returns without re-syncing — that
// breaks the loop a programmatic scrollTo would otherwise create.
//
// Footer: scroll hint (left, amber arrows + label) + show-all toggle (right).
// The toggle uses the standard Pressable pattern from gotcha #10 — a single
// static container style on the Pressable, tone branches on the inner View.

import { useRef, type ReactElement } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { FixtureMatrix } from '@count/types';
import { GlassPanel, Icon } from '@count/ui';
import { colors, typography } from '@count/tokens';
import { MatrixSide } from './MatrixSide';
import { ROW_GAP_SIDES, type WindowSize } from './matrix-constants';

export interface MatrixCardProps {
  matrix: FixtureMatrix;
  homeCode: string;
  awayCode: string;
  fixtureId: string;
  windowSize: WindowSize;
  showAll: boolean;
  onToggleShowAll: () => void;
}

export function MatrixCard({
  matrix,
  homeCode,
  awayCode,
  fixtureId,
  windowSize,
  showAll,
  onToggleShowAll,
}: MatrixCardProps): ReactElement {
  const homeScrollRef = useRef<ScrollView | null>(null);
  const awayScrollRef = useRef<ScrollView | null>(null);
  const homeFlag = useRef(false);
  const awayFlag = useRef(false);

  const scrollHintLabel =
    windowSize > 5
      ? `Scroll to see fixtures 6–${windowSize}`
      : 'Last 5 matches';

  return (
    <View style={{ marginTop: 16 }}>
      <GlassPanel variant="elevated" style={glassInnerStyle}>
        <MatrixSide
          teamCode={homeCode}
          data={matrix.home}
          windowSize={windowSize}
          showAll={showAll}
          fixtureId={fixtureId}
          scrollRef={homeScrollRef}
          syncRef={awayScrollRef}
          ownFlag={homeFlag}
          syncFlag={awayFlag}
        />
        <View style={sideSeparatorWrapperStyle}>
          <LinearGradient
            colors={[
              'rgba(232,181,58,0)',
              'rgba(232,181,58,0.7)',
              'rgba(232,181,58,0)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={sideSeparatorLineStyle}
          />
        </View>
        <MatrixSide
          teamCode={awayCode}
          data={matrix.away}
          windowSize={windowSize}
          showAll={showAll}
          fixtureId={fixtureId}
          scrollRef={awayScrollRef}
          syncRef={homeScrollRef}
          ownFlag={awayFlag}
          syncFlag={homeFlag}
        />

        <View style={footerStyle}>
          <View style={footerLeftStyle}>
            <Icon name="arrows-h" size={12} color={colors.amber.bright} />
            <Text style={scrollHintTextStyle}>{scrollHintLabel}</Text>
          </View>
          <Pressable
            onPress={onToggleShowAll}
            accessibilityRole="button"
            accessibilityLabel={showAll ? 'Show fewer stats' : 'Show all stats'}
            style={togglePressableStyle}
          >
            {({ pressed }) => (
              <View style={pressed ? toggleInnerPressedStyle : toggleInnerStyle}>
                <Text style={toggleTextStyle}>
                  {showAll ? 'Show less' : 'Show all stats'}
                </Text>
                <Icon
                  name={showAll ? 'chevron-up' : 'chevron-down'}
                  size={12}
                  color={colors.text.muted}
                />
              </View>
            )}
          </Pressable>
        </View>
      </GlassPanel>
    </View>
  );
}

const glassInnerStyle: ViewStyle = {
  padding: 14,
};

// 4B.2 — amber gradient separator line between the home + away sides. Same
// recipe as the active tab underline from Phase 4A.1: edge-fading horizontal
// gradient plus an iOS-only amber shadow glow on the wrapper. Android sees
// just the gradient line (RN shadow doesn't tint there).
const sideSeparatorWrapperStyle: ViewStyle = {
  height: ROW_GAP_SIDES,
  justifyContent: 'center',
  ...Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.amber.bright,
      shadowOpacity: 0.6,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 0 },
    },
    default: {},
  }),
};

const sideSeparatorLineStyle: ViewStyle = {
  height: 1.5,
  width: '100%',
};

const footerStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 14,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.14)',
};

const footerLeftStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  flexShrink: 1,
};

const scrollHintTextStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
};

const togglePressableStyle: ViewStyle = {
  borderRadius: 8,
  overflow: 'hidden',
};

const toggleInnerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  backgroundColor: 'rgba(255,255,255,0.02)',
};

const toggleInnerPressedStyle: ViewStyle = {
  ...toggleInnerStyle,
  opacity: 0.8,
};

const toggleTextStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.medium,
};
