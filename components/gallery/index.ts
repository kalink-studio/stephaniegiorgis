import { GalleryProvider, useGallery } from './gallery-context';
import { GalleryLightbox } from './gallery-lightbox';
import { GalleryTrigger } from './gallery-trigger';

export { GalleryProvider, useGallery, GalleryLightbox, GalleryTrigger };
export type { GalleryItem } from './gallery-types';

/**
 * Convenience namespace for dot-notation usage:
 *
 * ```tsx
 * import * as Gallery from '@/components/gallery';
 *
 * <Gallery.Root items={items}>
 *   <Gallery.Trigger index={0}>…</Gallery.Trigger>
 *   <Gallery.Lightbox />
 * </Gallery.Root>
 * ```
 */
export {
  GalleryProvider as Root,
  GalleryLightbox as Lightbox,
  GalleryTrigger as Trigger,
};
