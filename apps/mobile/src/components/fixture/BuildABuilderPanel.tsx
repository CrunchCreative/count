// BuildABuilderPanel — sparkles + heading + three risk buttons. The CTA
// surface at the foot of Overview. Phase 4A wires the buttons to an
// `onPick(risk)` callback that the parent passes as a no-op; Phase 5 routes
// the press to the The Count tab with the risk param.
//
// Source: docs/design-source/the-count-v2/project/screens/fixture.jsx lines
// 224–240 + styles.css lines 864–890 (.tc-btn).
//
// User-facing copy override: source body reads "AI will suggest…" — translated
// to "The Count will suggest…" per PROJECT-STATE decision 11 ("AI" never
// appears in user-facing copy).

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
import { GlassPanel, Icon } from '@count/ui';
import { colors, typography } from '@count/tokens';

export type BuilderRisk = 'Safe' | 'Balanced' | 'Higher risk';

export interface BuildABuilderPanelProps {
  onPick: (risk: BuilderRisk) => void;
}

export function BuildABuilderPanel({ onPick }: BuildABuilderPanelProps): ReactElement {
  return (
    <View style={outerWrapStyle}>
      <GlassPanel variant="elevated" style={panelInnerStyle}>
        <View style={topRowStyle}>
          <View style={topTextWrapStyle}>
            <Text style={titleStyle}>Build a builder for this fixture</Text>
            <Text style={bodyStyle}>
              The Count will suggest safe, balanced or higher-risk builders using the data on this page.
            </Text>
          </View>
          <Icon name="sparkles" size={18} color={colors.amber.bright} />
        </View>
        <View style={buttonRowStyle}>
          <BuilderButton label="Safe" tone="teal" onPress={() => onPick('Safe')} />
          <BuilderButton label="Balanced" tone="amber" onPress={() => onPick('Balanced')} />
          <BuilderButton label="Higher risk" tone="neutral" onPress={() => onPick('Higher risk')} />
        </View>
      </GlassPanel>
    </View>
  );
}

// ─── BuilderButton ──────────────────────────────────────────────────────────

type BuilderTone = 'teal' | 'amber' | 'neutral';

function BuilderButton({
  label,
  tone,
  onPress,
}: {
  label: string;
  tone: BuilderTone;
  onPress: () => void;
}): ReactElement {
  const containerStyle = builderButtonStyles[tone];
  const gradient = builderButtonGradients[tone];
  const textColor = builderButtonTextColors[tone];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Build ${label} builder`}
      style={containerStyle}
    >
      {({ pressed }) => (
        <View style={pressed ? builderButtonInnerPressedStyle : builderButtonInnerStyle}>
          {gradient ? (
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <Text style={{ ...builderButtonTextBaseStyle, color: textColor }}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const outerWrapStyle: ViewStyle = {
  marginTop: 14,
};

const panelInnerStyle: ViewStyle = {
  padding: 16,
};

const topRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
};

const topTextWrapStyle: ViewStyle = {
  flex: 1,
};

const titleStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 14,
  fontWeight: typography.weight.medium,
};

const bodyStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  marginTop: 4,
  lineHeight: 11 * 1.5,
};

const buttonRowStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 8,
  marginTop: 14,
};

// Pressable shell — flex:1 splits the row equally, borderWidth:1 + a
// strong-alpha border colour (gotcha #11) so each button reads on dark bg.
// Tone-specific border colour merges in below; overflow:hidden clips the
// inner gradient child to the rounded corners.
const builderButtonBaseStyle: ViewStyle = {
  flex: 1,
  borderRadius: 10,
  borderWidth: 1,
  overflow: 'hidden',
};

// Pre-merged Pressable styles per tone. Each is a single static object so
// RN's Pressable doesn't drop properties (gotcha #10).
const builderButtonStyles: Record<BuilderTone, ViewStyle> = {
  teal: {
    ...builderButtonBaseStyle,
    borderColor: 'rgba(93,202,165,0.30)',
  },
  amber: {
    ...builderButtonBaseStyle,
    borderColor: 'rgba(232,181,58,0.30)',
    // iOS amber glow — matches source `box-shadow: 0 0 12px rgba(232,181,58,0.10)`
    // (styles.css line 880). Android skips: greyscale elevation can't tint.
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: colors.amber.bright,
          shadowOpacity: 0.1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 0 },
        }
      : {}),
  },
  neutral: {
    ...builderButtonBaseStyle,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
};

// Gradients per tone — null for neutral, which uses backgroundColor instead.
const builderButtonGradients: Record<BuilderTone, readonly [string, string] | null> = {
  teal: ['rgba(93,202,165,0.08)', 'rgba(93,202,165,0.02)'],
  amber: ['rgba(232,181,58,0.10)', 'rgba(232,181,58,0.03)'],
  neutral: null,
};

const builderButtonTextColors: Record<BuilderTone, string> = {
  teal: colors.teal.bright,
  amber: colors.amber.bright,
  neutral: colors.text.secondary,
};

// Inner View — owns content placement: vertical padding, centring, and the
// position context for the absolutely-filled gradient child. Press feedback
// (opacity) lives here, not on the Pressable.
const builderButtonInnerStyle: ViewStyle = {
  paddingVertical: 11,
  paddingHorizontal: 0,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
};

const builderButtonInnerPressedStyle: ViewStyle = {
  ...builderButtonInnerStyle,
  opacity: 0.75,
};

const builderButtonTextBaseStyle = {
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
};
