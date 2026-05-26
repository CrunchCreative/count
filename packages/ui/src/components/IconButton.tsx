// IconButton — small 32×32 glass tap target used in the Dashboard branding
// header (search / bell) and other header rows. Ports the source's `.icon-btn`.

import type { ReactElement } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@count/tokens';
import { Icon, type IconName } from './Icon';

export interface IconButtonProps {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel?: string;
}

const containerStyle: ViewStyle = {
  width: 32,
  height: 32,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.02)',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.default,
};

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
}: IconButtonProps): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? icon}
      hitSlop={6}
      style={({ pressed }) => [containerStyle, pressed && { opacity: 0.7 }]}
    >
      <Icon name={icon} size={15} color={colors.text.muted} />
    </Pressable>
  );
}
