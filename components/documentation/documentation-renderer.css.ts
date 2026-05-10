import { sys } from '@kalink-ui/seedly/styles';
import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const documentationImageItem = style({
  flex: '1 1 100%',
  width: '100%',
  minWidth: 0,

  cursor: 'pointer',
});

export const documentationImageFrame = style({
  width: '100%',
  maxWidth: 'none',
  maxHeight: 'none',
});

globalStyle(`${documentationImageFrame} img`, {
  width: '100%',
  height: 'auto',
});

const baseImageRow = style({
  display: 'flex',
  alignItems: 'stretch',
  gap: sys.spacing[4],
  width: '100%',
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
