'use client';

import { Stack } from '@kalink-ui/seedly-react';

import { Frame } from '@/components/frame/frame';
import {
  GalleryLightbox,
  GalleryProvider,
  GalleryTrigger,
} from '@/components/gallery';
import type { GalleryItem } from '@/components/gallery';
import { PayloadImage } from '@/components/image/payload-image';
import { MediaPlayer } from '@/components/media-player';
import {
  getMediaAlt,
  getMediaDimensions,
  getMediaUrl,
  getSelectedTransformKey,
  transformKeyToRatio,
  videoRatioToSlash,
} from '@/payload/runtime';
import type {
  DocumentationImageGridBlock,
  DocumentationSection,
  ImageTransformValue,
  TransformKey,
} from '@/payload/runtime';

import {
  documentationImageFrame,
  documentationImageItem,
  imageRow,
} from './documentation-renderer.css';

interface DocumentationRendererProps {
  sections: DocumentationSection[] | null | undefined;
}

export function DocumentationRenderer({
  sections,
  ...props
}: DocumentationRendererProps &
  Omit<React.ComponentPropsWithoutRef<typeof Stack>, 'children'>) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <Stack spacing={4} {...props}>
      {sections.map((section, sectionIndex) => (
        <DocumentationSectionRenderer
          key={section.id ?? sectionIndex}
          section={section}
        />
      ))}
    </Stack>
  );
}

function DocumentationSectionRenderer({
  section,
}: {
  section: DocumentationSection;
}) {
  switch (section.blockType) {
    case 'docGrid':
      return <ImageGrid section={section} />;
    case 'docAudio':
      return (
        <>
          {section.items?.map((item, index) => {
            const src = getMediaUrl(item.media);

            if (!src) {
              return null;
            }

            return (
              <MediaPlayer
                key={`${section.id ?? 'audio'}-${index}`}
                src={src}
              />
            );
          })}
        </>
      );
    case 'docVideo':
      return (
        <>
          {section.items?.map((item, index) => {
            const src = getMediaUrl(item.media);

            if (!src) {
              return null;
            }

            const posterUrl = getMediaUrl(item.media);
            const poster = posterUrl ? { url: posterUrl } : undefined;

            return (
              <MediaPlayer
                key={`${section.id ?? 'video'}-${index}`}
                src={src}
                poster={poster}
                ratio={videoRatioToSlash(item.ratio)}
              />
            );
          })}
        </>
      );
    default:
      return null;
  }
}

/**
 * Responsive `sizes` for a documentation image that fills the full
 * documentation column slot.
 *
 * - Below 1024 px the column is `100vw − 48px` (Center gutters × 2).
 * - At 1024 px+ the column is half the centered layout minus the
 *   `artworkPage` flex gap (24 px).
 */
const DOC_COLUMN_SIZES =
  '(max-width: 1023px) calc(100vw - 48px), calc((min(1280px, 100vw - 48px) - 24px) / 2)';

/**
 * Responsive `sizes` for a documentation image shown two-up in a row.
 * Derived from `DOC_COLUMN_SIZES` by subtracting the 8 px `imageRow` gap
 * and dividing by two.
 */
const DOC_TWO_UP_SIZES =
  '(max-width: 1023px) calc((100vw - 48px - 8px) / 2), calc(((min(1280px, 100vw - 48px) - 24px) / 2 - 8px) / 2)';

/** Return the appropriate `sizes` string for items in a given row. */
function rowSizes(itemCount: number, isWrapped: boolean): string {
  if (itemCount === 2 && !isWrapped) {
    return DOC_TWO_UP_SIZES;
  }
  return DOC_COLUMN_SIZES;
}

/* ------------------------------------------------------------------ */
/*  Normalise Payload images → GalleryItem[]                           */
/* ------------------------------------------------------------------ */

function toGalleryItems(items: ImageTransformValue[]): GalleryItem[] {
  return items.flatMap((item) => {
    const originalUrl = getMediaUrl(item);
    const dimensions = getMediaDimensions(item);
    const alt = getMediaAlt(item);

    if (!originalUrl) {
      return [];
    }

    return [
      {
        src: originalUrl,
        alt: alt ?? '',
        width: dimensions?.width ?? undefined,
        height: dimensions?.height ?? undefined,
      },
    ];
  });
}

