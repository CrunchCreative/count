// TabPlaceholder — one-line glass placeholder for the three not-yet-built
// detail tabs (Team stats / Player stats / The Count). Replaces the route
// stub's single "Tab content arrives in Phase 4" string with a per-tab card
// that names the upcoming phase.

import type { ReactElement } from 'react';
import { Text } from 'react-native';
import { GlassPanel } from '@count/ui';
import { colors, typography } from '@count/tokens';

export interface TabPlaceholderProps {
  /** Upcoming phase identifier — "4B", "4C", "5". */
  phase: string;
  /** Visible tab name — "Team stats", "Player stats", "The Count". */
  tabName: string;
}

export function TabPlaceholder({ phase, tabName }: TabPlaceholderProps): ReactElement {
  return (
    <GlassPanel
      variant="standard"
      style={{
        padding: 24,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: colors.text.muted,
          fontFamily: typography.fontSans,
          fontSize: 13,
          fontWeight: typography.weight.regular,
          textAlign: 'center',
        }}
      >
        {tabName} arrives in Phase {phase}.
      </Text>
    </GlassPanel>
  );
}
