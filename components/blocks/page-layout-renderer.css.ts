import { screen, sys } from '@kalink-ui/seedly/styles';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const layout = style({
  width: '100%',
});

export const section = style({
  width: '100%',
});

export const sectionContent = style({
  width: '100%',
  minWidth: 0,
});

export const twoColumnLayout = recipe({
  base: {
    display: 'grid',
    gap: sys.spacing[10],
    gridTemplateColumns: 'minmax(0, 1fr)',
    alignItems: 'start',
  },

  variants: {
    ratio: {
      '1_1': {
        '@media': {
          [screen.lg]: {
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          },
        },
      },
      '3_2': {
        '@media': {
          [screen.lg]: {
            gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)',
          },
        },
      },
      '2_3': {
        '@media': {
          [screen.lg]: {
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)',
          },
        },
      },
    },
  },
});
