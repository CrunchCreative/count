// Note Pad subsystem — context, provider, and hook.
//
// The Note Pad is the cross-app scratch space for legs (statistical angles a
// user has flagged). Mounted once at the root layout; the bar above the bottom
// nav opens it, the addable Safe pills feed it. Promoted to a saved Builder
// via the footer CTA (real save lands in Phase 7 — currently a toast).
//
// `useNotePad()` falls back to a no-op shape when used outside the provider,
// so isolated tests / storybook usage doesn't crash and renders correctly as
// an empty-pad state.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Leg } from '@count/types';

export interface NotePadContextValue {
  legs: Leg[];
  addLeg: (leg: Leg) => void;
  removeLeg: (id: string) => void;
  toggleLeg: (leg: Leg) => void;
  clearAll: () => void;
  isInPad: (id: string) => boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const NO_OP_NOTEPAD: NotePadContextValue = {
  legs: [],
  addLeg: () => {},
  removeLeg: () => {},
  toggleLeg: () => {},
  clearAll: () => {},
  isInPad: () => false,
  isOpen: false,
  open: () => {},
  close: () => {},
};

export const NotePadContext = createContext<NotePadContextValue | null>(null);

export function useNotePad(): NotePadContextValue {
  const ctx = useContext(NotePadContext);
  return ctx ?? NO_OP_NOTEPAD;
}

export interface NotePadProviderProps {
  children: ReactNode;
  initialLegs?: Leg[];
}

export function NotePadProvider({
  children,
  initialLegs = [],
}: NotePadProviderProps) {
  const [legs, setLegs] = useState<Leg[]>(initialLegs);
  const [isOpen, setIsOpen] = useState(false);

  const isInPad = useCallback(
    (id: string) => legs.some((l) => l.id === id),
    [legs],
  );

  const addLeg = useCallback((leg: Leg) => {
    setLegs((prev) => (prev.some((l) => l.id === leg.id) ? prev : [...prev, leg]));
  }, []);

  const removeLeg = useCallback((id: string) => {
    setLegs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleLeg = useCallback((leg: Leg) => {
    setLegs((prev) =>
      prev.some((l) => l.id === leg.id)
        ? prev.filter((l) => l.id !== leg.id)
        : [...prev, leg],
    );
  }, []);

  const clearAll = useCallback(() => setLegs([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<NotePadContextValue>(
    () => ({
      legs,
      addLeg,
      removeLeg,
      toggleLeg,
      clearAll,
      isInPad,
      isOpen,
      open,
      close,
    }),
    [legs, addLeg, removeLeg, toggleLeg, clearAll, isInPad, isOpen, open, close],
  );

  return <NotePadContext.Provider value={value}>{children}</NotePadContext.Provider>;
}
