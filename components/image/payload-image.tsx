import { clsx } from 'clsx';
import NextImage from 'next/image';
import { ForwardedRef, forwardRef } from 'react';

import {
  getMediaAlt,
  getMediaDimensions,
  getMediaUrl,
} from '@/payload/runtime';
import type {
  ImageTransformValue,
  MediaDocument,
  TransformKey,
} from '@/payload/runtime';

import { image } from './payload-image.css';

interface PayloadImageProps {
  media: MediaDocument | ImageTransformValue | null | undefined;
  transform?: TransformKey;
  cover?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const PayloadImage = (
  {
    media,
    transform,
    cover,
    className,
    sizes = '100vw',
    priority,
    ...rest
  }: PayloadImageProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const url = getMediaUrl(media, transform);
  const dims = getMediaDimensions(media, transform);
  const alt = getMediaAlt(media);

  if (!url) {
    return null;
  }

  return (
    <div ref={ref} className={clsx(image({ cover }), className)} {...rest}>
      <NextImage
        src={url}
        alt={alt}
        width={dims?.width ?? 800}
        height={dims?.height ?? 600}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
};

const WrappedPayloadImage = forwardRef(PayloadImage);

export { WrappedPayloadImage as PayloadImage };
