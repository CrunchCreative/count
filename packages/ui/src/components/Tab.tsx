// Tab — single tab pressable used inside TabStrip. Active tab paints a 3px
// amber-gradient underline; inactive tabs render label only in muted text.

import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '@count/tokens';

export interface TabProps {
  id: string;
  label: string;
  active: boolean;
  onPress: (id: string) => void;
}

export function Tab({ id, label, active, onPress }: TabProps): ReactElement {
  return (
    <Pressable
      onPress={() => onPress(id)}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={({ pressed }) => [tabStyle, pressed && pressedStyle]}
    >
      <Text style={[labelStyle, active && labelActiveStyle]} numberOfLines={1}>
        {label}
      </Text>
      {active ? (
        <LinearGradient
          colors={[
            'rgba(232,181,58,0)',
            'rgba(232,181,58,0.7)',
            'rgba(232,181,58,0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={underlineStyle}
        />
      ) : null}
    </Pressable>
  );
}

const tabStyle: ViewStyle = {
  paddingVertical: 12,
  marginRight: 20,
  position: 'relative',
};

const pressedStyle: ViewStyle = { opacity: 0.7 };

const labelStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
};

const labelActiveStyle = {
  color: colors.text.primary,
};

const underlineStyle: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 3,
};
