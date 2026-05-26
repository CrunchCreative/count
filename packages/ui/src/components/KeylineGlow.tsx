import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type KeylineTone = 'amber' | 'teal' | 'neutral';

export interface KeylineGlowProps {
  tone: KeylineTone;
  /** Inset from sides as a fraction (0–0.5). Source uses 0.12 for elev, 0.15 for neutral. */
  inset?: number;
}

const palettes: Record<KeylineTone, readonly [string, string, string]> = {
  amber:   ['rgba(232,181,58,0)',  'rgba(232,181,58,0.30)',  'rgba(232,181,58,0)' ],
  teal:    ['rgba(93,202,165,0)',  'rgba(93,202,165,0.30)',  'rgba(93,202,165,0)' ],
  neutral: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0)'],
};

export function KeylineGlow({ tone, inset }: KeylineGlowProps): ReactElement {
  const fraction = inset ?? (tone === 'neutral' ? 0.15 : 0.12);
  const sideInsetPct = `${fraction * 100}%` as const;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: -0.5,
        left: sideInsetPct,
        right: sideInsetPct,
        height: 1,
      }}
    >
      <LinearGradient
        colors={[...palettes[tone]]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
