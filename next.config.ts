import { withPayload } from '@payloadcms/next/withPayload';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

import type { NextConfig } from 'next';

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
});

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './cloudflare-image-loader.ts',
    unoptimized: process.env.NODE_ENV !== 'production',
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [192, 256, 320, 384, 400, 480, 560],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.pub2.infomaniak.cloud',
      },
      {
        protocol: 'https',
        hostname: 'media.stephaniegiorgis.ch',
      },
      {
        protocol: 'https',
        hostname: 'staging-media.stephaniegiorgis.ch',
      },
    ],
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,

  transpilePackages: ['@kalink-ui/seedly', '@kalink-ui/seedly-react'],
};

export default withPayload(withVanillaExtract(nextConfig));
