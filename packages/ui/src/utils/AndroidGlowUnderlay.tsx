import type { ReactElement } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import type { GlowSpec } from './glow';

interface AndroidGlowUnderlayProps {
  glow: GlowSpec;
  /** Border radius of the parent element. Defaults to 999 (pill). */
  radius?: number;
  /** Direction of the synthetic glow gradient. Defaults to a diagonal corner wash. */
  direction?: 'corner' | 'vertical';
}

/**
 * Android-only halo: a tinted LinearGradient absolutely positioned around the parent.
 * Render alongside the iOS shadow style produced by glowStyle. The caller wraps both
 * inside a guard on shouldRenderAndroidGlow so iOS gets the native shadow only.
 */
export function AndroidGlowUnderlay({
  glow,
  radius = 999,
  direction = 'corner',
}: AndroidGlowUnderlayProps): ReactElement {
  const start = direction === 'corner' ? { x: 0.5, y: 0.5 } : { x: 0.5, y: 0 };
  const end = direction === 'corner' ? { x: 1, y: 1 } : { x: 0.5, y: 1 };
  const spread = Math.max(glow.radius, 8);
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[`${glow.color}33`, `${glow.color}00`]}
      start={start}
      end={end}
      style={{
        position: 'absolute',
        top: -spread,
        left: -spread,
        right: -spread,
        bottom: -spread,
        opacity: glow.opacity,
        borderRadius: radius + spread,
      }}
    />
  );
}
