// GlassSelect — trigger + inline dropdown panel. Used by the Fixtures-list
// comp filter row to switch the visible league.
//
// The dropdown panel renders as an absolute child of the trigger, positioned
// just below it. z-index 30 puts it above the FixturesList content scrolling
// below, but well below the BottomNav (90), NotePadBar (85), and NotePadSheet
// (99/100). It's a transient menu, not a modal.

import { useState, type ReactElement } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '@count/tokens';
import { Icon } from './Icon';

export const GLASS_SELECT_DROPDOWN_Z_INDEX = 30;

export interface GlassSelectOption {
  id: string;
  label: string;
  /** Optional right-side count, mono-typed. */
  count?: number;
}

export interface GlassSelectProps {
  value: string;
  options: GlassSelectOption[];
  onChange: (id: string) => void;
  /**
   * `filteringActive` shifts the trigger's text color to primary and shows the
   * amber dot — mirrors the source's `filteringActive && <span className="dot" />`.
   */
  filteringActive?: boolean;
}

export function GlassSelect({
  value,
  options,
  onChange,
  filteringActive,
}: GlassSelectProps): ReactElement {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.id === value);
  const currentLabel = current?.label ?? '';
  const currentCount = current?.count;

  return (
    <View style={wrapStyle}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`Select competition. Current: ${currentLabel}`}
        style={({ pressed }) => [triggerStyle, pressed && pressedStyle]}
      >
        {filteringActive ? <View style={dotStyle} /> : null}
        <Text
          style={[
            triggerLabelStyle,
            filteringActive ? triggerLabelActiveStyle : triggerLabelMutedStyle,
          ]}
          numberOfLines={1}
        >
          {currentLabel}
        </Text>
        {filteringActive && typeof currentCount === 'number' ? (
          <Text style={triggerCountStyle}>{currentCount}</Text>
        ) : null}
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={colors.text.muted}
        />
      </Pressable>

      {open ? (
        <View style={panelStyle}>
          <LinearGradient
            colors={['rgba(20,21,24,0.97)', 'rgba(15,16,18,0.97)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {options.map((o) => {
            const selected = o.id === value;
            return (
              <Pressable
                key={o.id}
                onPress={() => {
                  onChange(o.id);
                  setOpen(false);
                }}
                accessibilityRole="menuitem"
                accessibilityState={{ selected }}
                accessibilityLabel={o.label}
                style={({ pressed }) => [
                  optionStyle,
                  selected && optionSelectedStyle,
                  pressed && pressedStyle,
                ]}
              >
                <Text
                  style={[
                    optionLabelStyle,
                    selected ? optionLabelSelectedStyle : optionLabelDefaultStyle,
                  ]}
                  numberOfLines={1}
                >
                  {o.label}
                </Text>
                {typeof o.count === 'number' ? (
                  <Text
                    style={[
                      optionCountStyle,
                      selected ? optionCountSelectedStyle : optionCountDefaultStyle,
                    ]}
                  >
                    {o.count}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const wrapStyle: ViewStyle = {
  flex: 1,
  minWidth: 0,
};

const triggerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  paddingHorizontal: 12,
  paddingVertical: 9,
  borderRadius: 8,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.default,
  backgroundColor: 'rgba(255,255,255,0.02)',
};

const pressedStyle: ViewStyle = { opacity: 0.7 };

const dotStyle: ViewStyle = {
  width: 6,
  height: 6,
  borderRadius: 999,
  backgroundColor: colors.amber.bright,
};

const triggerLabelStyle = {
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
  flex: 1,
  flexShrink: 1,
};

const triggerLabelActiveStyle = { color: colors.text.primary };
const triggerLabelMutedStyle = { color: colors.text.muted };

const triggerCountStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.medium,
};

const panelStyle: ViewStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: 6,
  padding: 6,
  borderRadius: 10,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.strong,
  overflow: 'hidden',
  zIndex: GLASS_SELECT_DROPDOWN_Z_INDEX,
  // iOS shadow — gives the panel real separation from the row beneath.
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.4,
  shadowRadius: 18,
  elevation: 8,
};

const optionStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 8,
};

const optionSelectedStyle: ViewStyle = {
  backgroundColor: 'rgba(232,181,58,0.06)',
};

const optionLabelStyle = {
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
  flex: 1,
};

const optionLabelSelectedStyle = { color: colors.amber.bright };
const optionLabelDefaultStyle = { color: colors.text.primary };

const optionCountStyle = {
  fontFamily: typography.fontMono,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.3,
};

const optionCountSelectedStyle = { color: colors.amber.bright };
const optionCountDefaultStyle = { color: colors.text.hint };
