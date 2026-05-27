// AppHeader — persistent strip across the top of every tab screen.
// Logo on the left, optional `rightActions` slot, profile icon (always
// rightmost) routing to /profile.
//
// Mounted absolute at the top of the `(tabs)` layout — never appears on the
// fixture detail route (which lives outside `(tabs)`). Screen content scrolls
// beneath it, so each tab screen pads its scrollview by
// `insets.top + APP_HEADER_CONTENT_HEIGHT` to avoid being hidden underneath.
//
// Visual recipe matches `NotePadBar` + `BottomNav` — BlurView (intensity 40 on
// iOS, fall-through on Android per gotcha #3), faint vertical gradient,
// hairline bottom border, no top border (the edge meets the device top).

import type { ReactElement, ReactNode } from 'react';
import { Image, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@count/tokens';
import { IconButton } from './IconButton';

export const APP_HEADER_Z_INDEX = 100;

/** Content height above the safe-area inset. Tab screens add this + insets.top
 *  to their scrollview `paddingTop` so first content sits below the header. */
export const APP_HEADER_CONTENT_HEIGHT = 56;

// Logo natural dimensions: 3508 × 1363, aspect ratio ≈ 2.574.
const LOGO_NATURAL_W = 3508;
const LOGO_NATURAL_H = 1363;
const LOGO_HEIGHT = 32;
const LOGO_WIDTH = LOGO_HEIGHT * (LOGO_NATURAL_W / LOGO_NATURAL_H);

export interface AppHeaderProps {
  /** Logo asset source. Passed in by the app (this lives in ui/, can't `require` from apps/mobile/). */
  logo: number | { uri: string };
  /** Tap handler for the profile icon. Consumer wires routing (`@count/ui` is
   *  intentionally decoupled from `expo-router`). */
  onPressProfile: () => void;
  /** Optional right-side action injection — sits between logo and profile icon. */
  rightActions?: ReactNode;
  /** Optional logo tap handler. */
  onPressLogo?: () => void;
}

export function AppHeader({
  logo,
  onPressProfile,
  onPressLogo,
  rightActions,
}: AppHeaderProps): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        wrapStyle,
        { paddingTop: insets.top + 8, paddingBottom: 8 },
      ]}
    >
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(8,9,11,0.92)', 'rgba(8,9,11,0.78)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={bottomBorderStyle} />
      <View style={rowStyle}>
        <Pressable
          accessibilityRole={onPressLogo ? 'button' : 'image'}
          accessibilityLabel="The Count"
          onPress={onPressLogo}
          hitSlop={8}
          style={({ pressed }) => [pressed && pressedStyle]}
        >
          <Image
            source={logo}
            style={logoStyle}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </Pressable>
        <View style={rightStyle}>
          {rightActions}
          <IconButton
            icon="profile"
            accessibilityLabel="Profile"
            onPress={onPressProfile}
          />
        </View>
      </View>
    </View>
  );
}

const wrapStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: APP_HEADER_Z_INDEX,
  paddingHorizontal: 16,
};

const bottomBorderStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: StyleSheet.hairlineWidth,
  backgroundColor: colors.border.default,
};

const rowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: APP_HEADER_CONTENT_HEIGHT - 16, // wraps inside the 8+8 vertical padding
};

const rightStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
};

const logoStyle = {
  height: LOGO_HEIGHT,
  width: LOGO_WIDTH,
  marginLeft: -4,
};

const pressedStyle: ViewStyle = { opacity: 0.8 };
