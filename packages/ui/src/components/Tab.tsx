// Tab — single tab pressable used inside TabStrip. Active tab paints an
// amber-gradient underline anchored to the bottom of the strip; inactive
// tabs render label only in muted text. Active label colour is amber per
// the source design (styles.css line 394: `.tab.active { color: var(--amber-bright); }`).
//
// Layout: each Tab uses `flex: 1` so the parent TabStrip divides horizontal
// space equally across 4 tabs — matches the source's
// `grid-template-columns: repeat(4, 1fr)` (styles.css line 378).
//
// Gotcha #10: Pressable's `style` is a SINGLE static object (no array form).
// Press feedback comes from a children-as-function inner View that applies
// opacity on press.

import type { ReactElement } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
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
      style={tabStyle}
    >
      {({ pressed }) => (
        <View style={pressed ? innerPressedStyle : innerStyle}>
          <Text
            style={active ? labelActiveStyle : labelInactiveStyle}
            numberOfLines={1}
          >
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
        </View>
      )}
    </Pressable>
  );
}

// Pressable's own style — flex:1 makes 4 tabs split width equally inside
// TabStrip's flexDirection:'row'. Single static object: no array, so RN
// keeps every property.
const tabStyle: ViewStyle = {
  flex: 1,
};

// Inner View carries the actual padding + position context. Source padding
// (styles.css line 385): `padding: 12px 4px 14px` — asymmetric vertical
// padding gives the active underline room at the bottom edge.
const innerStyle: ViewStyle = {
  paddingTop: 12,
  paddingBottom: 14,
  paddingHorizontal: 4,
  position: 'relative',
  alignItems: 'center',
};

const innerPressedStyle: ViewStyle = {
  ...innerStyle,
  opacity: 0.7,
};

const labelBaseStyle = {
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
  textAlign: 'center' as const,
};

const labelInactiveStyle = {
  ...labelBaseStyle,
  color: colors.text.muted,
};

// Active label is amber-bright per styles.css line 394.
const labelActiveStyle = {
  ...labelBaseStyle,
  color: colors.amber.bright,
};

// Underline — 1.5px tall, inset 15% from each side, anchored to the inner
// View's bottom edge. Source `.tab.active::after` (styles.css line 395) has
// a box-shadow glow; RN shadow on LinearGradient is unreliable, so we skip
// the glow for this fix — the underline reads clearly without it.
const underlineStyle: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  left: '15%',
  right: '15%',
  height: 1.5,
};
