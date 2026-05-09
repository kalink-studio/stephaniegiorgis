import { sys } from '@kalink-ui/seedly/styles';
import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const documentationImageItem = style({
  flex: '1 1 100%',

  cursor: 'pointer',
});

export const documentationImageFrame = style({
  width: '100%',
});

globalStyle(`${documentationImageFrame} img`, {
  width: '100%',
  height: 'auto',
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
