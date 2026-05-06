'use client';

import { useCallback, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  /** Set once the gesture has committed to a direction. */
  axis: 'horizontal' | 'vertical' | null;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Minimum horizontal distance (px) to qualify as a swipe. */
const SWIPE_THRESHOLD = 30;

/** Distance (px) before the gesture commits to an axis. */
const AXIS_LOCK_THRESHOLD = 8;

/** Maximum time (ms) for a swipe gesture. */
const MAX_SWIPE_TIME = 600;

/** Minimum velocity (px/ms) — fast flicks below distance threshold still count. */
const MIN_VELOCITY = 0.3;

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * Returns a **callback ref** to attach to the swipe target element.
 * Uses native `touchstart`/`touchmove`/`touchend`/`touchcancel` events
 * so that button clicks inside the element are never intercepted.
 *
 * The callback ref pattern ensures listeners are attached when the DOM
 * node mounts and detached when it unmounts — critical when the target
 * lives inside a conditional render (e.g. a dialog portal).
 *
 * Also prevents native image drag (`dragstart`) so long-press + drag
 * on desktop touch-devices doesn't start a browser drag instead of a
 * swipe gesture.
 */
export function useSwipe<T extends HTMLElement = HTMLElement>({
  onSwipeLeft,
  onSwipeRight,
}: SwipeOptions) {
  const stateRef = useRef<TouchState | null>(null);
  const callbacksRef = useRef({ onSwipeLeft, onSwipeRight });

  // Keep callbacks ref always fresh (no deps — runs every render).
  useEffect(() => {
    callbacksRef.current = { onSwipeLeft, onSwipeRight };
  });

  // Store the current element + cleanup so the callback ref can
  // tear down listeners when the node unmounts or changes.
  const cleanupRef = useRef<(() => void) | null>(null);
  const nodeRef = useRef<T | null>(null);

  /**
   * Callback ref — called by React with the DOM node on mount and
   * `null` on unmount.  Attaches / detaches touch listeners each time.
   */
  const swipeRef = useCallback((node: T | null) => {
    // Tear down previous listeners (if any)
    cleanupRef.current?.();
    cleanupRef.current = null;
    nodeRef.current = null;

    if (!node) {
      return;
    }

    nodeRef.current = node;

    /* -------------------------------------------------------------- */
    /*  Touch handlers                                                 */
    /* -------------------------------------------------------------- */

    function handleTouchStart(e: TouchEvent) {
      // Only track single-finger touches
      if (e.touches.length !== 1) {
        stateRef.current = null;
        return;
      }

      const touch = e.touches[0]!;

      stateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        axis: null,
      };
    }

    function handleTouchMove(e: TouchEvent) {
      const state = stateRef.current;

      if (!state || e.touches.length !== 1) {
        return;
      }

      const touch = e.touches[0]!;
      const dx = Math.abs(touch.clientX - state.startX);
      const dy = Math.abs(touch.clientY - state.startY);

      // Lock axis once we've moved enough
      if (
        state.axis === null &&
        (dx >= AXIS_LOCK_THRESHOLD || dy >= AXIS_LOCK_THRESHOLD)
      ) {
        state.axis = dx >= dy ? 'horizontal' : 'vertical';
      }

      // Prevent page scroll when swiping horizontally
      if (state.axis === 'horizontal') {
        e.preventDefault();
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      const state = stateRef.current;

      stateRef.current = null;

      if (!state) {
        return;
      }

      const touch = e.changedTouches[0]!;
      const dx = touch.clientX - state.startX;
      const absDx = Math.abs(dx);
      const dt = Date.now() - state.startTime;

      // Time guard
      if (dt > MAX_SWIPE_TIME) {
        return;
      }

      // Must have committed to horizontal axis
      if (state.axis !== 'horizontal') {
        return;
      }

      const velocity = dt > 0 ? absDx / dt : 0;

      // Accept either distance threshold OR velocity threshold
      if (absDx < SWIPE_THRESHOLD && velocity < MIN_VELOCITY) {
        return;
      }

      if (dx < 0) {
        callbacksRef.current.onSwipeLeft?.();
      } else {
        callbacksRef.current.onSwipeRight?.();
      }
    }

    /** Reset tracking on cancel (e.g. incoming phone call, multi-touch). */
    function handleTouchCancel() {
      stateRef.current = null;
    }

    /** Prevent native image drag so touch-drag isn't hijacked. */
    function handleDragStart(e: Event) {
      e.preventDefault();
    }

    /* -------------------------------------------------------------- */
    /*  Attach                                                         */
    /* -------------------------------------------------------------- */

    // { passive: false } on touchmove so we can preventDefault for horizontal swipes
    node.addEventListener('touchstart', handleTouchStart, { passive: true });
    node.addEventListener('touchmove', handleTouchMove, { passive: false });
    node.addEventListener('touchend', handleTouchEnd, { passive: true });
    node.addEventListener('touchcancel', handleTouchCancel, { passive: true });
    node.addEventListener('dragstart', handleDragStart);

    /* -------------------------------------------------------------- */
    /*  Cleanup (stored for teardown)                                  */
    /* -------------------------------------------------------------- */

    cleanupRef.current = () => {
      stateRef.current = null;
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchmove', handleTouchMove);
      node.removeEventListener('touchend', handleTouchEnd);
      node.removeEventListener('touchcancel', handleTouchCancel);
      node.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // If the component unmounts entirely while a node is still attached,
  // tear down listeners.
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return {
    /** Attach to the swipe target element via `ref={swipeRef}`. */
    ref: swipeRef,
  };
}
