/**
 * Lightweight frontend type definitions for Payload data shapes.
 *
 * These mirror the Payload collections/globals defined in payload/
 * but are intentionally decoupled so frontend code never imports from
 * the Payload config directly. When the real generated types from Payload
 * become available, this file can be replaced with a re-export.
 */

import type {
  SeedlyTypographySize,
  SeedlyTypographyVariant,
} from '../editor/seedly-typography/shared';

/* ------------------------------------------------------------------ */
/*  Media                                                              */
/* ------------------------------------------------------------------ */

/** Canonical Canopy image-transform keys (underscore-based). */
export type TransformKey = '1_1' | '2_3' | '3_2' | '4_3' | '16_9';

export interface UploadDocument {
  id: number | string;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  filename?: string | null;
  filesize?: number | null;
  updatedAt?: string | null;
  transforms?: Partial<Record<TransformKey, MediaTransform>> | null;
}

export interface MediaDocument extends UploadDocument {
  alt?: string | null;
}

export interface DerivativeDocument extends UploadDocument {
  fingerprint?: string | null;
  sourceVersion?: string | null;
}

export interface MediaTransform {
  url: string;
  width?: number | null;
  height?: number | null;
}

export interface ImageTransformPresetValue {
  derivative?: UploadRelation | null;
}

export interface ImageTransformValue {
  source?: MediaRelation | null;
  selectedPresetKey?: TransformKey | null;
  presets?: Partial<Record<TransformKey, ImageTransformPresetValue>> | null;
}

export type UploadRelation =
  | number
  | UploadDocument
  | {
      relationTo?: string;
      value?: UploadDocument | number | null;
    };

export type MediaRelation = UploadRelation;

/* ------------------------------------------------------------------ */
/*  Rich Text (Lexical)                                                */
/* ------------------------------------------------------------------ */

/**
 * The root shape Payload stores for a Lexical rich-text field.
 * We keep this permissive – concrete node types are handled in the renderer.
 */
export interface LexicalRoot {
  root: LexicalNode;
}

export interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  // Common optional fields across node types
  version?: number;
  direction?: 'ltr' | 'rtl' | null;
  format?: string | number;
  indent?: number;
  tag?: string;
  text?: string;
  detail?: number;
  mode?: string;
  style?: string;
  customClass?: string;
  $?: {
    seedlyVariant?: SeedlyTypographyVariant;
    seedlySize?: SeedlyTypographySize;
    [key: string]: unknown;
  };
  // Link fields
  fields?: {
    url?: string;
    newTab?: boolean;
    linkType?: 'custom' | 'internal';
    doc?: { value: PageDocument | ArtworkDocument; relationTo: string } | null;
    [key: string]: unknown;
  };
  // Relationship / block fields
  value?: unknown;
  relationTo?: string;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ */
/*  Page Blocks                                                        */
/* ------------------------------------------------------------------ */

export interface RichTextBlock {
  blockType: 'richText';
  id?: string;
  content: LexicalRoot;
}

export interface CaptionImageBlock {
  blockType: 'captionImage';
  id?: string;
  image: ImageTransformValue;
  caption?: LexicalRoot | null;
}

export interface VideoBlock {
  blockType: 'video';
  id?: string;
  poster?: ImageTransformValue | null;
  av1File?: MediaDocument | null;
  h264File?: MediaDocument | null;
  ratio?: '16_9' | '4_3' | '1_1' | null;
  maxWidth?: string | null;
}

export interface LinkListItem {
  id?: string;
  label?: string | null;
  link?: string | null;
  description?: LexicalRoot | null;
  screenshot?: ImageTransformValue | null;
}

export interface LinkListBlock {
  blockType: 'linkList';
  id?: string;
  items?: LinkListItem[] | null;
}

export interface ArtworkGridBlock {
  blockType: 'artworkGrid';
  id?: string;
  items: ArtworkGridItem[];
}

export interface ArtworkGridItem {
  id?: string;
  artwork: ArtworkDocument;
}

export interface FormReferenceBlock {
  blockType: 'formReference';
  id?: string;
  form?: { id: string; title?: string } | null;
  heading?: string | null;
  intro?: LexicalRoot | null;
}

export type PageBlock =
  | RichTextBlock
  | CaptionImageBlock
  | VideoBlock
  | LinkListBlock
  | ArtworkGridBlock
  | FormReferenceBlock;

export type ColumnBlock = Exclude<PageBlock, ArtworkGridBlock>;

export type PageLayoutWidth = 'small' | 'medium' | 'large' | 'full';
export type PageLayoutRatio = '1_1' | '3_2' | '2_3';

export interface SingleColumnPageLayoutSection {
  id?: string;
  width?: PageLayoutWidth | null;
  columns?: 'one' | null;
  blocks?: PageBlock[] | null;
}

export interface TwoColumnPageLayoutSection {
  id?: string;
  width?: PageLayoutWidth | null;
  columns: 'two';
  ratio?: PageLayoutRatio | null;
  primaryBlocks?: ColumnBlock[] | null;
  secondaryBlocks?: ColumnBlock[] | null;
}

export type PageLayoutSection =
  | SingleColumnPageLayoutSection
  | TwoColumnPageLayoutSection;

/* ------------------------------------------------------------------ */
/*  Documentation Sections (artwork detail)                            */
/* ------------------------------------------------------------------ */

export type DocumentationGridLayout =
  | 'Grid 1/1'
  | 'Grid 1/2'
  | 'Grid 2/1'
  | 'Grid 2/2'
  | 'Grid 1/1/1'
  | 'Grid 1/1/2';

export interface DocumentationImageGridBlock {
  blockType: 'docGrid';
  id?: string;
  layout: DocumentationGridLayout;
  items?: DocumentationImageGridItem[] | null;
}

export interface DocumentationImageGridItem {
  id?: string;
  image: ImageTransformValue;
}

export interface DocumentationAudioItem {
  id?: string;
  media: MediaDocument;
}

export interface DocumentationAudioBlock {
  blockType: 'docAudio';
  id?: string;
  items?: DocumentationAudioItem[] | null;
}

export interface DocumentationVideoItem {
  id?: string;
  media: MediaDocument;
  ratio?: '16_9' | '4_3' | '1_1' | null;
}

export interface DocumentationVideoBlock {
  blockType: 'docVideo';
  id?: string;
  items?: DocumentationVideoItem[] | null;
}

export type DocumentationSection =
  | DocumentationImageGridBlock
  | DocumentationAudioBlock
  | DocumentationVideoBlock;

/* ------------------------------------------------------------------ */
/*  Collections                                                        */
/* ------------------------------------------------------------------ */

export interface PageDocument {
  id: string;
  title: string;
  slug: string;
  layout?: PageLayoutSection[];
  meta?: SeoMeta | null;
  _status?: 'draft' | 'published';
}

export interface ArtworkDocument {
  id: string;
  title: string;
  slug: string;
  medium?: string | null;
  measure?: string | null;
  year?: string | null;
  description?: LexicalRoot | null;
  coverImage?: ImageTransformValue | null;
  documentationSections?: DocumentationSection[];
  meta?: SeoMeta | null;
  _status?: 'draft' | 'published';
}

export interface SeoMeta {
  title?: string | null;
  description?: string | null;
  image?: MediaDocument | null;
}

/* ------------------------------------------------------------------ */
/*  Navigation Global                                                  */
/* ------------------------------------------------------------------ */

export interface NavigationItem {
  label: string;
  document: {
    value: PageDocument | ArtworkDocument;
    relationTo: 'pages' | 'artworks';
  };
}

export interface MainNavigation {
  items?: NavigationItem[] | null;
}
