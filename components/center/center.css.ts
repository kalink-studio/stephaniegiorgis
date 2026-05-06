import { centerVars } from '@kalink-ui/seedly/components/center';
import { breakpoints } from '@kalink-ui/seedly/styles';
import { createVar, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const centerMaxInlineSize = createVar();

export const center = style({
  inlineSize: `min(${centerMaxInlineSize}, ${calc('100%').subtract(calc.multiply(centerVars.spacing.rootGutters, 2)).toString()})`,
  maxInlineSize: centerMaxInlineSize,

  vars: {
    [centerMaxInlineSize]: `${breakpoints.xl}px`,
  },
});
