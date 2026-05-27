// AppHeader — persistent strip across the top of every tab screen.
// Logo on the left, optional `rightActions` slot, profile icon (always
// rightmost) routing to /profile.
//
// Mounted absolute at the top of the `(tabs)` layout — never appears on the
// fixture detail route (which lives outside `(tabs)`). Screen content scrolls
// beneath it, so each tab screen pads its scrollview by
// `insets.top + APP_HEADER_CONTENT_HEIGHT` to avoid being hidden underneath.
//
// Phase 3.6: background (BlurView + gradient + hairline border) is now a
// scroll-driven `Animated.View` overlay. At rest (scrollY = 0) the header is
// fully transparent, so the radial backdrop washes through; as the user
// scrolls (0 → 60px) the dark-glass surface fades in. The foreground row
// (logo + profile icon) stays fully opaque throughout.
//
// Phase 3.6 follow-up: gradient overlay reduced to a faint highlight (was
// near-opaque dark, now ~0.04 / 0.015 alpha) so the BlurView does the work
// and the surface reads as translucent rather than solid dark.
//
// Animation runs on the native driver (opacity-only) via the shared
// `useScrollY` Animated.Value, written by each tab screen's
// `Animated.ScrollView.onScroll`.

import type { ReactElement, ReactNode } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@count/tokens';
import { useScrollY } from '../context/ScrollContext';
import { IconButton } from './IconButton';

export const APP_HEADER_Z_INDEX = 100;

/** Content height above the safe-area inset. Tab screens add this + insets.top
 *  to their scrollview `paddingTop` so first content sits below the header.
 *  Phase 3.6 bumped 56 → 72 to match the +30% logo. */
export const APP_HEADER_CONTENT_HEIGHT = 72;

/** Scroll distance over which the header background fades in. */
const BG_FADE_RANGE = 60;

// Logo natural dimensions: 3508 × 1363, aspect ratio ≈ 2.574.
const LOGO_NATURAL_W = 3508;
const LOGO_NATURAL_H = 1363;
/** Phase 3.6: was 32, now 42 — +30%. */
const LOGO_HEIGHT = 60;
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
  const scrollY = useScrollY();

  // Background opacity ramps in 0 → 1 over the first BG_FADE_RANGE pixels of
  // scroll. `clamp` keeps the value pinned past the threshold.
  const bgOpacity = scrollY.interpolate({
    inputRange: [0, BG_FADE_RANGE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[
        wrapStyle,
        { paddingTop: insets.top + 8, paddingBottom: 8 },
      ]}
      pointerEvents="box-none"
    >
      {/* Background layer — BlurView + faint highlight gradient + hairline,
          fades in with scroll. Wrapped in an Animated.View so opacity affects
          the whole stack including the BlurView's rendered output (BlurView
          itself ignores `opacity` on its own style on iOS). pointerEvents=none
          so taps still pass through to the foreground row. */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { opacity: bgOpacity }]}
      >
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.015)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={bottomBorderStyle} />
      </Animated.View>

      {/* Foreground — always crisp regardless of scroll position. */}
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
  // Phase 3.6.1: nudged from -4 to -12 so the painted leftmost pixel of the
  // logo sits flush with screen-edge H1s (e.g. "Fixtures") sitting at the
  // standard 16px screen padding. The PNG has built-in transparent canvas
  // around the artwork that the nominal 16px wrap padding doesn't account
  // for.
  marginLeft: -18,
};

const pressedStyle: ViewStyle = { opacity: 0.8 };