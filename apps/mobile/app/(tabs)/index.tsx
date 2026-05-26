import { ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FormPill,
  GlassPanel,
  Icon,
  Kit,
  RadialBackdrop,
  SafePill,
  ScorePill,
  SectionHead,
  SignalBadge,
  SignalMini,
  type IconName,
} from '@count/ui';
import { colors, spacing, typography } from '@count/tokens';
import { getTeam } from '@/src/mock/teams';

const ICON_NAMES: IconName[] = [
  'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down',
  'bookmark', 'search', 'bell', 'home', 'calendar', 'profile',
  'builders', 'filter', 'arrow-right', 'arrow-left', 'flag',
  'sparkles', 'target', 'card', 'arrows-h', 'bars', 'check',
  'info', 'plus', 'corner', 'x', 'x-circle', 'more', 'close',
  'layers', 'copy', 'duplicate', 'trash', 'check-circle', 'share',
];

// Twelve teams across leagues + pattern variety for the shirt strip
const SHIRT_TEAM_CODES = [
  'MCI', 'CRY', 'ARS', 'NEW', 'WOL', 'TOT',
  'BAR', 'VIL', 'JUV', 'INT', 'BAY', 'PSG',
];

const MINI_TEAM_CODES = ['MCI', 'CRY', 'NEW', 'ARS', 'BAR', 'WOL', 'JUV', 'PSG'];

// Yellow primary (WOL, VIL), white primary (TOT, RMA) verify the dark-text override
const PLAYER_KIT_ENTRIES: { team: string; number: number }[] = [
  { team: 'MCI', number: 9 },
  { team: 'CRY', number: 11 },
  { team: 'WOL', number: 7 },
  { team: 'VIL', number: 10 },
  { team: 'TOT', number: 22 },
  { team: 'RMA', number: 5 },
  { team: 'ARS', number: 14 },
  { team: 'NEW', number: 4 },
];

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.page }}>
      <StatusBar barStyle="light-content" />
      <RadialBackdrop />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.pageX,
            paddingTop: spacing.pageY + 40,
            // Clear the absolute-positioned NotePadBar + BottomNav at the bottom.
            paddingBottom: 200,
          }}
        >
          <PageTitle />

          <SectionHead label="TEAM KITS" tone="utility" meta="Shirts" />
          <Row>
            {SHIRT_TEAM_CODES.map((code) => {
              const team = getTeam(code);
              if (!team) return null;
              return (
                <View key={code} style={{ alignItems: 'center', gap: 4 }}>
                  <Kit team={team} variant="shirt" size={26} />
                  <CodeLabel code={team.code} />
                </View>
              );
            })}
          </Row>

          <SectionHead label="KIT MINI" tone="utility" meta="8 × 9 inline" />
          <Row>
            {MINI_TEAM_CODES.map((code) => {
              const team = getTeam(code);
              if (!team) return null;
              return (
                <View key={code} style={{ alignItems: 'center', gap: 4 }}>
                  <Kit team={team} variant="mini" />
                  <CodeLabel code={team.code} />
                </View>
              );
            })}
          </Row>

          <SectionHead
            label="PLAYER KITS"
            tone="engine"
            meta="Square + number"
          />
          <Row>
            {PLAYER_KIT_ENTRIES.map(({ team: code, number }) => {
              const team = getTeam(code);
              if (!team) return null;
              return (
                <View key={`${code}-${number}`} style={{ alignItems: 'center', gap: 4 }}>
                  <Kit
                    team={team}
                    variant="square"
                    playerNumber={number}
                  />
                  <CodeLabel code={team.code} />
                </View>
              );
            })}
          </Row>

          <SectionHead
            label="SECTION HEADS"
            tone="utility"
            meta="Both tones"
          />
          <SectionHead label="ENGINE TONE" tone="engine" meta="5/5 angles" />
          <SectionHead label="UTILITY TONE" tone="utility" />

          {/* Phase 1C demo content — kept below for cumulative reference. */}

          <LegacyLabel text="PHASE 1C PRIMITIVES" />

          <Section title="GLASS PANELS">
            <View style={{ gap: spacing.cardGap }}>
              <GlassPanel variant="standard">
                <PanelBody text="Standard glass panel" />
              </GlassPanel>
              <GlassPanel variant="elevated">
                <PanelBody text="Elevated glass panel (amber rim, glow, keyline)" />
              </GlassPanel>
              <GlassPanel variant="hero">
                <PanelBody text="Hero glass panel (deep teal-black, teal rim)" />
              </GlassPanel>
            </View>
          </Section>

          <Section title="SAFE PILLS">
            <Row>
              <SafePill threshold="8.5" hits={5} total={5} />
              <SafePill threshold="8" hits={4} total={5} />
              <SafePill threshold="7.5" hits={3} total={5} />
            </Row>
            <Row>
              <SafePill threshold="8.5" hits={5} total={5} size="mini" />
              <SafePill threshold="8" hits={4} total={5} size="mini" />
              <SafePill threshold="7.5" hits={3} total={5} size="mini" />
            </Row>
            <Row>
              <SafePill threshold="8.5" hits={5} total={5} addable />
              <SafePill threshold="8" hits={4} total={5} addable />
            </Row>
          </Section>

          <Section title="SIGNAL BADGES">
            <Row>
              <SignalBadge score={92} />
              <SignalBadge score={74} />
              <SignalBadge score={58} />
            </Row>
            <Row>
              <SignalMini score={92} />
              <SignalMini score={74} />
              <SignalMini score={58} />
            </Row>
          </Section>

          <Section title="FORM PILLS">
            <Row>
              <FormPill result="W" />
              <FormPill result="D" />
              <FormPill result="L" />
              <FormPill result="W" />
              <FormPill result="W" />
              <FormPill result="L" />
              <FormPill result="W" />
            </Row>
          </Section>

          <Section title="SCORE PILLS">
            <Row>
              <ScorePill result="3-0" wdl="W" />
              <ScorePill result="1-1" wdl="D" />
              <ScorePill result="0-2" wdl="L" />
            </Row>
          </Section>

          <Section title="ICONS">
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                rowGap: spacing.gridLoose,
              }}
            >
              {ICON_NAMES.map((name) => (
                <IconCell key={name} name={name} />
              ))}
            </View>
          </Section>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function PageTitle() {
  return (
    <Text
      style={{
        color: colors.text.primary,
        fontFamily: typography.fontSans,
        fontSize: typography.size.h2,
        fontWeight: typography.weight.medium,
        letterSpacing: typography.letterSpacing.h2,
      }}
    >
      Count — design primitives
    </Text>
  );
}

