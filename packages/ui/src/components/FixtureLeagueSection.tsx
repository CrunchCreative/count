// FixtureLeagueSection — one league's section heading + stacked fixture cards.
// The consumer is responsible for resolving each fixture's home/away teams
// (keeps `@count/ui` decoupled from the data layer).

import type { ReactElement } from 'react';
import { View, type ViewStyle } from 'react-native';
import type { FixtureListItem, Team } from '@count/types';
import { FixtureListCard } from './FixtureListCard';
import { SectionHead } from './SectionHead';

export interface FixtureLeagueSectionProps {
  league: string;
  fixtures: FixtureListItem[];
  resolveTeam: (code: string) => Team | undefined;
  onOpenFixture?: (id: string) => void;
  firstSection?: boolean;
}

export function FixtureLeagueSection({
  league,
  fixtures,
  resolveTeam,
  onOpenFixture,
  firstSection,
}: FixtureLeagueSectionProps): ReactElement | null {
  if (fixtures.length === 0) return null;

  return (
    <View style={firstSection ? firstSectionStyle : nextSectionStyle}>
      <SectionHead
        label={league.toUpperCase()}
        tone="utility"
        meta={`${fixtures.length} fixtures`}
      />
      <View style={cardsStackStyle}>
        {fixtures.map((f) => {
          const home = resolveTeam(f.home);
          const away = resolveTeam(f.away);
          if (!home || !away) return null;
          return (
            <FixtureListCard
              key={f.id}
              fixture={f}
              homeTeam={home}
              awayTeam={away}
              onPress={onOpenFixture ? () => onOpenFixture(f.id) : undefined}
            />
          );
        })}
      </View>
    </View>
  );
}

const firstSectionStyle: ViewStyle = { marginTop: 0 };
const nextSectionStyle: ViewStyle = { marginTop: 26 };
const cardsStackStyle: ViewStyle = {
  gap: 10,
};
