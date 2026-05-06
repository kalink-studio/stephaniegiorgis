import nextConfig from '@kalink-ui/eslint-config/next';

export default [
  ...nextConfig,
  {
    ignores: [
      'eslint.config.*',
      'next.config.js',
      'payload-types.ts',
      'app/(payload)/admin/importMap.js',
      'migrations/**',
    ],
  },
];
