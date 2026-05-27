// TabStrip — horizontal row of `Tab`s with a hairline separator beneath.
// Used by the fixture detail route shell. No animation on the underline in
// Phase 3 (revisit if jank appears in Phase 4).

import type { ReactElement } from 'react';
import { View, type ViewStyle } from 'react-native';
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

// `marginTop: 6` matches source `.tabs` (styles.css line 380).
// Bottom hairline uses 1pt at 0.14 alpha — per gotcha #11, the default
// hairline-width @ 0.06 alpha is invisible on iPhone dark backgrounds.
const stripStyle: ViewStyle = {
  flexDirection: 'row',
  marginTop: 6,
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(255,255,255,0.14)',
};
