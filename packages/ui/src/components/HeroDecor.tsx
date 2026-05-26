// HeroDecor — right-side decorative chart inside the hero carousel.
// Two layers: concentric ring backdrop (SVG) and ten vertical gradient bars.
// Ports the source dashboard.jsx <HeroDecor>.

import type { ReactElement } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@count/tokens';
import type { CarouselKind } from '@count/types';

export interface HeroDecorProps {
  kind: CarouselKind;
}

const HEIGHTS: Record<CarouselKind, readonly number[]> = {
  'pattern-hit': [12, 16, 20, 18, 24, 28, 36, 44, 52, 60],
  engine:        [22, 32, 28, 38, 30, 42, 26, 48, 34, 56],
  depth:         [40, 38, 42, 36, 44, 40, 46, 42, 48, 44],
};

const GLOW_ALPHA: Record<CarouselKind, string> = {
  'pattern-hit': 'rgba(93,202,165,0.40)',
  engine:        'rgba(232,181,58,0.30)',
  depth:         'rgba(232,181,58,0.30)',
};

function tintFor(kind: CarouselKind): string {
  return kind === 'pattern-hit' ? colors.teal.bright : colors.amber.bright;
}

export function HeroDecor({ kind }: HeroDecorProps): ReactElement {
  const heights = HEIGHTS[kind];
  const tint = tintFor(kind);
  const glow = GLOW_ALPHA[kind];

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        right: 14,
        top: 14,
        bottom: 14,
        width: 130,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        gap: 4,
        opacity: 0.7,
      }}
    >
      <Svg
        width={130}
        height={130}
        style={{ position: 'absolute', right: -10, top: -10, opacity: 0.25 }}
      >
        <Circle cx={100} cy={100} r={40} stroke={tint} strokeWidth={0.5} fill="none" />
        <Circle cx={100} cy={100} r={60} stroke={tint} strokeWidth={0.5} fill="none" />
        <Circle cx={100} cy={100} r={80} stroke={tint} strokeWidth={0.5} fill="none" />
      </Svg>

      {heights.map((h, i) => (
        <View
          key={i}
          style={[
            {
              width: 6,
              height: h,
              borderRadius: 1,
              opacity: 0.55 + (i / heights.length) * 0.45,
              overflow: 'hidden',
            },
            Platform.OS === 'ios'
              ? {
                  shadowColor: glow,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 6,
                }
              : null,
          ]}
        >
          <LinearGradient
            colors={[tint, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      ))}
    </View>
  );
}
