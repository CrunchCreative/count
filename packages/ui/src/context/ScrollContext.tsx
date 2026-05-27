// Scroll subsystem — single shared Animated.Value driven by whichever tab
// screen's ScrollView is in focus. Read by `AppHeader` to interpolate the
// background blur/gradient/border in as the user scrolls.
//
// Approach (c) from the Phase 3.6 brief: one Animated.Value at the (tabs)
// layout level, every screen writes to it. Phase 3.6.1 adds an explicit
// `resetScroll` for tab-focus resets — without it, switching tabs preserved
// the previous scroll position in the shared value and the AppHeader stayed
// opaque on the new tab. Tab screens call `useResetScroll()` inside a
// `useFocusEffect` to snap the value back to 0 (and scroll their own
// ScrollView to top) when they gain focus.
//
// `useScrollY` / `useResetScroll` both fall back to stable no-ops outside the
// provider so isolated tests / storybook don't crash.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { Animated } from 'react-native';

export interface ScrollContextValue {
  scrollY: Animated.Value;
  resetScroll: () => void;
}

const NO_OP_SCROLL_Y = new Animated.Value(0);
const NO_OP_RESET = () => {};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export interface ScrollProviderProps {
  children: ReactNode;
}

export function ScrollProvider({ children }: ScrollProviderProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const resetScroll = useCallback(() => {
    scrollY.setValue(0);
  }, [scrollY]);

  const value = useMemo<ScrollContextValue>(
    () => ({ scrollY, resetScroll }),
    [scrollY, resetScroll],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScrollY(): Animated.Value {
  const ctx = useContext(ScrollContext);
  return ctx?.scrollY ?? NO_OP_SCROLL_Y;
}

export function useResetScroll(): () => void {
  const ctx = useContext(ScrollContext);
  return ctx?.resetScroll ?? NO_OP_RESET;
}
