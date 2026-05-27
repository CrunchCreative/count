// CompChip — pill-shaped chip at the head of the comp filter row. Ports
// `.comp-chip` (styles.css line 932). Used for the "All comps" reset
// affordance; rendered active when no league filter is set.
//
// Sized to match the GlassSelect trigger height beside it (matching vertical
// padding so the two sit on the same baseline).
//
// Active state (`.comp-chip.active`, line 951): amber-tinted gradient
// background + amber border + amber label + an outer amber glow (iOS shadow).
// The CSS source layers an `inset` highlight + a `0 0 0 0.5px` halo +
// `0 0 10px` outer glow; in RN we approximate with shadowColor / shadowRadius.
//
// Style passed as a single static merged object (gotcha #10).

import type { ReactElement } from 'react';
import { Platform, Pressable, Text, type ViewStyle } from 'react-native';
import { colors, typography } from '@count/tokens';

export interface CompChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function CompChip({ label, active, onPress }: CompChipProps): ReactElement {
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
  paddingHorizontal: 14,
  // Match GlassSelect trigger vertical sizing (paddingVertical: 9 + 1pt border).
  // The text size is the same, so equal padding → equal height baseline.
  paddingVertical: 9,
  borderRadius: 999,
  borderWidth: 1,
  alignSelf: 'flex-start',
  alignItems: 'center',
  justifyContent: 'center',
};

// iOS-only outer amber glow when active. Approximates the CSS
// `box-shadow: 0 0 10px rgba(232,181,58,0.10)` plus the 0.5px halo.
const activeGlow: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: 'rgba(232,181,58,1)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
    },
    default: {},
  }) ?? {};

const mergedInactiveStyle: ViewStyle = {
  ...baseStyle,
  backgroundColor: 'rgba(255,255,255,0.025)',
  borderColor: 'rgba(255,255,255,0.14)',
};

const mergedActiveStyle: ViewStyle = {
  ...baseStyle,
  backgroundColor: 'rgba(232,181,58,0.12)',
  borderColor: 'rgba(232,181,58,0.40)',
  ...activeGlow,
};

const labelBaseStyle = {
  fontFamily: typography.fontSans,
  fontSize: 12,
  fontWeight: typography.weight.medium,
};

const labelInactiveStyle = {
  ...labelBaseStyle,
  color: colors.text.muted,
};

const labelActiveStyle = {
  ...labelBaseStyle,
  color: colors.amber.bright,
};