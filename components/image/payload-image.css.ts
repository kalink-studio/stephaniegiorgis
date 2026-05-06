import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const baseImage = style({});

export const image = recipe({
  base: baseImage,

  variants: {
    cover: {
      true: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
    },
  },
});

globalStyle(`${image.classNames.base} > img`, {
  maxWidth: '100%',
  height: 'auto',
});

globalStyle(`${image.classNames.variants.cover} > img`, {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  insetInlineStart: 0,
  objectPosition: 'center',
  objectFit: 'cover',
});
