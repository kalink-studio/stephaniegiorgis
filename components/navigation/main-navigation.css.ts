import { screen, sys, transition } from '@kalink-ui/seedly/styles';
import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const navigationStart = style({
  '@media': {
    [screen.maxMd]: {
      marginInlineStart: calc.negate(sys.spacing[4]),
    },
  },
});

export const navigation = style({
  paddingBlockStart: sys.spacing[12],
});

export const logo = style({
  textTransform: 'uppercase',
  textDecoration: 'none',
});

export const navigationPanelBodyLinks = style({
  height: '100%',
});

export const navigationLink = style({
  display: 'inline-block',

  position: 'relative',

  textTransform: 'uppercase',
  textDecoration: 'none',

  selectors: {
    '&::after': {
      content: '""',

      display: 'block',

      width: '100%',
      height: '1px',

      backgroundColor: 'transparent',

      transition: transition('background-color'),
    },

    '&[aria-current="page"]::after': {
      backgroundColor: 'currentColor',
    },

    '&:hover::after': {
      backgroundColor: 'currentColor',
    },
  },
});

export const navigationDrawer = style({
  position: 'absolute',

  inset: 0,
});
