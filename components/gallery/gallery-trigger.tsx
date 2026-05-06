'use client';

import { useCallback, useRef } from 'react';

import { useGallery } from './gallery-context';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GalleryTriggerProps {
  /** Zero-based index into the gallery items array. */
  index: number;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Wraps any element so clicking it opens the lightbox at the given index.
 *
 * Renders a semantic `<button>` so focus and keyboard activation work
 * automatically. The button is visually unstyled — the child content
 * provides all visual treatment.
 */
export function GalleryTrigger({
  index,
  children,
  className,
  ariaLabel = 'View image in lightbox',
}: GalleryTriggerProps) {
  const { open } = useGallery();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = useCallback(() => {
    open(index, triggerRef.current);
  }, [open, index]);

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={handleClick}
      className={className}
      style={{
        appearance: 'none',
        display: 'block',
        width: '100%',
        padding: 0,
        border: 0,
        background: 'transparent',
        color: 'inherit',
        font: 'inherit',
        textAlign: 'inherit',
      }}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
