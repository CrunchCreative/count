// Note Pad bar — the persistent strip above the bottom nav, visible on every
// tab. Tapping it opens the Note Pad sheet. Empty/populated states share the
// same chrome; the count line updates from `useNotePad`.
//
// Phase history (for future debugging):
// - 2A: pointerEvents="none", no hook.
// - 3:  inner glass View replaced with Pressable — broke BlurView rendering.
// - 3.5 v1: Pressable overlay sibling inside glass View — taps didn't reach
//   the overlay (hit-test interaction with `overflow: 'hidden'` + flex sibling
//   on iOS).
// - 3.5 v2: NotePadBar moved out of React Navigation's tabBar slot to a
//   sibling of <Tabs> in (tabs)/_layout.tsx — anchored against a measurable
//   flex:1 parent so position:'absolute' resolves predictably.
// - 3.5 v3 (current): height collapsed to <1px on device. Root cause: the
//   Pressable's style was an array containing the positioning object inline.
//   RN's Pressable can drop layout properties (height, position) at measure
//   time when receiving an inline object inside an array (array-form variant
//   of gotcha #1). Fix: the full positioning + shadow style is now a single
//   static object passed directly to the Pressable's `style` prop.
//
// Position offset (`insets.bottom + NAV_CONTENT_HEIGHT`) preserved from 2A
// (gotcha #6). z-index 85.

import type { ReactElement } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, typography } from '@count/tokens';
import { useNotePad } from '../context/NotePadContext';
import { Icon } from './Icon';

export const NOTE_PAD_BAR_Z_INDEX = 85;

const NAV_CONTENT_HEIGHT = 70;
const BAR_HEIGHT = 52;

export function NotePadBar(): ReactElement {
  const insets = useSafeAreaInsets();
  const { legs, open, isOpen } = useNotePad();
  const count = legs.length;
  const legWord = count === 1 ? 'leg' : 'legs';
  const populated = count > 0;

  // Single static positioning style — referenced by the Pressable without
  // being recreated each render. Avoids the Pressable-drops-layout-props
  // quirk we saw on device when this object was inline inside the style array.
  const positioningStyle: ViewStyle = {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: insets.bottom + NAV_CONTENT_HEIGHT,
    height: BAR_HEIGHT,
    borderRadius: radii.panel,
    zIndex: NOTE_PAD_BAR_Z_INDEX,
    ...shadowStyle,
  };

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={
        populated
          ? `Open Note Pad with ${count} ${legWord}`
          : 'Open empty Note Pad'
      }
      style={positioningStyle}
    >
      <View style={innerGlassStyle}>
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.015)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={highlightStyle} />
        <View style={rowStyle}>
          <View style={iconWellStyle}>
            {populated ? (
              <Text style={countBadgeStyle}>{count}</Text>
            ) : (
              <Icon name="layers" size={16} color={colors.text.muted} />
            )}
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
            <Text style={labelStyle}>NOTE PAD</Text>
            <Text style={countLineStyle(populated)}>
              {`${count} ${legWord}`}
            </Text>
          </View>
          <Icon
            name={isOpen ? 'chevron-down' : 'chevron-up'}
            size={16}
            color={populated ? colors.amber.bright : colors.text.muted}
          />
        </View>
      </View>
    </Pressable>
  );
}

const shadowStyle: ViewStyle =
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
    },
    default: {},
  }) ?? {};

const innerGlassStyle: ViewStyle = {
  flex: 1,
  borderRadius: radii.panel,
  overflow: 'hidden',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.default,
};

const highlightStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 1,
  backgroundColor: 'rgba(255,255,255,0.04)',
};

const rowStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 14,
  gap: 12,
};

const iconWellStyle: ViewStyle = {
  width: 32,
  height: 32,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.25)',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.default,
  alignItems: 'center',
  justifyContent: 'center',
};

const labelStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 11,
  fontWeight: typography.weight.medium,
  letterSpacing: 0.5,
  textTransform: 'uppercase' as const,
};

const countBadgeStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontMono,
  fontSize: 14,
  fontWeight: typography.weight.medium,
  lineHeight: 16,
};

function countLineStyle(populated: boolean) {
  return {
    color: populated ? colors.amber.bright : colors.text.muted,
    fontFamily: typography.fontSans,
    fontSize: 12.5,
    fontWeight: typography.weight.regular,
  };
}