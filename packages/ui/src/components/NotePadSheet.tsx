// NotePadSheet — modal bottom sheet listing the current Note Pad legs.
// Mounted once at the root layout as an absolute-positioned sibling. Renders
// nothing when `isOpen === false` so its constant mounting is cheap.
//
// Hand-rolled (no react-native-gesture-handler dep). Three ways to close:
//   1. Tap the dimmed backdrop.
//   2. Tap the drag handle (decorative pill at the sheet top — extra-large
//      tap zone wraps it).
//   3. Drag the sheet down past ~100px or release with a downward fling
//      (vy > 0.5). The pan responder lives on the drag-handle zone so it
//      never fights the legs ScrollView for vertical gesture ownership.
//
// z-index 100 (container) + 99 (backdrop) sit above BottomNav (90) and
// NotePadBar (85). When open the sheet covers everything. This is intended.

import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@count/tokens';
import { useNotePad } from '../context/NotePadContext';
import { Icon } from './Icon';
import { NotePadLegRow } from './NotePadLegRow';

export const NOTE_PAD_SHEET_BACKDROP_Z_INDEX = 99;
export const NOTE_PAD_SHEET_Z_INDEX = 100;

const TOAST_MS = 2000;
/** Drag-down threshold in px to dismiss; below this the sheet snaps back open. */
const DRAG_DISMISS_DISTANCE = 100;
/** Or release with vy >= this to dismiss via fling. */
const DRAG_DISMISS_VELOCITY = 0.5;
/** Tap interpreted as a press (not a drag) when total movement stays under this. */
const TAP_SLOP = 4;

export function NotePadSheet(): ReactElement | null {
  const insets = useSafeAreaInsets();
  const { legs, removeLeg, clearAll, isOpen, close } = useNotePad();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenH = Dimensions.get('window').height;
  const sheetMax = Math.round(screenH * 0.6);
  const translateY = useRef(new Animated.Value(sheetMax)).current;
  const backdropAlpha = useRef(new Animated.Value(0)).current;

  // Drive the open/close animation off `isOpen`. Animations are
  // native-driver-safe (translate + opacity).
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: isOpen ? 0 : sheetMax,
        duration: 260,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
      Animated.timing(backdropAlpha, {
        toValue: isOpen ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, sheetMax, translateY, backdropAlpha]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // PanResponder for the drag-handle zone. Tap = close. Drag down past
  // threshold OR fling down = close. Drag down under threshold = snap back.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_e, g) =>
          Math.abs(g.dy) > Math.abs(g.dx) && g.dy > 2,
        onPanResponderMove: (_e, g) => {
          if (g.dy > 0) translateY.setValue(g.dy);
        },
        onPanResponderRelease: (_e, g) => {
          const movement = Math.hypot(g.dx, g.dy);
          // Treat as a tap if barely moved.
          if (movement < TAP_SLOP) {
            close();
            return;
          }
          const shouldClose =
            g.dy > DRAG_DISMISS_DISTANCE || g.vy > DRAG_DISMISS_VELOCITY;
          if (shouldClose) {
            // Animate the remaining distance and notify provider.
            Animated.timing(translateY, {
              toValue: sheetMax,
              duration: 200,
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) close();
            });
          } else {
            // Snap back open.
            Animated.timing(translateY, {
              toValue: 0,
              duration: 200,
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              useNativeDriver: true,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        },
      }),
    [translateY, sheetMax, close],
  );

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(null), TOAST_MS);
  };

  if (!isOpen) return null;

  const count = legs.length;
  const legWord = count === 1 ? 'leg' : 'legs';
  const empty = count === 0;

  return (
    <>
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        style={[backdropStyle, { opacity: backdropAlpha }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close Note Pad"
          onPress={close}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View
        style={[
          sheetContainerStyle,
          { maxHeight: sheetMax, transform: [{ translateY }] },
        ]}
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? 60 : 0}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(20,21,24,0.96)', 'rgba(10,11,13,0.98)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={topHighlightStyle} />

        {/* Drag-handle zone — large invisible tap target wraps a small
            visible pill. Pan responder lives only here, so the inner legs
            list owns its own vertical scroll without contention. */}
        <View
          accessibilityRole="adjustable"
          accessibilityLabel="Drag down to close"
          style={dragHandleZoneStyle}
          {...panResponder.panHandlers}
        >
          <View pointerEvents="none" style={dragHandlePillStyle} />
        </View>

        {/* Header */}
        <View style={headerRowStyle}>
          <View>
            <Text style={headerTitleStyle}>Note Pad</Text>
            <Text style={headerSubStyle}>{`${count} ${legWord}`}</Text>
          </View>
          <Pressable
            disabled={empty}
            onPress={clearAll}
            accessibilityRole="button"
            accessibilityLabel="Clear all legs"
            hitSlop={8}
            style={({ pressed }) => [
              clearAllStyle,
              empty && { opacity: 0.4 },
              pressed && !empty && { opacity: 0.6 },
            ]}
          >
            <Text style={clearAllTextStyle}>Clear all</Text>
          </Pressable>
        </View>

        {/* Legs list */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={listContentStyle}
          showsVerticalScrollIndicator={false}
        >
          {empty ? (
            <View style={emptyWrapStyle}>
              <Text style={emptyTextStyle}>
                No legs added yet. Tap any Safe pill on a fixture to start.
              </Text>
            </View>
          ) : (
            legs.map((leg) => (
              <NotePadLegRow key={leg.id} leg={leg} onRemove={removeLeg} />
            ))
          )}
        </ScrollView>

        {/* Footer */}
        <View style={[footerStyle, { paddingBottom: 16 + insets.bottom }]}>
          <Text style={footerCaptionStyle}>
            Save legs as a builder to compare against future fixtures.
          </Text>
          <Pressable
            disabled={empty}
            onPress={() => showToast('Builders coming soon')}
            accessibilityRole="button"
            accessibilityLabel="Save to Builders"
            style={({ pressed }) => [
              saveBtnStyle,
              empty && saveBtnDisabledStyle,
              pressed && !empty && pressedStyle,
            ]}
          >
            <Icon
              name="bookmark"
              size={14}
              color={empty ? colors.text.faint : colors.amberOnLightText}
            />
            <Text style={[saveBtnTextStyle, empty && { color: colors.text.faint }]}>
              Save to Builders
            </Text>
          </Pressable>
        </View>

        {toast ? (
          <View pointerEvents="none" style={toastWrapStyle}>
            <View style={toastPillStyle}>
              <Text style={toastTextStyle}>{toast}</Text>
            </View>
          </View>
        ) : null}
      </Animated.View>
    </>
  );
}

const backdropStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: NOTE_PAD_SHEET_BACKDROP_Z_INDEX,
};

const sheetContainerStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: NOTE_PAD_SHEET_Z_INDEX,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  overflow: 'hidden',
  borderTopWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.default,
};

const topHighlightStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 1,
  backgroundColor: 'rgba(255,255,255,0.06)',
};

const dragHandleZoneStyle: ViewStyle = {
  paddingTop: 8,
  paddingBottom: 8,
  paddingHorizontal: 60,
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
};

const dragHandlePillStyle: ViewStyle = {
  width: 40,
  height: 4,
  borderRadius: 2,
  backgroundColor: 'rgba(255,255,255,0.18)',
};

const headerRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 8,
};

const headerTitleStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 18,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.2,
};

const headerSubStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  marginTop: 2,
};

const clearAllStyle: ViewStyle = {
  paddingHorizontal: 8,
  paddingVertical: 6,
};

const clearAllTextStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 12,
  fontWeight: typography.weight.medium,
};

const listContentStyle: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 4,
  paddingBottom: 8,
  gap: 8,
};

const emptyWrapStyle: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  padding: 32,
};

const emptyTextStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.regular,
  textAlign: 'center' as const,
  lineHeight: 13 * 1.5,
};

const footerStyle: ViewStyle = {
  paddingTop: 14,
  paddingHorizontal: 16,
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: colors.border.default,
};

const footerCaptionStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  marginBottom: 12,
  lineHeight: 11 * 1.4,
};

const saveBtnStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  paddingVertical: 12,
  borderRadius: 10,
  backgroundColor: colors.amber.bright,
};

const saveBtnDisabledStyle: ViewStyle = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.default,
};

const pressedStyle: ViewStyle = { opacity: 0.85 };

const saveBtnTextStyle = {
  color: colors.amberOnLightText,
  fontFamily: typography.fontSans,
  fontSize: 14,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.1,
};

const toastWrapStyle: ViewStyle = {
  position: 'absolute',
  top: 16,
  left: 0,
  right: 0,
  alignItems: 'center',
};

const toastPillStyle: ViewStyle = {
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 999,
  backgroundColor: 'rgba(0,0,0,0.6)',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: 'rgba(232,181,58,0.25)',
};

const toastTextStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 12,
  fontWeight: typography.weight.medium,
};
