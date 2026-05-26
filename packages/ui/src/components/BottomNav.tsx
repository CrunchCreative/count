import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReactElement } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@count/tokens';
import { Icon, type IconName } from './Icon';

export const BOTTOM_NAV_Z_INDEX = 90;

export interface BottomNavTab {
  key: string;
  label: string;
  icon: IconName;
}

export interface BottomNavProps {
  tabs: BottomNavTab[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export function BottomNav({ tabs, activeKey, onSelect }: BottomNavProps): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: BOTTOM_NAV_Z_INDEX,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border.default,
      }}
    >
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(8,9,11,0.4)', 'rgba(8,9,11,0.92)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 8,
          paddingHorizontal: 4,
          paddingBottom: insets.bottom + 8,
        }}
      >
        {tabs.map((tab) => {
          const active = tab.key === activeKey;
          const tint = active ? colors.amber.bright : colors.text.hint;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelect(tab.key)}
              hitSlop={8}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 6,
                paddingHorizontal: 4,
                minHeight: 44,
              }}
            >
              <Icon name={tab.icon} size={22} color={tint} />
              <Text
                style={{
                  color: tint,
                  fontFamily: typography.fontSans,
                  fontSize: 10,
                  fontWeight: typography.weight.medium,
                  textAlign: 'center',
                  marginTop: 2,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}