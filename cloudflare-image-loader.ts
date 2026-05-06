import type { ImageLoaderProps } from 'next/image';

const DEFAULT_QUALITY = 75;

interface CloudflareImageLoaderOptions extends ImageLoaderProps {
  enabled?: boolean;
}

const isTransformableSource = (src: string) => {
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
    return false;
  }

  return true;
};

export const buildCloudflareImageUrl = ({
  src,
  width,
  quality,
  enabled = process.env.NODE_ENV === 'production',
}: CloudflareImageLoaderOptions) => {
  if (!enabled || !isTransformableSource(src)) {
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

  return `/cdn-cgi/image/${options}/${src}`;
};

export default function cloudflareImageLoader(props: ImageLoaderProps) {
  return buildCloudflareImageUrl(props);
}
