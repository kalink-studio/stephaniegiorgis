export const seedlyTypographyVariants = [
  'display',
  'headline',
  'title',
  'body',
  'label',
] as const;

export const seedlyTypographySizes = ['large', 'medium', 'small'] as const;

export type SeedlyTypographyVariant = (typeof seedlyTypographyVariants)[number];

export type SeedlyTypographySize = (typeof seedlyTypographySizes)[number];

export const seedlyVariantStateKey = 'seedlyVariant';
export const seedlySizeStateKey = 'seedlySize';

export const defaultParagraphTypography = {
  variant: 'body',
  size: 'medium',
} as const satisfies {
  variant: SeedlyTypographyVariant;
  size: SeedlyTypographySize;
};

export const defaultHeadingTypography = {
  h1: { variant: 'display', size: 'large' },
  h2: { variant: 'display', size: 'medium' },
  h3: { variant: 'display', size: 'small' },
  h4: { variant: 'headline', size: 'large' },
  h5: { variant: 'headline', size: 'medium' },
  h6: { variant: 'headline', size: 'small' },
} as const satisfies Record<
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  {
    variant: SeedlyTypographyVariant;
    size: SeedlyTypographySize;
  }
>;

export function isSeedlyTypographyVariant(
  value: unknown,
): value is SeedlyTypographyVariant {
  return (
    typeof value === 'string' &&
    seedlyTypographyVariants.includes(value as SeedlyTypographyVariant)
  );
}

export function isSeedlyTypographySize(
  value: unknown,
): value is SeedlyTypographySize {
  return (
    typeof value === 'string' &&
    seedlyTypographySizes.includes(value as SeedlyTypographySize)
  );
}
