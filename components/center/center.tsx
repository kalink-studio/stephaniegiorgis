'use client';

import { breakpoints } from '@kalink-ui/seedly/styles';
import { Center as SeedlyCenter } from '@kalink-ui/seedly-react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { clsx } from 'clsx';
import { type ComponentProps } from 'react';

import { center, centerMaxInlineSize } from './center.css';

const centerSizeMap = {
  small: '720px',
  medium: '960px',
  large: `${breakpoints.xl}px`,
  full: '99999px',
} as const;

export type CenterSize = keyof typeof centerSizeMap;

type CenterOverrideProps = ComponentProps<typeof SeedlyCenter> & {
  maxInlineSize?: number | string;
  size?: CenterSize;
};

export function Center({
  className,
  maxInlineSize,
  size = 'large',
  style,
  ...props
}: CenterOverrideProps) {
  const resolvedMaxInlineSize =
    typeof maxInlineSize === 'number'
      ? `${maxInlineSize}px`
      : (maxInlineSize ?? centerSizeMap[size]);

  const inlineVars = assignInlineVars({
    [centerMaxInlineSize]: resolvedMaxInlineSize,
  });

  return (
    <SeedlyCenter
      className={clsx(center, className)}
      style={style ? { ...style, ...inlineVars } : inlineVars}
      {...props}
    />
  );
}
