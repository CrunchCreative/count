import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, glass, glows, radii } from '@count/tokens';
import { glowStyle, shouldRenderAndroidGlow, type GlowSpec } from '../utils/glow';
import { AndroidGlowUnderlay } from '../utils/AndroidGlowUnderlay';
import { KeylineGlow, type KeylineTone } from './KeylineGlow';

export type GlassVariant = 'standard' | 'elevated' | 'hero';

export interface GlassPanelProps {
  variant?: GlassVariant;
  /** Render the top keyline gradient stripe. Defaults: standard → false, elevated → true, hero → true */
  keyline?: boolean;
  /** Keyline tone — defaults match the source. */
  keylineTone?: KeylineTone;
  className?: string;
  style?: ViewStyle;
  children?: ReactNode;
}

interface VariantSpec {
  border: string;
  highlight: string;
  glow: GlowSpec | null;
  defaultKeyline: boolean;
  defaultTone: KeylineTone;
  fillsHero: boolean;
}

const variants: Record<GlassVariant, VariantSpec> = {
  standard: {
    border: colors.border.default,
    highlight: 'rgba(255,255,255,0.05)',
    glow: null,
    defaultKeyline: false,
    defaultTone: 'neutral',
    fillsHero: false,
  },
  elevated: {
    border: 'rgba(232,181,58,0.12)',
    highlight: 'rgba(255,255,255,0.06)',
    glow: glows.amber.elev,
    defaultKeyline: true,
    defaultTone: 'amber',
    fillsHero: false,
  },
  hero: {
    border: 'rgba(93,202,165,0.10)',
    highlight: 'rgba(93,202,165,0.10)',
    glow: glows.teal.hero,
    defaultKeyline: true,
    defaultTone: 'teal',
    fillsHero: true,
  },
};

export function GlassPanel({
  variant = 'standard',
  keyline,
  keylineTone,
  className,
  style,
  children,
}: GlassPanelProps) {
  const spec = variants[variant];
  const tints = glass[variant];
  const renderKeyline = keyline ?? spec.defaultKeyline;
  const tone = keylineTone ?? spec.defaultTone;
  const radius = radii.panel;

  return (
    <View
      className={className}
      style={[
        { borderRadius: radius },
        spec.glow ? glowStyle(spec.glow) : null,
        style,
      ]}
    >
      {spec.glow && shouldRenderAndroidGlow ? (
        <AndroidGlowUnderlay glow={spec.glow} radius={radius} direction="vertical" />
      ) : null}

      <View
        style={{
          borderRadius: radius,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: spec.border,
          overflow: 'hidden',
          backgroundColor: spec.fillsHero ? colors.bg.hero : 'transparent',
        }}
      >
        <LinearGradient
          colors={[tints.top, tints.bottom]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: spec.highlight,
          }}
        />
        {children}
      </View>

      {renderKeyline ? <KeylineGlow tone={tone} /> : null}
    </View>
  );
}

