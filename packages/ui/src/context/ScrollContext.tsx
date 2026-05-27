// Scroll subsystem — single shared Animated.Value driven by whichever tab
// screen's ScrollView is in focus. Read by `AppHeader` to interpolate the
// background blur/gradient/border in as the user scrolls.
//
// Approach (c) from the brief: one Animated.Value at the (tabs) layout level,
// every screen writes to it. On screen-change the value briefly carries the
// previous screen's scroll position, but since each screen starts at scrollY=0
// and the next screen's `onScroll` takes over on first scroll event, the
// transient is invisible in practice.
//
// `useScrollY` falls back to a stable no-op Animated.Value outside the
// provider (so isolated tests / storybook usage don't crash).

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { Animated } from 'react-native';

export interface ScrollContextValue {
  scrollY: Animated.Value;
}

const NO_OP_SCROLL_Y = new Animated.Value(0);

const ScrollContext = createContext<ScrollContextValue | null>(null);

export interface ScrollProviderProps {
  children: ReactNode;
}

export function ScrollProvider({ children }: ScrollProviderProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  return (
    <ScrollContext.Provider value={{ scrollY }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollY(): Animated.Value {
  const ctx = useContext(ScrollContext);
  return ctx?.scrollY ?? NO_OP_SCROLL_Y;
}
