import { sys } from '@kalink-ui/seedly/styles';
import { keyframes, style } from '@vanilla-extract/css';

/* ------------------------------------------------------------------ */
/*  Backdrop                                                           */
/* ------------------------------------------------------------------ */

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  backgroundColor: `color-mix(in srgb, ${sys.color.content.base} 92%, transparent)`,

  opacity: 0,
  transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',

  selectors: {
    '&[data-open]': {
      opacity: 1,
    },
    '&[data-starting-style]': {
      opacity: 0,
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

/* ------------------------------------------------------------------ */
/*  Popup (full-screen overlay)                                        */
/* ------------------------------------------------------------------ */

export const popup = style({
  /**
   * Override seedly's default card-like dialog popup styles which set
   * `position: fixed; inset-block-start: 50%; inset-inline-start: 50%;
   *  transform: translate(-50%, -50%); inline-size: 24rem; max-inline-size;
   *  padding; background-color; border-radius; outline; margin-block-start`.
   * We need a true full-viewport overlay instead.
   */
  all: 'unset',

  position: 'fixed',
  inset: 0,
  zIndex: 1001,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  /* Reset card-like properties explicitly (belt-and-suspenders after `all: unset`) */
  inlineSize: '100%',
  blockSize: '100%',
  maxInlineSize: 'none',
  maxBlockSize: 'none',
  margin: 0,
  padding: 0,
  backgroundColor: 'transparent',
  borderRadius: 0,
  border: 'none',
  outline: 'none',
  color: 'inherit',
  transform: 'none',

  opacity: 0,
  transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',

  selectors: {
    '&[data-open]': {
      opacity: 1,
    },
    '&[data-starting-style]': {
      opacity: 0,
      /* Override seedly's scale(0.9) starting style */
      transform: 'none',
    },
    '&[data-ending-style]': {
      opacity: 0,
      transform: 'none',
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

/* ------------------------------------------------------------------ */
/*  Image container                                                    */
/* ------------------------------------------------------------------ */

export const imageContainer = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: '100%',
  height: '100%',

  padding: sys.spacing[8],
  touchAction: 'pan-y pinch-zoom',
  userSelect: 'none',

  '@media': {
    'screen and (min-width: 768px)': {
      padding: sys.spacing[12],
    },
  },
});

export const lightboxImage = style({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  display: 'block',
});

/* ------------------------------------------------------------------ */
/*  Navigation buttons                                                 */
/* ------------------------------------------------------------------ */

const navButton = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: '44px',
  height: '44px',
  padding: 0,

  border: 'none',
  borderRadius: '50%',
  backgroundColor: `color-mix(in srgb, ${sys.color.surface.base} 80%, transparent)`,
  color: sys.color.content.base,
  cursor: 'pointer',

  opacity: 0.7,
  transition: 'opacity 200ms ease, background-color 200ms ease',

  ':hover': {
    opacity: 1,
    backgroundColor: sys.color.surface.base,
  },

  ':focus-visible': {
    opacity: 1,
    outline: `2px solid ${sys.color.content.base}`,
    outlineOffset: '2px',
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
    'screen and (max-width: 767px)': {
      display: 'none',
    },
  },
});

export const prevButton = style([navButton, { left: sys.spacing[6] }]);

export const nextButton = style([navButton, { right: sys.spacing[6] }]);

/* ------------------------------------------------------------------ */
/*  Close button                                                       */
/* ------------------------------------------------------------------ */

export const closeButton = style({
  position: 'absolute',
  top: sys.spacing[6],
  right: sys.spacing[6],
  zIndex: 10,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: '44px',
  height: '44px',
  padding: 0,

  border: 'none',
  borderRadius: '50%',
  backgroundColor: `color-mix(in srgb, ${sys.color.surface.base} 80%, transparent)`,
  color: sys.color.content.base,
  cursor: 'pointer',

  opacity: 0.7,
  transition: 'opacity 200ms ease, background-color 200ms ease',

  ':hover': {
    opacity: 1,
    backgroundColor: sys.color.surface.base,
  },

  ':focus-visible': {
    opacity: 1,
    outline: `2px solid ${sys.color.content.base}`,
    outlineOffset: '2px',
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

/* ------------------------------------------------------------------ */
/*  Counter                                                            */
/* ------------------------------------------------------------------ */

export const counter = style({
  position: 'absolute',
  bottom: sys.spacing[8],
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,

  fontFamily: sys.typography.label.medium.font,
  fontSize: sys.typography.label.medium.size,
  fontWeight: sys.typography.label.medium.weight,
  lineHeight: sys.typography.label.medium.lineHeight,
  letterSpacing: sys.typography.label.medium.tracking,

  color: `color-mix(in srgb, ${sys.color.surface.base} 90%, transparent)`,
  userSelect: 'none',
});

/* ------------------------------------------------------------------ */
/*  Visually-hidden (for sr-only text)                                 */
/* ------------------------------------------------------------------ */

export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
});

/* ------------------------------------------------------------------ */
/*  Image crossfade                                                    */
/* ------------------------------------------------------------------ */

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const imageFadeIn = style({
  animation: `${fadeIn} 200ms ease both`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});
