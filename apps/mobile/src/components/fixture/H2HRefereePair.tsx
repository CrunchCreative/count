// H2HRefereePair — two equal-width glass panels side-by-side. Left panel:
// H2H tally with a small amber-gradient progress bar. Right panel: referee
// detail with an optional 'Cards above avg' inline pill.
//
// Source: docs/design-source/the-count-v2/project/screens/fixture.jsx lines
// 181–222.
//
// Layout note (gotcha #8): GlassPanel.style applies to the inner View; flex
// from a row parent must be carried by an outer wrapping <View>, not piped
// through GlassPanel's style prop.

import type { ReactElement } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassPanel } from '@count/ui';
import { colors, typography } from '@count/tokens';
import type { FixtureDetail } from '@count/types';

export interface H2HRefereePairProps {
  fixture: FixtureDetail;
}

export function H2HRefereePair({ fixture }: H2HRefereePairProps): ReactElement {
  const totalH2H = fixture.h2h.home + fixture.h2h.away;
  const homeShare = totalH2H > 0 ? fixture.h2h.home / totalH2H : 0.5;

  return (
    <View style={pairWrapStyle}>
      <View style={panelFlexStyle}>
        <GlassPanel variant="standard" style={panelInnerStyle}>
          <Text style={microStyle}>HEAD TO HEAD · LAST 5</Text>
          <View style={h2hRowStyle}>
            <View style={h2hBlockStyle}>
              <Text style={h2hHomeNumStyle}>{fixture.h2h.home}</Text>
              <Text style={h2hSideLabelStyle}>{fixture.home}</Text>
            </View>
            <View style={h2hBlockStyle}>
              <Text style={h2hSideLabelStyle}>{fixture.away}</Text>
              <Text style={h2hAwayNumStyle}>{fixture.h2h.away}</Text>
            </View>
          </View>
          <View style={h2hTrackStyle}>
            <View style={[h2hFillWrapStyle, { width: `${homeShare * 100}%` }]}>
              <LinearGradient
                colors={[colors.amber.deep, colors.amber.bright]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </View>
          </View>
          <Text style={h2hCaptionStyle}>
            Last meeting · {fixture.h2h.last}
          </Text>
        </GlassPanel>
      </View>

      <View style={panelFlexStyle}>
        <GlassPanel variant="standard" style={panelInnerStyle}>
          <Text style={microStyle}>REFEREE</Text>
          <Text style={refNameStyle} numberOfLines={1}>{fixture.refereeDetail.name}</Text>
          <Text style={refCaptionStyle}>
            {fixture.refereeDetail.cpm} cards/match · {fixture.refereeDetail.homeWinPct}% home win
          </Text>
          {fixture.refereeDetail.cardsAboveAvg ? (
            <View style={cardsAboveAvgRowStyle}>
              <View style={cardsAboveAvgPillStyle}>
                <Text style={cardsAboveAvgTextStyle}>Cards above avg</Text>
              </View>
            </View>
          ) : null}
        </GlassPanel>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const pairWrapStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 10,
  marginTop: 14,
};

const panelFlexStyle: ViewStyle = {
  flex: 1,
};

const panelInnerStyle: ViewStyle = {
  padding: 14,
};

const microStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const h2hRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginTop: 10,
};

const h2hBlockStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'baseline',
  gap: 6,
};

const h2hHomeNumStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontSans,
  fontSize: 24,
  fontWeight: typography.weight.medium,
};

const h2hAwayNumStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 24,
  fontWeight: typography.weight.medium,
};

const h2hSideLabelStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const h2hTrackStyle: ViewStyle = {
  height: 4,
  marginTop: 8,
  borderRadius: 2,
  backgroundColor: 'rgba(255,255,255,0.04)',
  position: 'relative',
  overflow: 'hidden',
};

// iOS-only amber halo under the H2H fill — source's
// `boxShadow: 0 0 8px rgba(232,181,58,0.35)`. Android keeps the gradient
// without the halo (per Phase 1C convention).
const h2hFillWrapStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  borderRadius: 2,
  overflow: 'hidden',
  ...(Platform.OS === 'ios'
    ? {
        shadowColor: colors.amber.bright,
        shadowOpacity: 0.35,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
      }
    : {}),
};

const h2hCaptionStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  marginTop: 8,
};

const refNameStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 14,
  fontWeight: typography.weight.medium,
  marginTop: 10,
};

const refCaptionStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  marginTop: 2,
};

const cardsAboveAvgRowStyle: ViewStyle = {
  marginTop: 10,
  flexDirection: 'row',
};

// One-off amber label pill — source-line 216 renders a SafePill `amber`
// variant in pure label-only mode. Extending the real SafePill primitive to
// support a label-only shape was rejected in the brief (would add a fourth
// conceptually different state to an already-balanced component).
const cardsAboveAvgPillStyle: ViewStyle = {
  paddingHorizontal: 9,
  paddingVertical: 4,
  borderRadius: 6,
  backgroundColor: 'rgba(232,181,58,0.10)',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: 'rgba(232,181,58,0.20)',
};

const cardsAboveAvgTextStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.medium,
};
