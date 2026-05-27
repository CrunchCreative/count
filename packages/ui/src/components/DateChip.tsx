// DateChip — single segment inside the date strip. Ports `.date-seg` from
// docs/design-source/the-count-v2/project/styles.css (line 906).
//
// IMPORTANT: this component is NOT a standalone pill. It's a transparent
// segment that sits inside a bordered `.date-strip` container (rendered by
// FixturesList). The outer container provides the visible chrome; the
// segment changes only its background + text colour + glow when active.
//
// Active state (`.date-seg.active`, line 920): teal-tinted background, teal
// label, soft teal glow. The CSS layers an `inset` highlight + a 0.5px halo +
// `0 0 12px rgba(93,202,165,0.10)` outer glow; in RN we approximate the
// outer glow with iOS shadowColor / shadowRadius.
//
// Style passed as a single static merged object (gotcha #10 — Pressable can
// drop properties from style arrays containing inline objects).

import type { ReactElement } from 'react';
import { Platform, Pressable, Text, type ViewStyle } from 'react-native';
import { colors, typography } from '@count/tokens';

export interface DateChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function DateChip({ label, active, onPress }: DateChipProps): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      accessibilityLabel={label}
      style={active ? mergedActiveStyle : mergedInactiveStyle}
    >
      <Text style={active ? labelActiveStyle : labelInactiveStyle} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const baseStyle: ViewStyle = {
  flex: 1, // grid-auto-columns: 1fr — equal-width segments inside .date-strip
  paddingHorizontal: 10,
  paddingVertical: 9,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
};

// iOS-only outer teal glow when active. Approximates the CSS
// `box-shadow: 0 0 12px rgba(93,202,165,0.10)`.
const activeGlow: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: 'rgba(93,202,165,1)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
    },
    default: {},
  }) ?? {};

const mergedInactiveStyle: ViewStyle = {
  ...baseStyle,
  backgroundColor: 'transparent',
};

const mergedActiveStyle: ViewStyle = {
  ...baseStyle,
  backgroundColor: 'rgba(93,202,165,0.14)',
  borderWidth: 1,
  borderColor: 'rgba(93,202,165,0.40)',
  ...activeGlow,
};

const labelBaseStyle = {
  fontFamily: typography.fontSans,
  fontSize: 12.5,
  fontWeight: typography.weight.medium,
};

const labelInactiveStyle = {
  ...labelBaseStyle,
  color: colors.text.muted,
};

const labelActiveStyle = {
  ...labelBaseStyle,
  color: colors.teal.bright,
};