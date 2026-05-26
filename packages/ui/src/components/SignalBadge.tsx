import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, glows, typography } from '@count/tokens';
import { glowStyle, shouldRenderAndroidGlow, type GlowSpec } from '../utils/glow';
import { AndroidGlowUnderlay } from '../utils/AndroidGlowUnderlay';

export interface SignalBadgeProps {
  score: number;
}

type SignalTier = 'high' | 'mid' | 'low';

interface TierSpec {
  gradient: readonly [string, string] | null;
  flat: string | null;
  border: string;
  glow: GlowSpec | null;
  text: string;
}

const tierSpecs: Record<SignalTier, TierSpec> = {
  high: {
    gradient: ['rgba(232,181,58,0.18)', 'rgba(232,181,58,0.06)'],
    flat: null,
    border: 'rgba(232,181,58,0.30)',
    glow: glows.amber.pillSoft,
    text: colors.amber.bright,
  },
  mid: {
    gradient: ['rgba(93,202,165,0.14)', 'rgba(93,202,165,0.04)'],
    flat: null,
    border: 'rgba(93,202,165,0.25)',
    glow: glows.teal.pillSoft,
    text: colors.teal.bright,
  },
  low: {
    gradient: null,
    flat: 'rgba(255,255,255,0.03)',
    border: colors.border.default,
    glow: null,
    text: colors.text.muted,
  },
};

export function deriveSignalTier(score: number): SignalTier {
  if (score >= 85) return 'high';
  if (score >= 65) return 'mid';
  return 'low';
}

export function SignalBadge({ score }: SignalBadgeProps) {
  const tier = deriveSignalTier(score);
  const spec = tierSpecs[tier];

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: spec.border,
    backgroundColor: spec.flat ?? 'transparent',
    overflow: 'hidden',
    gap: 4,
  };

  return (
    <View style={[{ borderRadius: 999 }, spec.glow ? glowStyle(spec.glow) : null]}>
      {spec.glow && shouldRenderAndroidGlow ? (
        <AndroidGlowUnderlay glow={spec.glow} />
      ) : null}
      <View style={containerStyle}>
        {spec.gradient ? (
          <LinearGradient
            colors={spec.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <Text style={textStyle(spec.text)}>SIGNAL</Text>
        <Text style={textStyle(spec.text)}>{score}</Text>
      </View>
    </View>
  );
}

function textStyle(color: string) {
  return {
    color,
    fontFamily: typography.fontMono,
    fontSize: 10,
    fontWeight: typography.weight.medium,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
    lineHeight: 12,
  };
}


