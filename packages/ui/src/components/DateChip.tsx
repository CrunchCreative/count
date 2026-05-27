// DateChip — single day segment in the Fixtures-list date strip. Ports the
// source's `.date-seg`. Active state uses amber border + amber-tinted fill.

import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
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
  paddingVertical: 8,
  borderRadius: 8,
  borderWidth: StyleSheet.hairlineWidth,
};

const activeStyle: ViewStyle = {
  borderColor: 'rgba(232,181,58,0.35)',
  backgroundColor: 'rgba(232,181,58,0.08)',
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
