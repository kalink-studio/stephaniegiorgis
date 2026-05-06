import { sys } from '@kalink-ui/seedly/styles';
import { createVar } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const aspectRatio = createVar();

export const videoWrapper = recipe({
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: sys.color.surface.base,
    aspectRatio,

    vars: {
      [aspectRatio]: '16 / 9',
    },
  },

  variants: {
    ratio: {
      '16/9': {
        vars: {
          [aspectRatio]: '16 / 9',
        },
      },
      '4/3': {
        vars: {
          [aspectRatio]: '4 / 3',
        },
      },
      '1/1': {
        vars: {
          [aspectRatio]: '1 / 1',
        },
      },
    },
  },
});
