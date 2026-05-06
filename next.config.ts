import { withPayload } from '@payloadcms/next/withPayload';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

import type { NextConfig } from 'next';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  images: {
    imageSizes: [192, 256, 320, 384, 400, 480, 560],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.pub1.infomaniak.cloud',
      },
    ],
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,

  transpilePackages: ['@kalink-ui/seedly', '@kalink-ui/seedly-react'],
};

export default withPayload(withVanillaExtract(nextConfig));
