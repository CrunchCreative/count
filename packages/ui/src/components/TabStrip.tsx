// TabStrip — horizontal row of `Tab`s with a hairline separator beneath.
// Used by the fixture detail route shell. No animation on the underline in
// Phase 3 (revisit if jank appears in Phase 4).

import type { ReactElement } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '@count/tokens';
import { Tab } from './Tab';

export interface TabSpec {
  id: string;
  label: string;
}

export interface TabStripProps {
  tabs: TabSpec[];
  activeId: string;
  onChange: (id: string) => void;
}

export function TabStrip({ tabs, activeId, onChange }: TabStripProps): ReactElement {
  return (
    <View style={stripStyle} accessibilityRole="tablist">
      {tabs.map((t) => (
        <Tab
          key={t.id}
          id={t.id}
          label={t.label}
          active={activeId === t.id}
          onPress={onChange}
        />
      ))}
    </View>
  );
}

const stripStyle: ViewStyle = {
  flexDirection: 'row',
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors.border.default,
};
