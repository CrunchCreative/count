// PickupCard — Dashboard "Pick up where you left off" tile. Compact tap row
// with mono meta, sans title, and a caption that can be either plain text or
// a styled inline node (e.g. amber +4.20 figure from the source).

import type { ReactElement, ReactNode } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { colors, typography } from '@count/tokens';
import { GlassPanel } from './GlassPanel';

export interface PickupCardProps {
  meta: string;
  title: string;
  /** Plain string or a pre-styled <Text> node. RN nested <Text> handles inline tinting. */
  sub: string | ReactNode;
  onPress?: () => void;
}

const containerStaticStyle: ViewStyle = { padding: 12, flex: 1 };

export function PickupCard({ meta, title, sub, onPress }: PickupCardProps): ReactElement {
  const body = (
    <GlassPanel variant="standard" style={containerStaticStyle}>
      <Text style={metaStyle} numberOfLines={1}>
        {meta}
      </Text>
      <Text style={titleStyle} numberOfLines={1}>
        {title}
      </Text>
      <View style={{ marginTop: 2 }}>
        {typeof sub === 'string' ? (
          <Text style={subStyle} numberOfLines={2}>
            {sub}
          </Text>
        ) : (
          sub
        )}
      </View>
    </GlassPanel>
  );

  if (!onPress) return body;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${meta}`}
      style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.7 }]}
    >
      {body}
    </Pressable>
  );
}

const metaStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 9,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const titleStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
  marginTop: 6,
  letterSpacing: -0.1,
};

const subStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
};
