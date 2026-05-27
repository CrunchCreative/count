// CompChip — fixed-width "All comps" pill at the head of the Fixtures-list
// filter row. Ports `.comp-chip` from the source.

import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
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
      style={({ pressed }) => [
        baseStyle,
        active ? activeStyle : inactiveStyle,
        pressed && pressedStyle,
      ]}
    >
      <Text
        style={[labelStyle, active ? labelActiveStyle : labelInactiveStyle]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const baseStyle: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 9,
  borderRadius: 8,
  borderWidth: StyleSheet.hairlineWidth,
};

const activeStyle: ViewStyle = {
  borderColor: 'rgba(232,181,58,0.30)',
  backgroundColor: 'rgba(232,181,58,0.06)',
};

const inactiveStyle: ViewStyle = {
  borderColor: colors.border.default,
  backgroundColor: 'rgba(255,255,255,0.02)',
};

const pressedStyle: ViewStyle = { opacity: 0.7 };

const labelStyle = {
  fontFamily: typography.fontSans,
  fontSize: 12,
  fontWeight: typography.weight.medium,
};

const labelActiveStyle = {
  color: colors.amber.bright,
};

const labelInactiveStyle = {
  color: colors.text.muted,
};
