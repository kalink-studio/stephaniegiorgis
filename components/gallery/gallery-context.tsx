'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { GalleryItem } from './gallery-types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GalleryContextValue {
  /** All items registered in this gallery instance. */
  items: GalleryItem[];
  /** Index of the currently viewed item, or `null` when closed. */
  activeIndex: number | null;
  /** Trigger element used to open the gallery. */
  activeTrigger: HTMLElement | null;
  /** Open the lightbox at the given index. */
  open: (index: number, trigger?: HTMLElement | null) => void;
  /** Close the lightbox. */
  close: () => void;
  /** Navigate to the next item (wraps). */
  next: () => void;
  /** Navigate to the previous item (wraps). */
  prev: () => void;
  /** Navigate to a specific index. */
  goTo: (index: number) => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext);

  if (!ctx) {
    throw new Error(
      'useGallery must be used within a <Gallery.Root> component.',
    );
  }

  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

interface GalleryProviderProps {
  items: GalleryItem[];
  children: React.ReactNode;
}

export function GalleryProvider({ items, children }: GalleryProviderProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeTrigger, setActiveTrigger] = useState<HTMLElement | null>(null);

  const open = useCallback(
    (index: number, trigger?: HTMLElement | null) => {
      if (index >= 0 && index < items.length) {
        setActiveTrigger(trigger ?? null);
        setActiveIndex(index);
      }
    },
    [items.length],
  );

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) {
        return null;
      }

      if (prev >= items.length - 1) {
        return prev;
      }

      return prev + 1;
    });
  }, [items.length]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) {
        return null;
      }

      if (prev <= 0) {
        return prev;
      }

      return prev - 1;
    });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < items.length) {
        setActiveIndex(index);
      }
    },
    [items.length],
  );

  const value = useMemo<GalleryContextValue>(
    () => ({
      items,
      activeIndex,
      activeTrigger,
      open,
      close,
      next,
      prev,
      goTo,
    }),
    [items, activeIndex, activeTrigger, open, close, next, prev, goTo],
  );

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
}
