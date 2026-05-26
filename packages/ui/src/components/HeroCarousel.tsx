// HeroCarousel — auto-advancing carousel of CarouselSlide objects atop the
// Dashboard. Ports `screens/dashboard.jsx <HeroCarousel>` plus the source
// `.glass.hero`, signal-badge override, and `.dots` row.

import { useEffect, useRef, useState, type ReactElement } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { colors, typography } from '@count/tokens';
import type { CarouselSlide } from '@count/types';
import { GlassPanel } from './GlassPanel';
import { HeroDecor } from './HeroDecor';
import { Icon } from './Icon';

export interface HeroCarouselProps {
  slides: CarouselSlide[];
  onPress?: (slide: CarouselSlide, index: number) => void;
}

const SLIDE_MS = 5000;
const FADE_MS = 400;

const dotStaticStyle: ViewStyle = {
  width: 16,
  height: 2,
  borderRadius: 1,
};

export function HeroCarousel({ slides, onPress }: HeroCarouselProps): ReactElement | null {
  const [index, setIndex] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const n = slides.length;

  // Epoch-keyed auto-advance: bumping epoch tears down and rebuilds the
  // interval, avoiding stale-closure bugs that come from mixing refs + effects.
  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [epoch, n]);

  const jumpTo = (i: number) => {
    setIndex(i);
    setEpoch((e) => e + 1);
  };

  // Fade-up animation triggered on every slide change.
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;
  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(8);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: FADE_MS,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: FADE_MS,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  const s = slides[index];
  if (!s) return null;
  const tier: 'teal' | 'amber' = s.kind === 'pattern-hit' ? 'teal' : 'amber';

  return (
    <View style={{ overflow: 'visible' }}>
      <Pressable
        onPress={onPress ? () => onPress(s, index) : undefined}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={`${s.label}: ${s.title}`}
      >
        <GlassPanel
          variant="hero"
          style={{ padding: 20, minHeight: 168, overflow: 'hidden' }}
        >
          <HeroDecor kind={s.kind} />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <InlineSignalBadge tier={tier} label={s.label} />
            <Text style={metaStyle}>{s.sub}</Text>
          </View>

          <Animated.View
            style={{
              opacity,
              transform: [{ translateY }],
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Text style={titleStyle}>{s.title}</Text>
            <Text style={bodyStyle}>{s.body}</Text>
            <View
              style={{
                marginTop: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Text style={ctaTextStyle}>{s.cta}</Text>
              <Icon name="arrow-right" size={14} color={colors.amber.bright} />
            </View>
          </Animated.View>
        </GlassPanel>
      </Pressable>

      {/* Dots — explicit container with height, alignItems centre, and
          opaque-ish inactive colour. If you don't see them, an ancestor is
          clipping or the colors token is misresolving. */}
      <View
        style={{
          height: 16,
          flexDirection: 'row',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 12,
        }}
      >
        {slides.map((_, i) => {
          const active = i === index;
          return (
            <Pressable
              key={i}
              onPress={() => jumpTo(i)}
              accessibilityRole="button"
              accessibilityLabel={`Go to slide ${i + 1} of ${n}`}
              hitSlop={10}
              style={({ pressed }) => [
                dotStaticStyle,
                {
                  backgroundColor: active
                    ? '#F2F0E8'
                    : 'rgba(255,255,255,0.35)',
                },
                pressed && { opacity: 0.7 },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

// Inline mini signal-badge — matches `signal-badge.{mid|high}` with the source's
// padding override (3 vert × 8 horiz, fontSize 9, letterSpacing 0.5). Lighter
// than the standalone <SignalBadge>, which uses fontSize 10 + padding 3/9.
function InlineSignalBadge({ tier, label }: { tier: 'teal' | 'amber'; label: string }) {
  const isTeal = tier === 'teal';
  const gradientBg = isTeal
    ? 'rgba(93,202,165,0.10)'
    : 'rgba(232,181,58,0.12)';
  const borderColor = isTeal
    ? 'rgba(93,202,165,0.25)'
    : 'rgba(232,181,58,0.30)';
  const textColor = isTeal ? colors.teal.bright : colors.amber.bright;

  return (
    <View
      style={{
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 999,
        backgroundColor: gradientBg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor,
      }}
    >
      <Text
        style={{
          color: textColor,
          fontFamily: typography.fontMono,
          fontSize: 9,
          fontWeight: typography.weight.medium,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          lineHeight: 11,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const metaStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const titleStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 19,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.3,
  lineHeight: 19 * 1.2,
};

const bodyStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 12,
  fontWeight: typography.weight.regular,
  marginTop: 8,
  lineHeight: 12 * 1.5,
  maxWidth: '70%' as const,
};

const ctaTextStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
};