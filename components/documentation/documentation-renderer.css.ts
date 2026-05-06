import { sys } from '@kalink-ui/seedly/styles';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const documentationImageItem = style({
  flex: '1 1 100%',

  cursor: 'pointer',
});

const baseImageRow = style({
  display: 'flex',
  gap: sys.spacing[4],
});

export const imageRow = recipe({
  base: baseImageRow,

  variants: {
    column: {
      true: {
        flexWrap: 'wrap',
      },
    },
  },
});
