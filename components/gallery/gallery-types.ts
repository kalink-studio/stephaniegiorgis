/**
 * Backend-agnostic gallery item type.
 *
 * The gallery core intentionally only knows about URLs and dimensions —
 * any CMS-specific media normalisation happens _outside_ this module.
 */
export interface GalleryItem {
  /** Full-resolution image URL shown in the lightbox. */
  src: string;
  /** Accessible alt text. */
  alt: string;
  /** Intrinsic width of the full-resolution image. */
  width?: number;
  /** Intrinsic height of the full-resolution image. */
  height?: number;
  /** Optional thumbnail URL used for the grid trigger. */
  thumbnailSrc?: string;
}
