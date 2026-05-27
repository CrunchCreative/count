import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, glows, typography } from '@count/tokens';
import type { Leg } from '@count/types';
import { glowStyle, shouldRenderAndroidGlow, type GlowSpec } from '../utils/glow';
import { AndroidGlowUnderlay } from '../utils/AndroidGlowUnderlay';
import { useNotePad } from '../context/NotePadContext';
import { Icon } from './Icon';

export type SafePillTier = 'teal' | 'amber' | 'muted';
/** Visual size. 'small' is byte-identical to the pre-4B.1 default. 'large' is
 *  the matrix sticky-left variant — bigger paddings, mono numerics, and a
 *  stronger iOS tier-tinted shadow that bleeds outside the rounded corners.
 *  The old 'std' / 'mini' names are gone; 'mini' was unused and 'std' was
 *  renamed to 'small' wholesale. */
export type SafePillSize = 'small' | 'large';

export interface SafePillProps {
  threshold: string | number;
  hits: number;
  total?: number;
  tier?: SafePillTier;
  size?: SafePillSize;
  onPress?: () => void;
  /**
   * Visual-only `+` glyph affordance. No press behaviour. Existing Phase 2A/2B
   * callers (`ResearchCard`) rely on this. When `leg` is also passed, the
   * affordance becomes actionable; this flag still toggles the visible glyph.
   */
  addable?: boolean;
  /**
   * When present: wraps the pill in a Pressable that toggles the Leg in/out
   * of the Note Pad. Renders `+` when not in pad, `✓` when in pad. Subtle
   * background tint shifts when in pad. Existing `addable` callers continue
   * to work unchanged.
   */
  leg?: Leg;
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

// 4B.1 large-variant tier shadows — stronger than the default tier glow so
// the SafePill reads as the focal point of the matrix sticky column. iOS
// only; Android falls back to the existing AndroidGlowUnderlay sibling.
const largeIosShadow: Record<SafePillTier, ViewStyle> = {
  teal: {
    shadowColor: colors.teal.bright,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  amber: {
    shadowColor: colors.amber.bright,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  muted: {},
};

function deriveTier(hits: number, total: number): SafePillTier {
  if (hits === total) return 'teal';
  if (hits >= total - 1) return 'amber';
  return 'muted';
}

const inPadOverlayStyle: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(232,181,58,0.10)',
};

export function SafePill({
  threshold,
  hits,
  total = 5,
  tier,
  size = 'small',
  onPress,
  addable,
  leg,
}: SafePillProps) {
  const resolvedTier = tier ?? deriveTier(hits, total);
  const spec = tierSpecs[resolvedTier];
  const isLarge = size === 'large';

  // Note Pad binding — only call hook side-effects when `leg` is present,
  // but the hook itself is unconditional (hooks must be called in order).
  const notePad = useNotePad();
  const inPad = leg ? notePad.isInPad(leg.id) : false;
  // Render glyph when either prop opts in.
  const showGlyph = !!leg || !!addable;
  const glyphIcon = leg && inPad ? 'check' : 'plus';

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isLarge ? 5 : 4,
    paddingHorizontal: isLarge ? 10 : 8,
    borderRadius: 6,
    minWidth: isLarge ? 48 : 36,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: spec.border,
    backgroundColor: spec.flat ?? 'transparent',
    overflow: 'hidden',
  };

  // Outer paint surface — shadows must live here so they bleed outside the
  // border-radius. Pre-merge the platform-conditional shadow into a single
  // static object (gotcha #10 — Pressable can drop properties from arrays
  // containing inline-conditional ViewStyle pieces).
  const outerStyle: ViewStyle = {
    borderRadius: 6,
    ...(spec.glow ? glowStyle(spec.glow) : {}),
    ...(isLarge && Platform.OS === 'ios' ? largeIosShadow[resolvedTier] : {}),
  };

  const thresholdFontSize = isLarge ? 14 : 12;
  const hitsFontSize = isLarge ? 11 : 9;

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
      {inPad ? <View pointerEvents="none" style={inPadOverlayStyle} /> : null}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            color: spec.text,
            fontFamily: isLarge ? typography.fontMono : typography.fontSans,
            fontSize: thresholdFontSize,
            fontWeight: typography.weight.medium,
            lineHeight: thresholdFontSize + 3,
          }}
        >
          {String(threshold)}
        </Text>
        <Text
          style={{
            color: spec.text,
            fontFamily: isLarge ? typography.fontMono : typography.fontSans,
            fontSize: hitsFontSize,
            fontWeight: typography.weight.regular,
            opacity: 0.85,
            marginTop: 2,
            lineHeight: hitsFontSize + 2,
          }}
        >
          {`${hits}/${total}`}
        </Text>
      </View>
      {showGlyph ? (
        <View style={{ marginLeft: 4, opacity: inPad ? 1 : 0.6 }}>
          <Icon name={glyphIcon} size={isLarge ? 10 : 8} color={spec.text} />
        </View>
      ) : null}
    </View>
  );

  // `leg` prop binds press to toggleLeg. Falls back to caller-supplied onPress.
  const resolvedPress = leg ? () => notePad.toggleLeg(leg) : onPress;

  if (resolvedPress) {
    return (
      <Pressable
        onPress={resolvedPress}
        style={outerStyle}
      >
        {({ pressed }) => (
          <View style={pressed ? pressedWrapStyle : staticWrapStyle}>
            {spec.glow && shouldRenderAndroidGlow ? (
              <AndroidGlowUnderlay glow={spec.glow} radius={6} />
            ) : null}
            {content}
          </View>
        )}
      </Pressable>
    );
  }
  return (
    <View style={outerStyle}>
      {spec.glow && shouldRenderAndroidGlow ? (
        <AndroidGlowUnderlay glow={spec.glow} radius={6} />
      ) : null}
      {content}
    </View>
  );
}

const staticWrapStyle: ViewStyle = {
  borderRadius: 6,
};

const pressedWrapStyle: ViewStyle = {
  borderRadius: 6,
  opacity: 0.7,
};
