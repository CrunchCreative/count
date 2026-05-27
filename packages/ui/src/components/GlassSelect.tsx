// GlassSelect — trigger + inline dropdown panel. Used by the Fixtures-list
// comp filter row to switch the visible league. Ports `.glass-select`
// (styles.css line 346).
//
// Layout (trigger row): optional amber dot (when filteringActive), label
// growing to fill space, optional mono count, chevron-down.
//
// Dropdown panel: positioned absolute below the trigger. z-index 30
// (transient menu — sits above scrolling content beneath, well below the
// sheet/nav/bar at 85/90/99/100).
//
// Style passed as a single static merged object on the trigger (gotcha #10
// — Pressable can drop properties from style arrays containing inline objects).

import { useState, type ReactElement } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { Platform } from 'react-native';
import { colors, radii, typography } from '@count/tokens';
import { Icon } from './Icon';

export const GLASS_SELECT_DROPDOWN_Z_INDEX = 30;

export interface GlassSelectOption {
  id: string;
  label: string;
  count?: number;
}

export interface GlassSelectProps {
  value: string;
  options: GlassSelectOption[];
  onChange: (id: string) => void;
  /** When true, render the amber leading dot. Indicates a non-default filter is active. */
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
  const label = current?.label ?? 'Select…';
  const count = current?.count;

  return (
    <View style={wrapStyle}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={label}
        style={triggerStyle}
      >
        {filteringActive ? <View style={dotStyle} /> : null}
        <Text style={triggerLabelStyle} numberOfLines={1}>
          {label}
        </Text>
        {typeof count === 'number' ? (
          <Text style={countStyle}>{count}</Text>
        ) : null}
        <Icon name="chevron-down" size={14} color={colors.text.muted} />
      </Pressable>

      {open ? (
        <View style={dropdownStyle}>
          {options.map((opt) => {
            const selected = opt.id === value;
            return (
              <Pressable
                key={opt.id}
                onPress={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                style={selected ? optionSelectedStyle : optionStyle}
              >
                <Text
                  style={selected ? optionLabelSelectedStyle : optionLabelStyle}
                  numberOfLines={1}
                >
                  {opt.label}
                </Text>
                {typeof opt.count === 'number' ? (
                  <Text
                    style={selected ? optionCountSelectedStyle : optionCountStyle}
                  >
                    {opt.count}
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
  position: 'relative',
  zIndex: GLASS_SELECT_DROPDOWN_Z_INDEX,
};

const triggerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  paddingHorizontal: 14,
  paddingVertical: 9,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  backgroundColor: 'rgba(255,255,255,0.025)',
};

const dotStyle: ViewStyle = {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: colors.amber.bright,
};

const triggerLabelStyle = {
  flex: 1,
  minWidth: 0,
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.regular,
};

const countStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  marginRight: 2,
};

const dropdownShadow = Platform.select<ViewStyle>({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  default: {
    elevation: 8,
  },
}) ?? {};

const dropdownStyle: ViewStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: 6,
  paddingVertical: 4,
  borderRadius: radii.panel,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  backgroundColor: 'rgba(20,21,24,0.98)',
  ...dropdownShadow,
};

const optionStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  paddingHorizontal: 14,
  paddingVertical: 10,
  backgroundColor: 'transparent',
};

const optionSelectedStyle: ViewStyle = {
  ...optionStyle,
  backgroundColor: 'rgba(232,181,58,0.10)',
};

const optionLabelStyle = {
  flex: 1,
  minWidth: 0,
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.regular,
};

const optionLabelSelectedStyle = {
  ...optionLabelStyle,
  color: colors.amber.bright,
  fontWeight: typography.weight.medium,
};

const optionCountStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 10,
};

const optionCountSelectedStyle = {
  ...optionCountStyle,
  color: colors.amber.bright,
};