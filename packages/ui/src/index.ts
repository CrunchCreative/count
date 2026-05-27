// Glass surfaces
export { GlassPanel } from './components/GlassPanel';
export { RadialBackdrop } from './components/RadialBackdrop';
export { KeylineGlow } from './components/KeylineGlow';

// Atomic primitives
export { SafePill } from './components/SafePill';
export { SignalBadge } from './components/SignalBadge';
export { SignalMini } from './components/SignalMini';
export { FormPill } from './components/FormPill';
export { ScorePill } from './components/ScorePill';
export { Icon } from './components/Icon';
export { IconButton } from './components/IconButton';

// Multi-format primitives
export { Kit } from './components/Kit';

// Section / structural primitives
export { SectionHead } from './components/SectionHead';
export { HScroll } from './components/HScroll';

// App-shell chrome
export { BottomNav, BOTTOM_NAV_Z_INDEX } from './components/BottomNav';
export { NotePadBar, NOTE_PAD_BAR_Z_INDEX } from './components/NotePadBar';
export {
  AppHeader,
  APP_HEADER_CONTENT_HEIGHT,
  APP_HEADER_Z_INDEX,
} from './components/AppHeader';
export type { AppHeaderProps } from './components/AppHeader';

// Note Pad subsystem
export {
  NotePadContext,
  NotePadProvider,
  useNotePad,
} from './context/NotePadContext';
export type {
  NotePadContextValue,
  NotePadProviderProps,
} from './context/NotePadContext';

// Scroll subsystem — shared Animated.Value for header background animation
export { ScrollProvider, useScrollY } from './context/ScrollContext';
export type {
  ScrollContextValue,
  ScrollProviderProps,
} from './context/ScrollContext';
export {
  NotePadSheet,
  NOTE_PAD_SHEET_BACKDROP_Z_INDEX,
  NOTE_PAD_SHEET_Z_INDEX,
} from './components/NotePadSheet';
export { NotePadLegRow } from './components/NotePadLegRow';
export type { NotePadLegRowProps } from './components/NotePadLegRow';

// Tabs (used by route stub now, full consumption in Phase 4)
export { Tab } from './components/Tab';
export { TabStrip } from './components/TabStrip';
export type { TabProps } from './components/Tab';
export type { TabStripProps, TabSpec } from './components/TabStrip';

// Fixtures-list primitives + screen
export { DateChip } from './components/DateChip';
export { CompChip } from './components/CompChip';
export { GlassSelect, GLASS_SELECT_DROPDOWN_Z_INDEX } from './components/GlassSelect';
export { FixtureListCard } from './components/FixtureListCard';
export { FixtureLeagueSection } from './components/FixtureLeagueSection';
export { FixturesList } from './components/FixturesList';
export type { DateChipProps } from './components/DateChip';
export type { CompChipProps } from './components/CompChip';
export type {
  GlassSelectProps,
  GlassSelectOption,
} from './components/GlassSelect';
export type { FixtureListCardProps } from './components/FixtureListCard';
export type { FixtureLeagueSectionProps } from './components/FixtureLeagueSection';
export type { FixturesListProps } from './components/FixturesList';

// Dashboard composite components
export { HeroCarousel } from './components/HeroCarousel';
export { HeroDecor } from './components/HeroDecor';
export { FixtureCard } from './components/FixtureCard';
export { FeaturedMatch } from './components/FeaturedMatch';
export { ResearchCard } from './components/ResearchCard';
export { PickupCard } from './components/PickupCard';
export { ScanCard } from './components/ScanCard';

// Type re-exports
export type { GlassVariant, GlassPanelProps } from './components/GlassPanel';
export type { KeylineGlowProps, KeylineTone } from './components/KeylineGlow';
export type { SafePillProps, SafePillTier, SafePillSize } from './components/SafePill';
export type { SignalBadgeProps } from './components/SignalBadge';
export type { SignalMiniProps } from './components/SignalMini';
export type { FormPillProps, FormResult } from './components/FormPill';
export type { ScorePillProps, ScoreOutcome } from './components/ScorePill';
export type { IconName, IconProps } from './components/Icon';
export type { IconButtonProps } from './components/IconButton';
export type { KitProps, KitVariant } from './components/Kit';
export type { SectionHeadProps, SectionHeadTone } from './components/SectionHead';
export type { HScrollProps } from './components/HScroll';
export type { BottomNavProps, BottomNavTab } from './components/BottomNav';
export type { HeroCarouselProps } from './components/HeroCarousel';
export type { HeroDecorProps } from './components/HeroDecor';
export type { FixtureCardProps } from './components/FixtureCard';
export type { FeaturedMatchProps } from './components/FeaturedMatch';
export type { ResearchCardProps } from './components/ResearchCard';
export type { PickupCardProps } from './components/PickupCard';
export type { ScanCardProps } from './components/ScanCard';
