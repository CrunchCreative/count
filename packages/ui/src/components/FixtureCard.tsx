// FixtureCard — fixed-width 140px tap card used in the Dashboard's Today's-row
// horizontal scroll. Ports the source's `.fix-card` plus the `tap-row` press
// affordance. Featured fixtures (primary: true) render in the elev glass variant.

import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, typography } from '@count/tokens';
import type { FixtureSummary } from '@count/types';
import { GlassPanel } from './GlassPanel';
import { SignalMini } from './SignalMini';

export interface FixtureCardProps {
  fixture: FixtureSummary;
  onPress?: () => void;
  /** Composed by the caller from the resolved team names + kickoff + signal. */
  accessibilityLabel?: string;
}

const CARD_WIDTH = 140;

const innerStyle: ViewStyle = {
  paddingHorizontal: 12,
  paddingTop: 12,
  paddingBottom: 11,
};

export function FixtureCard({
  fixture,
  onPress,
  accessibilityLabel,
}: FixtureCardProps): ReactElement {
  const variant = fixture.primary ? 'elevated' : 'standard';

  const content = (
    <GlassPanel variant={variant} style={{ width: CARD_WIDTH, borderRadius: 12 }}>
      <View style={innerStyle}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={kickoffStyle}>{fixture.kickoff}</Text>
          <SignalMini score={fixture.signal} />
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={teamStyle}>{fixture.home}</Text>
          <Text style={vsStyle}>vs</Text>
          <Text style={teamStyle}>{fixture.away}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 14,
          }}
        >
          <View>
            <Text style={refLabelStyle}>
              REF · {(fixture.ref ?? '').toUpperCase()}
            </Text>
            <Text style={refValueStyle}>{fixture.refCpm ?? ''}</Text>
          </View>
          <Text style={cpmLabelStyle}>cards/m</Text>
        </View>
      </View>
    </GlassPanel>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      {content}
    </Pressable>
  );
}

const kickoffStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontMono,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
};

const teamStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 22,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.4,
  lineHeight: 22 * 1.1,
  textAlign: 'center' as const,
};

const vsStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  marginVertical: 4,
  textAlign: 'center' as const,
};

const refLabelStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 9,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.3,
};

const refValueStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontMono,
  fontSize: 14,
  fontWeight: typography.weight.medium,
  marginTop: 2,
};

const cpmLabelStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 9,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.3,
  alignSelf: 'flex-end' as const,
};
