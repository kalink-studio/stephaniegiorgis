import { sys } from '@kalink-ui/seedly/styles';
import { style } from '@vanilla-extract/css';

export const richText = style({});

export const blockquote = style([
  {
    paddingInline: sys.spacing[12],
    fontStyle: 'italic',
  },
]);
