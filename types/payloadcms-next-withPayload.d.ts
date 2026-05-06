declare module '@payloadcms/next/withPayload' {
  import type { NextConfig } from 'next';

  export function withPayload(
    nextConfig?: NextConfig,
    options?: {
      devBundleServerPackages?: boolean;
    },
  ): NextConfig;

  export default withPayload;
}
