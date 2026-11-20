import { MEDIA_HOSTNAMES } from './payload/runtime/siteHosts.ts';

import type { ImageLoaderProps } from 'next/image';

const DEFAULT_QUALITY = 75;

interface CloudflareImageLoaderOptions extends ImageLoaderProps {
  enabled?: boolean;
}

/**
 * Origin that runs the transformation for `src`, or `null` when the source is
 * not on a Cloudflare-proxied media host. Media hosts serve `/cdn-cgi/image/*`
 * themselves; page hostnames may be DNS-only, so theirs cannot be relied on.
 */
const getTransformOrigin = (src: string) => {
  try {
    const { hostname, origin, protocol } = new URL(src);

    if (protocol === 'https:' && MEDIA_HOSTNAMES.has(hostname)) {
      return origin;
    }
  } catch {
    // Relative, data: or invalid source.
  }

  return null;
};

export const buildCloudflareImageUrl = ({
  src,
  width,
  quality,
  enabled = process.env.NODE_ENV === 'production',
}: CloudflareImageLoaderOptions) => {
  const transformOrigin = enabled ? getTransformOrigin(src) : null;

  if (!transformOrigin) {
    return src;
  }

  const options = [
    'format=auto',
    `width=${width}`,
    `quality=${quality ?? DEFAULT_QUALITY}`,
    'fit=scale-down',
    'metadata=none',
    'onerror=redirect',
  ].join(',');

  return `${transformOrigin}/cdn-cgi/image/${options}/${src}`;
};

export default function cloudflareImageLoader(props: ImageLoaderProps) {
  return buildCloudflareImageUrl(props);
}