function CodeLabel({ code }: { code: string }) {
  return (
    <Text
      style={{
        color: colors.text.hint,
        fontFamily: typography.fontMono,
        fontSize: 9,
        fontWeight: typography.weight.regular,
        letterSpacing: 0.4,
      }}
    >
      {code}
    </Text>
  );
}

function LegacyLabel({ text }: { text: string }) {
  return (
    <Text
      style={{
        marginTop: 28,
        marginBottom: 4,
        color: colors.text.faint,
        fontFamily: typography.fontMono,
        fontSize: typography.size.micro,
        fontWeight: typography.weight.regular,
        letterSpacing: typography.letterSpacing.metaMicro,
        textTransform: 'uppercase',
      }}
    >
      {text}
    </Text>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.cardGap, marginTop: spacing.section }}>
      <Text
        style={{
          color: colors.text.hint,
          fontFamily: typography.fontMono,
          fontSize: typography.size.micro,
          fontWeight: typography.weight.regular,
          letterSpacing: typography.letterSpacing.metaMicro,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: spacing.gridLoose,
        rowGap: spacing.gridTight,
      }}
    >
      {children}
    </View>
  );
}

function PanelBody({ text }: { text: string }) {
  return (
    <View style={{ padding: spacing.panel }}>
      <Text
        style={{
          color: colors.text.secondary,
          fontFamily: typography.fontSans,
          fontSize: typography.size.body,
          fontWeight: typography.weight.regular,
          lineHeight: typography.size.body * typography.lineHeight.body,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

function IconCell({ name }: { name: IconName }) {
  return (
    <View style={{ width: '16.6%', alignItems: 'center', gap: 4 }}>
      <Icon name={name} size={18} color={colors.text.secondary} />
      <Text
        style={{
          color: colors.text.hint,
          fontFamily: typography.fontMono,
          fontSize: typography.size.micro,
          fontWeight: typography.weight.regular,
          letterSpacing: typography.letterSpacing.metaMicro,
        }}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
}
