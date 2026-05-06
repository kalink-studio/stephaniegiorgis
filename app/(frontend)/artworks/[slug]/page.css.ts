import { sys } from '@kalink-ui/seedly/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const artworkPage = style({
  display: 'flex',
  gap: sys.spacing[10],
  width: '100%',
  alignItems: 'center',

  position: 'relative',
});

globalStyle(`${artworkPage} > *`, {
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: '50%',

  maxHeight: '100%',

  '@media': {
    'screen and (min-width: 1024px)': {
      overflow: 'scroll',
    },
  },
});

export const artworkData = style({
  width: '100%',

  textAlign: 'end',
});

export const artworkDescription = style({
  marginTop: sys.spacing[10],

  '@media': {
    'screen and (max-width: 1023px)': {
      textAlign: 'start',
    },

    'screen and (min-width: 1024px)': {
      marginTop: `min(10vh, ${sys.spacing[12]})`,
    },
  },
});
