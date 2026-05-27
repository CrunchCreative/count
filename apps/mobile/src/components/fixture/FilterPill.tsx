// FilterPill — visual sibling of GlassSelect on the Team-stats selector row.
// Renders the source-design filter shape (icon + label + count badge +
// chevron) but is non-functional in 4B: tapping does nothing. The filter
// dimensions and bottom-sheet UX are deferred — Phase brief 4B section
// "Out of scope" calls this out explicitly.
//
// Pressable pattern follows gotcha #10: a single static container style on
// the Pressable, layout + pressed-tone branches on the inner View via
// children-as-function. Mirrors the GlassSelect trigger metrics so the two
// pills sit at the same height in the selector row.

import type { ReactElement } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { Icon } from '@count/ui';
import { colors, typography } from '@count/tokens';

export interface FilterPillProps {
  /** Display-only count badge. No filter dimensions are wired in 4B. */
  count?: number;
}

export function FilterPill({ count }: FilterPillProps): ReactElement {
  return (
    <Pressable
      onPress={undefined}
      accessibilityRole="button"
      accessibilityLabel="Filters"
      accessibilityHint="Filter options will be available in a future update"
      style={containerStyle}
    >
      {({ pressed }) => (
        <View style={pressed ? innerPressedStyle : innerStyle}>
          <Icon name="filter" size={13} color={colors.text.muted} />
          <Text style={labelStyle}>Filters</Text>
          {typeof count === 'number' ? (
            <View style={countBadgeStyle}>
              <Text style={countBadgeTextStyle}>{count}</Text>
            </View>
          ) : null}
          <Icon name="chevron-down" size={13} color={colors.text.muted} />
        </View>
      )}
    </Pressable>
  );
}

const containerStyle: ViewStyle = {
  borderRadius: 10,
  overflow: 'hidden',
};

const innerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  paddingHorizontal: 12,
  paddingVertical: 9,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  backgroundColor: 'rgba(255,255,255,0.025)',
};

const innerPressedStyle: ViewStyle = {
  ...innerStyle,
  opacity: 0.85,
};

const labelStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
};

const countBadgeStyle: ViewStyle = {
  paddingHorizontal: 6,
  paddingVertical: 1,
  borderRadius: 999,
  backgroundColor: 'rgba(232,181,58,0.10)',
  borderWidth: 1,
  borderColor: 'rgba(232,181,58,0.25)',
};

const countBadgeTextStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.medium,
};
