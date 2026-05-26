// Kit — multi-format team kit primitive (shirt | mini | square).
//
// Variants
//   shirt   — SVG football shirt, viewBox 100×110. Conventional sizes:
//             hero (32–34), standard (22–26 — default), compact (14–18).
//   mini    — Tiny 8×9 SVG square used inline in matrix opponent columns.
//             `size` is ignored — always 8×9.
//   square  — 22×22 rounded square with player number layered on top.
//             Used by the Player Matrix rows. `playerNumber` is required.
//
// The component reads its colourway directly from the `team` prop — consumer
// resolves the team from whatever data layer it owns (mock layer today, the
// real registry in a later phase). Keeps `@count/ui` decoupled from data.

import { useId } from 'react';
import type { ReactElement } from 'react';
import { Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  G,
  Path,
  Rect,
} from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '@count/tokens';
import type { Team } from '@count/types';

export type KitVariant = 'shirt' | 'mini' | 'square';

interface BaseKitProps {
  team: Team;
}

interface ShirtKitProps extends BaseKitProps {
  variant: 'shirt';
  /** Pixel width. Conventional sizes: hero 32–34, standard 22–26, compact 14–18. Defaults to 22. */
  size?: number;
  playerNumber?: never;
}

interface MiniKitProps extends BaseKitProps {
  variant: 'mini';
  /** Ignored for mini — always renders at 8×9. */
  size?: number;
  playerNumber?: never;
}

interface SquareKitProps extends BaseKitProps {
  variant: 'square';
  /** Pixel size (square). Defaults to 22. */
  size?: number;
  /** Required for square. */
  playerNumber: number;
}

export type KitProps = ShirtKitProps | MiniKitProps | SquareKitProps;

const PLACEHOLDER_DEFAULT_SIZE: Record<KitVariant, { width: number; height: number }> = {
  shirt: { width: 22, height: 24 },
  mini: { width: 8, height: 9 },
  square: { width: 22, height: 22 },
};

/** Light kits that need dark number text in the square variant. */
const LIGHT_KIT_PRIMARIES = new Set(['#FDB913', '#FFE667', '#FFFFFF']);

export function Kit(props: KitProps): ReactElement {
  const { team } = props;

  // Defensive — typed Team should always have a kit; if a future consumer
  // passes something malformed, render a transparent placeholder instead of crashing.
  if (!team?.kit) {
    const fallback = PLACEHOLDER_DEFAULT_SIZE[props.variant];
    return <View style={fallback} />;
  }

  if (props.variant === 'shirt') {
    return <ShirtKit team={team} size={props.size ?? 22} />;
  }
  if (props.variant === 'mini') {
    return <MiniKit team={team} />;
  }
  return (
    <SquareKit
      team={team}
      size={props.size ?? 22}
      playerNumber={props.playerNumber}
    />
  );
}

/* ──────────────────────────────────────────────── */

function ShirtKit({ team, size }: { team: Team; size: number }): ReactElement {
  const k = team.kit;
  const uid = useId();
  const clipId = `kit-clip-${uid}`;
  const W = size;
  const H = Math.round(size * 1.08);

  let bodyFill: string;
  let stripes: ReactElement | null = null;
  switch (k.pattern) {
    case 'solid':
      bodyFill = k.primary;
      break;
    case 'vertical_halves':
      bodyFill = 'transparent';
      stripes = (
        <G>
          <Rect x="22" y="14" width="29" height="86" fill={k.primary} />
          <Rect x="51" y="14" width="29" height="86" fill={k.secondary} />
        </G>
      );
      break;
    case 'vertical_stripes':
      bodyFill = k.secondary;
      stripes = (
        <G>
          <Rect x="26" y="14" width="9" height="86" fill={k.primary} />
          <Rect x="44" y="14" width="9" height="86" fill={k.primary} />
          <Rect x="62" y="14" width="9" height="86" fill={k.primary} />
        </G>
      );
      break;
    case 'horizontal_band':
      bodyFill = k.primary;
      break;
    default:
      bodyFill = k.primary;
  }

  // Sleeve logic ported from source kit.jsx:
  //   horizontal_band → secondary
  //   solid           → secondary (falls back to primary)
  //   halves/stripes  → primary
  const sleeveFill =
    k.pattern === 'horizontal_band'
      ? k.secondary
      : k.pattern === 'solid'
        ? k.secondary || k.primary
        : k.primary;

  const bodyPath =
    'M22 14 L40 8 Q50 14 60 8 L78 14 L78 100 Q78 104 74 104 L26 104 Q22 104 22 100 Z';

  return (
    <Svg width={W} height={H} viewBox="0 0 100 110">
      <Defs>
        <ClipPath id={clipId}>
          <Path d={bodyPath} />
        </ClipPath>
      </Defs>
      {/* Left sleeve */}
      <Path d="M22 14 L4 28 L0 50 L18 56 L22 30 Z" fill={sleeveFill} />
      {/* Right sleeve */}
      <Path d="M78 14 L96 28 L100 50 L82 56 L78 30 Z" fill={sleeveFill} />
      {/* Body base */}
      <Path d={bodyPath} fill={bodyFill} />
      {/* Stripe overlays clipped to body */}
      {stripes ? <G clipPath={`url(#${clipId})`}>{stripes}</G> : null}
      {/* Collar shadow notch */}
      <Path
        d="M40 8 Q50 14 60 8 L58 16 Q50 20 42 16 Z"
        fill="rgba(0,0,0,0.35)"
      />
      {/* Subtle inner highlight */}
      <Path
        d={bodyPath}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={1}
      />
    </Svg>
  );
}

