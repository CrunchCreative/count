import { ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FormPill,
  GlassPanel,
  Icon,
  RadialBackdrop,
  SafePill,
  ScorePill,
  SignalBadge,
  SignalMini,
  type IconName,
} from '@count/ui';
import { colors, spacing, typography } from '@count/tokens';

const ICON_NAMES: IconName[] = [
  'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down',
  'bookmark', 'search', 'bell', 'home', 'calendar', 'profile',
  'builders', 'filter', 'arrow-right', 'arrow-left', 'flag',
  'sparkles', 'target', 'card', 'arrows-h', 'bars', 'check',
  'info', 'plus', 'corner', 'x', 'x-circle', 'more', 'close',
  'layers', 'copy', 'duplicate', 'trash', 'check-circle', 'share',
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
            paddingBottom: spacing.pageY + 80,
            gap: spacing.section,
          }}
        >
          <PageTitle />

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
            <Row>
              <FormPill result="L" />
              <FormPill result="L" />
              <FormPill result="D" />
              <FormPill result="W" />
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.cardGap }}>
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