const IMAGE_TRANSFORM_KEYS: TransformKey[] = [
  '2_3',
  '3_2',
  '1_1',
  '4_3',
  '16_9',
];

function getRenderTransformKey(
  item: ImageTransformValue,
): TransformKey | undefined {
  const selectedTransform = getSelectedTransformKey(item);

  if (selectedTransform) {
    return selectedTransform;
  }

  return IMAGE_TRANSFORM_KEYS.find((key) => {
    return item.presets?.[key]?.derivative;
  });
}

/* ------------------------------------------------------------------ */
/*  ImageGrid — wraps all images from a docGrid in one Gallery context */
/* ------------------------------------------------------------------ */

/**
 * Replicates the original Prismic `DocumentationImageWrapper` row-splitting
 * behaviour. The layout string is e.g. "Grid 1/2" — we extract the part
 * after "Grid " and split on "/" to get per-cell counts. Items are consumed
 * into the upper row until we've either placed 2 items or the grid descriptor
 * is exactly "1/2" (special-case: only the first 1 item goes to the upper
 * row). Everything left over goes to the lower row.
 *
 * The `column` CSS variant (flex-wrap) is applied when the first cell count
 * is NOT "2", matching the original `cells[0] !== '2'` check.
 */
function ImageGrid({ section }: { section: DocumentationImageGridBlock }) {
  const gridPart = section.layout.split(' ')[1] ?? '1';
  const cells = gridPart.split('/');
  const items = (section.items ?? [])
    .map((item) => item.image)
    .filter((item): item is ImageTransformValue => Boolean(item));

  const remaining = [...items];
  const upperRow: ImageTransformValue[] = [];

  for (const cell of cells) {
    const count = Number(cell);
    const taken = remaining.splice(0, count);
    upperRow.push(...taken);

    if (upperRow.length === 2 || gridPart === '1/2') {
      break;
    }
  }

  const lowerRow = remaining;
  const isColumn = cells[0] !== '2';

  const upperSizes = rowSizes(upperRow.length, isColumn);
  const lowerSizes = rowSizes(lowerRow.length, false);

  // Build a flat gallery-items array for the lightbox.
  // Order: upper row first, then lower row (matches visual order).
  const galleryItems = toGalleryItems([...upperRow, ...lowerRow]);

  return (
    <Stack spacing={4} align="stretch">
      <GalleryProvider items={galleryItems}>
        <div className={imageRow({ column: isColumn })}>
          {upperRow.map((item, index) => (
            <DocumentationImageEntry
              key={index}
              item={item}
              index={index}
              sizes={upperSizes}
            />
          ))}
        </div>
        {lowerRow.length > 0 && (
          <div className={imageRow()}>
            {lowerRow.map((item, index) => (
              <DocumentationImageEntry
                key={index}
                item={item}
                index={upperRow.length + index}
                sizes={lowerSizes}
              />
            ))}
          </div>
        )}
        <GalleryLightbox />
      </GalleryProvider>
    </Stack>
  );
}

function DocumentationImageEntry({
  item,
  index,
  sizes,
}: {
  item: ImageTransformValue;
  index: number;
  sizes?: string;
}) {
  const selectedTransform = getRenderTransformKey(item);
  const url = getMediaUrl(item, selectedTransform);
  const altText = getMediaAlt(item);
  const alt = altText
    ? `View image: ${altText}`
    : `View documentation image ${index + 1}`;
  const ratio = selectedTransform
    ? (transformKeyToRatio(selectedTransform) as
        | '1:1'
        | '2:3'
        | '3:2'
        | '4:3'
        | '16:9')
    : undefined;

  if (!url) {
    return null;
  }

  return (
    <GalleryTrigger
      index={index}
      className={documentationImageItem}
      ariaLabel={alt}
    >
      <Frame
        use={PayloadImage}
        media={item}
        transform={selectedTransform}
        className={documentationImageFrame}
        ratio={ratio}
        sizes={sizes}
        cover={Boolean(ratio)}
      />
    </GalleryTrigger>
  );
}
