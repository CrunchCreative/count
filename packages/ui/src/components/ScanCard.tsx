// ScanCard — Dashboard "Scan across fixtures" tile. Row layout: leading icon,
// title + sub stack, trailing chevron-right.

import type { ReactElement } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { colors, typography } from '@count/tokens';
import { GlassPanel } from './GlassPanel';
import { Icon, type IconName } from './Icon';

export interface ScanCardProps {
  icon: IconName;
  title: string;
  sub: string;
  onPress?: () => void;
}

const containerStaticStyle: ViewStyle = {
  padding: 12,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
};

// Outer Pressable always renders with flex:1 so cards size correctly in
// the parent row grid. Previously the no-onPress path returned the GlassPanel
// directly, which collapsed to content width and dropped the trailing chevron
// out of the visible area.
const outerStaticStyle: ViewStyle = { flex: 1 };

export function ScanCard({ icon, title, sub, onPress }: ScanCardProps): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${title}. ${sub}`}
      disabled={!onPress}
      style={({ pressed }) => [outerStaticStyle, pressed && { opacity: 0.7 }]}
    >
      <GlassPanel variant="standard" style={containerStaticStyle}>
        <Icon name={icon} size={16} color={colors.text.muted} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={titleStyle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={subStyle} numberOfLines={1}>
            {sub}
          </Text>
        </View>
        <Icon name="chevron-right" size={14} color={colors.text.muted} />
      </GlassPanel>
    </Pressable>
  );
}

const titleStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
};

const subStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  marginTop: 1,
};