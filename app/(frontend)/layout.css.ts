import { sys, typography } from '@kalink-ui/seedly/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const html = style({
  minHeight: '100dvh',
});

export const body = style([
  typography.body.medium,
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: sys.spacing[10],

    minHeight: '100dvh',

    backgroundColor: sys.color.surface.base,
    color: sys.color.content.base,
  },
]);

export const footer = style({
  textAlign: 'center',
});

globalStyle(`a`, {
  textDecoration: 'none',
});
