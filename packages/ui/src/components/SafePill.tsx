import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, glows, typography } from '@count/tokens';
import { glowStyle, shouldRenderAndroidGlow, type GlowSpec } from '../utils/glow';
import { AndroidGlowUnderlay } from '../utils/AndroidGlowUnderlay';
import { Icon } from './Icon';

export type SafePillTier = 'teal' | 'amber' | 'muted';
export type SafePillSize = 'std' | 'mini';

export interface SafePillProps {
  threshold: string | number;
  hits: number;
  total?: number;
  tier?: SafePillTier;
  size?: SafePillSize;
  onPress?: () => void;
  addable?: boolean;
}

interface TierSpec {
  gradient: readonly [string, string] | null;
  flat: string | null;
  border: string;
  glow: GlowSpec | null;
  text: string;
}

const tierSpecs: Record<SafePillTier, TierSpec> = {
  teal: {
    gradient: ['rgba(93,202,165,0.12)', 'rgba(93,202,165,0.04)'],
    flat: null,
    border: 'rgba(93,202,165,0.25)',
    glow: glows.teal.pillSoft,
    text: colors.teal.bright,
  },
  amber: {
    gradient: ['rgba(232,181,58,0.10)', 'rgba(232,181,58,0.03)'],
    flat: null,
    border: 'rgba(232,181,58,0.20)',
    glow: glows.amber.pillSoft,
    text: colors.amber.bright,
  },
  muted: {
    gradient: null,
    flat: 'rgba(255,255,255,0.03)',
    border: colors.border.default,
    glow: null,
    text: colors.text.hint,
  },
};

function deriveTier(hits: number, total: number): SafePillTier {
  if (hits === total) return 'teal';
  if (hits >= total - 1) return 'amber';
  return 'muted';
}

export function SafePill({
  threshold,
  hits,
  total = 5,
  tier,
  size = 'std',
  onPress,
  addable,
}: SafePillProps) {
  const resolvedTier = tier ?? deriveTier(hits, total);
  const spec = tierSpecs[resolvedTier];
  const isMini = size === 'mini';

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isMini ? 2 : 4,
    paddingHorizontal: isMini ? 5 : 8,
    borderRadius: isMini ? 4 : 6,
    minWidth: isMini ? 28 : 36,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: spec.border,
    backgroundColor: spec.flat ?? 'transparent',
    overflow: 'hidden',
  };

  const outerStyle: ViewStyle = {
    borderRadius: isMini ? 4 : 6,
    ...(spec.glow ? glowStyle(spec.glow) : {}),
  };

  const content = (
    <View style={containerStyle}>
      {spec.gradient ? (
        <LinearGradient
          colors={spec.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            color: spec.text,
            fontFamily: typography.fontSans,
            fontSize: isMini ? 10 : 12,
            fontWeight: typography.weight.medium,
            lineHeight: isMini ? 12 : 14,
          }}
        >
          {String(threshold)}
        </Text>
        {!isMini ? (
          <Text
            style={{
              color: spec.text,
              fontFamily: typography.fontSans,
              fontSize: 9,
              fontWeight: typography.weight.regular,
              opacity: 0.85,
              marginTop: 2,
              lineHeight: 10,
            }}
          >
            {`${hits}/${total}`}
          </Text>
        ) : null}
      </View>
      {addable ? (
        <View style={{ marginLeft: 4, opacity: 0.6 }}>
          <Icon name="plus" size={8} color={spec.text} />
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [outerStyle, { opacity: pressed ? 0.7 : 1 }]}
      >
        {spec.glow && shouldRenderAndroidGlow ? (
          <AndroidGlowUnderlay glow={spec.glow} radius={isMini ? 4 : 6} />
        ) : null}
        {content}
      </Pressable>
    );
  }
  return (
    <View style={outerStyle}>
      {spec.glow && shouldRenderAndroidGlow ? (
        <AndroidGlowUnderlay glow={spec.glow} radius={isMini ? 4 : 6} />
      ) : null}
      {content}
    </View>
  );
}

