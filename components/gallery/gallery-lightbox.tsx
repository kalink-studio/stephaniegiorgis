'use client';

import { Dialog } from '@kalink-ui/seedly-react';
import NextImage from 'next/image';
import { useCallback, useEffect, useRef } from 'react';

import { useGallery } from './gallery-context';
import {
  backdrop,
  closeButton,
  counter,
  imageContainer,
  imageFadeIn,
  lightboxImage,
  nextButton,
  popup,
  prevButton,
  srOnly,
} from './gallery-lightbox.css';
import { useSwipe } from './use-swipe';

/* ------------------------------------------------------------------ */
/*  SVG icon helpers (inline to avoid extra deps)                      */
/* ------------------------------------------------------------------ */

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Tags whose focused instances should not be overridden by gallery keys. */
const INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function isEditableTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) {
    return false;
  }

  if (INPUT_TAGS.has(el.tagName)) {
    return true;
  }

  return el.isContentEditable;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * The lightbox overlay. Renders a full-screen dialog with
 * prev/next navigation, keyboard controls, and swipe support.
 *
 * Must be placed inside a `<Gallery.Root>` (uses gallery context).
 */
export function GalleryLightbox() {
  const { items, activeIndex, activeTrigger, close, next, prev } = useGallery();
  const isOpen = activeIndex !== null;
  const currentItem = activeIndex !== null ? items[activeIndex] : null;
  const hasMultiple = items.length > 1;
  const canPrev = activeIndex !== null && activeIndex > 0;
  const canNext = activeIndex !== null && activeIndex < items.length - 1;

  /* ---------------------------------------------------------------- */
  /*  Refs for stable event handlers                                   */
  /* ---------------------------------------------------------------- */

  const navRef = useRef({ canPrev, canNext, prev, next, close });

  useEffect(() => {
    navRef.current = { canPrev, canNext, prev, next, close };
  });

  /** Ref for the trigger element to restore focus to on close. */
  const finalFocusRef = useRef<HTMLElement | null>(null);

  /** Ref for the popup element (used for initialFocus). */
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    finalFocusRef.current = activeTrigger;
  }, [activeTrigger]);

  /* ---------------------------------------------------------------- */
  /*  Global keyboard navigation                                      */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Don't hijack keys when focus is on an editable element
      if (isEditableTarget(e.target)) {
        return;
      }

      const {
        canPrev: cp,
        canNext: cn,
        prev: goPrev,
        next: goNext,
        close: closeLightbox,
      } = navRef.current;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (cp) {
            goPrev();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (cn) {
            goNext();
          }
          break;
      }
    }

    // Use capture phase so our handler fires before the dialog's
    // own keydown handler (which may stopPropagation on Escape).
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  /* ---------------------------------------------------------------- */
  /*  Swipe gestures                                                  */
  /* ---------------------------------------------------------------- */

  // Swipe callbacks always call the latest nav functions via refs
  // so the hook never needs to re-subscribe.
  const handleSwipeLeft = useCallback(() => {
    const { canNext: cn, next: goNext } = navRef.current;

    if (cn) {
      goNext();
    }
  }, []);

  const handleSwipeRight = useCallback(() => {
    const { canPrev: cp, prev: goPrev } = navRef.current;

    if (cp) {
      goPrev();
    }
  }, []);

  const { ref: swipeRef } = useSwipe<HTMLDivElement>({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        close();
      }
    },
    [close],
  );

  /* ---------------------------------------------------------------- */
  /*  Button handlers — call context directly, stop propagation       */
  /* ---------------------------------------------------------------- */

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      prev();
    },
    [prev],
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      next();
    },
    [next],
  );

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      close();
    },
    [close],
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={backdrop} />
        <Dialog.Popup
          ref={popupRef}
          className={popup}
          initialFocus={() => {
            // Focus the popup container itself so keyboard events
            // fire reliably without requiring a focusable child first.
            return popupRef.current ?? true;
          }}
          finalFocus={() => {
            const trigger = finalFocusRef.current;

            if (trigger) {
              return trigger;
            }

            return true;
          }}
        >
          <Dialog.Title className={srOnly}>Image gallery</Dialog.Title>

          {currentItem && (
            <div className={imageContainer} ref={swipeRef}>
              {/* Previous */}
              {hasMultiple && canPrev && (
                <button
                  type="button"
                  className={prevButton}
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  <ChevronLeft />
                </button>
              )}

              {/* Image */}
              <NextImage
                key={activeIndex}
                src={currentItem.src}
                alt={currentItem.alt}
                width={currentItem.width ?? 1200}
                height={currentItem.height ?? 900}
                className={`${lightboxImage} ${imageFadeIn}`}
                sizes="100vw"
                priority
              />

              {/* Next */}
              {hasMultiple && canNext && (
                <button
                  type="button"
                  className={nextButton}
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <ChevronRight />
                </button>
              )}

              {/* Counter */}
              {hasMultiple && (
                <div className={counter} aria-live="polite">
                  {(activeIndex ?? 0) + 1} / {items.length}
                </div>
              )}

              {/* Close */}
              <button
                type="button"
                className={closeButton}
                onClick={handleClose}
                aria-label="Close lightbox"
              >
                <XIcon />
              </button>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
