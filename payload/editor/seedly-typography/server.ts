import { createServerFeature } from '@payloadcms/richtext-lexical';

export const SeedlyTypographyFeature = createServerFeature({
  key: 'seedlyTypography',
  feature: {
    ClientFeature: {
      path: './payload/editor/seedly-typography/client.tsx',
      exportName: 'SeedlyTypographyFeatureClient',
    },
  },
});