/* ──────────────────────────────────────────────── */

function MiniKit({ team }: { team: Team }): ReactElement {
  const k = team.kit;
  let bg: string = k.primary;
  let inner: ReactElement | null = null;

  if (k.pattern === 'vertical_halves') {
    bg = 'transparent';
    inner = (
      <G>
        <Rect x="0" y="0" width="4" height="9" fill={k.primary} />
        <Rect x="4" y="0" width="4" height="9" fill={k.secondary} />
      </G>
    );
  } else if (k.pattern === 'vertical_stripes') {
    bg = k.secondary;
    inner = (
      <G>
        <Rect x="1.5" y="0" width="1.5" height="9" fill={k.primary} />
        <Rect x="5" y="0" width="1.5" height="9" fill={k.primary} />
      </G>
    );
  }

  return (
    <Svg width={8} height={9} viewBox="0 0 8 9">
      <Rect x="0" y="0" width="8" height="9" rx="1.5" fill={bg} />
      {inner}
    </Svg>
  );
}

/* ──────────────────────────────────────────────── */

function SquareKit({
  team,
  size,
  playerNumber,
}: {
  team: Team;
  size: number;
  playerNumber: number;
}): ReactElement {
  const k = team.kit;
  const textColor =
    k.pattern === 'solid' && LIGHT_KIT_PRIMARIES.has(k.primary)
      ? '#1A1408'
      : '#FFFFFF';

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // Inset highlight ring: hairline border at rgba(255,255,255,0.15)
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
  };

  // Background colour driven by pattern (NOT a gradient — gradient handled
  // by an absolute LinearGradient for the halves variant only).
  const flatBackground =
    k.pattern === 'vertical_stripes'
      ? k.secondary
      : k.pattern === 'vertical_halves'
        ? 'transparent'
        : k.primary;

  return (
    <View style={[containerStyle, { backgroundColor: flatBackground }]}>
      {k.pattern === 'vertical_halves' ? (
        <LinearGradient
          colors={[k.primary, k.primary, k.secondary, k.secondary]}
          // Two-stop pair gives a hard transition at 50% rather than a smooth fade.
          locations={[0, 0.5, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {k.pattern === 'vertical_stripes' ? (
        <>
          <View
            style={{
              position: 'absolute',
              left: 4,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: k.primary,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: 4,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: k.primary,
            }}
          />
        </>
      ) : null}
      <Text
        style={{
          color: textColor,
          fontFamily: typography.fontMono,
          fontSize: 11,
          // Phase 1C locked us to weights 400/500 only. Source kit.jsx has 600;
          // we override to 500 here.
          fontWeight: typography.weight.medium,
          // Mono numerals on Android can shift baseline — keep a stable line height.
          lineHeight: Platform.OS === 'android' ? 13 : undefined,
          includeFontPadding: false,
        }}
      >
        {playerNumber}
      </Text>
    </View>
  );
}
