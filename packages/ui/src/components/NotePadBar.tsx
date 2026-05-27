// Note Pad bar — the persistent strip above the bottom nav, visible on every
// tab. Tapping it opens the Note Pad sheet. Empty/populated states share the
// same chrome; the count line updates from `useNotePad`.
//
// Phase 2A shipped this with `pointerEvents="none"` and no hook — Phase 3
// makes it interactive. Position offset (`insets.bottom + NAV_CONTENT_HEIGHT`)
// preserved from 2A (gotcha #6).

import type { ReactElement } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, typography } from '@count/tokens';
import { useNotePad } from '../context/NotePadContext';
import { Icon } from './Icon';

export const NOTE_PAD_BAR_Z_INDEX = 85;

/** Approximate height of the bottom nav content above the bottom safe-area inset. */
const NAV_CONTENT_HEIGHT = 70;

export function NotePadBar(): ReactElement {
  const insets = useSafeAreaInsets();
  const { legs, open, isOpen } = useNotePad();
  const count = legs.length;
  const legWord = count === 1 ? 'leg' : 'legs';
  const populated = count > 0;

  const shadowStyle = Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
    },
    default: {},
  });

  return (
    <View
      style={[
        {
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: insets.bottom + NAV_CONTENT_HEIGHT,
          height: 52,
          borderRadius: radii.panel,
          zIndex: NOTE_PAD_BAR_Z_INDEX,
        },
        shadowStyle,
      ]}
    >
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={populated ? `Open Note Pad with ${count} ${legWord}` : 'Open empty Note Pad'}
        style={({ pressed }) => [barInnerStyle, pressed && pressedStyle]}
      >
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.015)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Inset highlight bar — matches the GlassPanel recipe */}
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
      </Pressable>
    </View>
  );
}

const barInnerStyle: ViewStyle = {
  flex: 1,
  borderRadius: radii.panel,
  overflow: 'hidden',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.default,
};

const pressedStyle: ViewStyle = { opacity: 0.85 };

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
