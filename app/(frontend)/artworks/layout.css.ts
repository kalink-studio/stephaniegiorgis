import { sys } from '@kalink-ui/seedly/styles';
import { style } from '@vanilla-extract/css';

export const main = style({
  display: 'flex',
  flexGrow: 1,
  alignSelf: 'center',
  justifyContent: 'center',

  paddingBlockEnd: sys.spacing[4],

  position: 'relative',
});
