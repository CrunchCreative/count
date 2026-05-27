// NotePadSheet — modal bottom sheet listing the current Note Pad legs.
// Mounted once at the root layout as an absolute-positioned sibling. Renders
// nothing when `isOpen === false` so its constant mounting is cheap.
//
// Hand-rolled (no react-native-gesture-handler dep) — interactions are open /
// close / backdrop tap / remove leg, no drag-to-dismiss. Drag handle is
// decorative.
//
// z-index 100 (container) + 99 (backdrop) sit above BottomNav (90) and
// NotePadBar (85), so when open the sheet covers everything. This is
// intentional (modal). Closing returns the lower-stack to normal.

import { useEffect, useRef, useState, type ReactElement } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
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

export function NotePadSheet(): ReactElement | null {
  const insets = useSafeAreaInsets();
  const { legs, removeLeg, clearAll, isOpen, close } = useNotePad();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Slide-up + fade animation. Cheap, native-driver. No drag.
  const screenH = Dimensions.get('window').height;
  const sheetMax = Math.round(screenH * 0.6);
  const translateY = useRef(new Animated.Value(sheetMax)).current;
  const backdropAlpha = useRef(new Animated.Value(0)).current;

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

  // Clean up any in-flight toast on unmount.
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(null), TOAST_MS);
  };

  // Skip the heavy subtree entirely when closed.
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
        <BlurView intensity={Platform.OS === 'ios' ? 60 : 0} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(20,21,24,0.96)', 'rgba(10,11,13,0.98)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={topHighlightStyle} />

        {/* Drag handle — decorative this phase. */}
        <View style={dragHandleStyle} />

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

const dragHandleStyle: ViewStyle = {
  alignSelf: 'center',
  width: 40,
  height: 4,
  borderRadius: 2,
  backgroundColor: 'rgba(255,255,255,0.15)',
  marginTop: 8,
  marginBottom: 8,
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
