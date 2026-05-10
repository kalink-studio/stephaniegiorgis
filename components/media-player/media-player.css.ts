import { createVar, style } from '@vanilla-extract/css';

export const maxWidthVar = createVar();

export const mediaPlayer = style({
  width: '100%',
  maxWidth: maxWidthVar,
  minWidth: 0,
  boxSizing: 'border-box',

  overflow: 'hidden',

  vars: {
    [maxWidthVar]: '100%',
    '--video-border-radius': '0',
    '--video-border': 'none',
    '--audio-border-radius': '0',
  },
});
