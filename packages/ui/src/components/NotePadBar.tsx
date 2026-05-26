// Note Pad bar — visual-only chrome in Phase 2A.
// In a later phase (likely Phase 5), this becomes the surface for the Note Pad subsystem:
//   - useNotePad() hook backed by a store
//   - empty / populated visual states (populated styling exists in styles.css under .slip-bar.populated — reserved for that phase)
//   - tap to open the Note Pad sheet (slide-up modal, see .slip-sheet / .slip-backdrop in source)
//   - "Save to Builders" promotes the Note Pad into a saved Builder
// Until then, this component always renders the empty state and ignores any interaction.

import type { ReactElement } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, typography } from '@count/tokens';
import { Icon } from './Icon';

export const NOTE_PAD_BAR_Z_INDEX = 85;

/** Approximate height of the bottom nav content above the bottom safe-area inset.
 *  Icon (22) + label (~14) + vertical gaps + top padding + breathing margin.
 *  The nav's bottom inset (insets.bottom + 8) is applied separately so the Note
 *  Pad bar's bottom edge lands just above the nav's top edge on every device.
 */
const NAV_CONTENT_HEIGHT = 70;

export function NotePadBar(): ReactElement {
  const insets = useSafeAreaInsets();

  const shadowStyle = Platform.select({
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
      pointerEvents="none"
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
      <View
        style={{
          flex: 1,
          borderRadius: radii.panel,
          overflow: 'hidden',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border.default,
        }}
      >
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.015)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Inset highlight bar — matches the GlassPanel recipe */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            gap: 12,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: 'rgba(0,0,0,0.25)',
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border.default,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="layers" size={16} color={colors.text.muted} />
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
            <Text
              style={{
                color: colors.text.hint,
                fontFamily: typography.fontMono,
                fontSize: 11,
                fontWeight: typography.weight.medium,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              NOTE PAD
            </Text>
            <Text
              style={{
                color: colors.text.muted,
                fontFamily: typography.fontSans,
                fontSize: 12.5,
                fontWeight: typography.weight.regular,
              }}
            >
              No legs added yet
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
