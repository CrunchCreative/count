// NotePadLegRow — single leg as it appears in the Note Pad sheet.
// Pure display Safe pill on the left, title + optional reason in the middle,
// remove button on the right.

import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, typography } from '@count/tokens';
import type { Leg } from '@count/types';
import { Icon } from './Icon';
import { SafePill } from './SafePill';

export interface NotePadLegRowProps {
  leg: Leg;
  onRemove: (id: string) => void;
}

export function NotePadLegRow({ leg, onRemove }: NotePadLegRowProps): ReactElement {
  return (
    <View style={rowStyle}>
      <SafePill
        threshold={leg.threshold}
        hits={leg.hits}
        total={leg.total}
        tier={leg.tier}
        size="small"
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={titleStyle} numberOfLines={2}>
          {leg.title}
        </Text>
        {leg.reason ? (
          <Text style={reasonStyle} numberOfLines={2}>
            {leg.reason}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={() => onRemove(leg.id)}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${leg.title}`}
        hitSlop={8}
        style={({ pressed }) => [removeBtnStyle, pressed && pressedStyle]}
      >
        <Icon name="x" size={14} color={colors.text.muted} />
      </Pressable>
    </View>
  );
}

const rowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  paddingVertical: 10,
  paddingHorizontal: 12,
  backgroundColor: 'rgba(0,0,0,0.22)',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.faintest,
  borderRadius: 10,
};

const removeBtnStyle: ViewStyle = {
  width: 28,
  height: 28,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.03)',
};

const pressedStyle: ViewStyle = { opacity: 0.6 };

const titleStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
};

const reasonStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  marginTop: 2,
};
