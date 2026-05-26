import { Platform, type ViewStyle } from 'react-native';

export interface GlowSpec {
  color: string;      // hex
  radius: number;     // px
  opacity: number;    // 0–1
}

/**
 * Produce platform-appropriate outer-glow styling.
 *
 * iOS — uses native shadowColor / shadowOpacity / shadowRadius.
 * Android — returns props for an underlay LinearGradient sibling because Android's
 *           elevation API can't tint shadows. Caller renders the underlay manually
 *           (see <AndroidGlowUnderlay />).
 */
export function glowStyle(glow: GlowSpec): ViewStyle {
  return (
    Platform.select<ViewStyle>({
      ios: {
        shadowColor: glow.color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: glow.opacity,
        shadowRadius: glow.radius,
      },
      android: {
        // shadow handled by sibling underlay rendered by caller
      },
      default: {},
    }) ?? {}
  );
}

/** True when caller should render the Android underlay LinearGradient. */
export const shouldRenderAndroidGlow = Platform.OS === 'android';
