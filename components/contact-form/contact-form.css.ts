import { sys } from '@kalink-ui/seedly/styles';
import { style } from '@vanilla-extract/css';

export const contactForm = style({
  inlineSize: '100%',
  maxInlineSize: '38rem',
});

export const control = style({
  display: 'block',
  inlineSize: '100%',
  minBlockSize: sys.spacing[14],
});

export const messageControl = style([
  control,
  {
    minBlockSize: '10rem',
    resize: 'vertical',
  },
]);

export const actions = style({
  alignItems: 'center',
});
