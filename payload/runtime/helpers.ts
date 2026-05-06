import type {
  ArtworkDocument,
  ImageTransformValue,
  MediaDocument,
  MediaRelation,
  NavigationItem,
  PageDocument,
  TransformKey,
  UploadDocument,
} from './types';

/* ------------------------------------------------------------------ */
/*  Document URL resolver                                              */
/* ------------------------------------------------------------------ */

/**
 * Resolve the frontend URL for a Payload document reference.
 *
 * Rules:
 *  - page slug `home`  → `/`
 *  - page slug `x`     → `/${x}`
 *  - artwork slug `y`  → `/artworks/${y}`
 */
export function resolveDocumentUrl(
  doc: { slug: string },
  collection: 'pages' | 'artworks',
): string {
  if (collection === 'artworks') {
    return `/artworks/${doc.slug}`;
  }

  if (doc.slug === 'home') {
    return '/';
  }

  return `/${doc.slug}`;
}

/**
 * Resolve URL from a navigation item's relationship.
 */
export function resolveNavItemUrl(item: NavigationItem): string {
  const { value, relationTo } = item.document;
  return resolveDocumentUrl(value, relationTo);
}

const resolveMediaRelation = (
  value: MediaRelation | ImageTransformValue | null | undefined,
): UploadDocument | null => {
  if (value == null || !isObject(value)) {
    return null;
  }

  if (isImageTransformValue(value)) {
    return resolveMediaRelation(value.source);
  }

  if ('value' in value) {
    return resolveMediaRelation(value.value);
  }

  return isUploadDocument(value) ? value : null;
};

export function getSelectedTransformKey(
  media: ImageTransformValue | null | undefined,
): TransformKey | null {
  return media?.selectedPresetKey ?? null;
}

const resolveTransformMedia = (
  media: MediaDocument | ImageTransformValue | null | undefined,
  transform?: TransformKey,
): UploadDocument | null => {
  if (!media) {
    return null;
  }

  if (isImageTransformValue(media)) {
    if (transform) {
      const derivative = media.presets?.[transform]?.derivative;
      const resolvedDerivative = resolveMediaRelation(derivative);

      if (resolvedDerivative?.url) {
        return resolvedDerivative;
      }

      return resolveMediaRelation(media.source);
    }

    return resolveMediaRelation(media.source);
  }

  return resolveMediaRelation(media);
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isImageTransformValue = (
  value: unknown,
): value is ImageTransformValue => {
  return (
    isObject(value) &&
    ('presets' in value ||
      'selectedPresetKey' in value ||
      ('source' in value && !('id' in value || 'url' in value)))
  );
};

const isUploadDocument = (value: unknown): value is UploadDocument => {
  return (
    isObject(value) &&
    'id' in value &&
    ('url' in value || 'filename' in value || 'mimeType' in value)
  );
};

const toRelativeSameOriginUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const candidateOrigins = new Set<string>();

    if (process.env.PAYLOAD_PUBLIC_SERVER_URL) {
      candidateOrigins.add(
        new URL(process.env.PAYLOAD_PUBLIC_SERVER_URL).origin,
      );
    }

    if (typeof window !== 'undefined' && window.location?.origin) {
      candidateOrigins.add(window.location.origin);
    }

    if (candidateOrigins.has(parsed.origin)) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }

    // When the URL points to localhost/127.0.0.1 with the same port as
    // a known origin, it's the same server accessed via a different
    // interface (e.g. LAN IP vs localhost). Strip it to relative.
    const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

    if (LOCAL_HOSTNAMES.has(parsed.hostname)) {
      if (parsed.pathname.startsWith('/api/')) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }

      for (const origin of candidateOrigins) {
        try {
          const candidate = new URL(origin);

          if (
            parsed.port === candidate.port ||
            (!parsed.port && !candidate.port)
          ) {
            return `${parsed.pathname}${parsed.search}${parsed.hash}`;
          }
        } catch {
          // skip malformed candidate
        }
      }
    }
  } catch {
    return url;
  }

  return url;
};

/* ------------------------------------------------------------------ */
/*  Media / Image helpers                                              */
/* ------------------------------------------------------------------ */

/**
 * Get the URL for a media document, optionally at a specific transform.
 * Falls back to the original URL when no transform matches.
 */
export function getMediaUrl(
  media: MediaDocument | ImageTransformValue | null | undefined,
  transform?: TransformKey,
): string | null {
  const resolved = resolveTransformMedia(media, transform);

  if (!resolved) {
    return null;
  }

  if (transform && resolved.transforms?.[transform]?.url) {
    return toRelativeSameOriginUrl(resolved.transforms[transform].url);
  }

  if (!resolved.url) {
    return null;
  }

  return toRelativeSameOriginUrl(resolved.url);
}

/**
 * Get width/height for a media document, optionally at a specific transform.
 */
export function getMediaDimensions(
  media: MediaDocument | ImageTransformValue | null | undefined,
  transform?: TransformKey,
): { width: number; height: number } | null {
  const resolved = resolveTransformMedia(media, transform);

  if (!resolved) {
    return null;
  }

  if (transform && resolved.transforms?.[transform]) {
    const t = resolved.transforms[transform]!;
    if (t.width && t.height) {
      return { width: t.width, height: t.height };
    }
  }

  if (resolved.width && resolved.height) {
    return { width: resolved.width, height: resolved.height };
  }

  return null;
}

/**
 * Get the alt text for a media document.
 */
export function getMediaAlt(
  media: MediaDocument | ImageTransformValue | null | undefined,
): string {
  const resolved = resolveTransformMedia(media);

  if (!resolved || !('alt' in resolved)) {
    return '';
  }

  return (resolved as { alt?: string | null }).alt ?? '';
}

/* ------------------------------------------------------------------ */
/*  Ratio helpers                                                      */
/* ------------------------------------------------------------------ */

/**
 * Map from Canopy underscore transform keys to CSS-style ratio strings
 * compatible with the existing Frame component.
 */
const TRANSFORM_TO_CSS_RATIO: Record<TransformKey, string> = {
  '1_1': '1:1',
  '2_3': '2:3',
  '3_2': '3:2',
  '4_3': '4:3',
  '16_9': '16:9',
};

/**
 * Convert a Canopy transform key to a Frame-compatible ratio string.
 */
export function transformKeyToRatio(key: TransformKey): string {
  return TRANSFORM_TO_CSS_RATIO[key] ?? key;
}

/**
 * Convert an underscore ratio key to a CSS aspect-ratio value (e.g. "16 / 9").
 */
export function transformKeyToAspectRatio(key: TransformKey): string {
  const parts = key.split('_');
  return `${parts[0]} / ${parts[1]}`;
}

/**
 * Map video ratio stored as underscore keys to slash-based (for MediaPlayer).
 */
export function videoRatioToSlash(
  ratio: '16_9' | '4_3' | '1_1' | null | undefined,
): '16/9' | '4/3' | '1/1' {
  switch (ratio) {
    case '4_3':
      return '4/3';
    case '1_1':
      return '1/1';
    case '16_9':
    default:
      return '16/9';
  }
}

/* ------------------------------------------------------------------ */
/*  Type guards                                                        */
/* ------------------------------------------------------------------ */

export function isPage(
  doc: PageDocument | ArtworkDocument,
): doc is PageDocument {
  return 'layout' in doc;
}

export function isArtwork(
  doc: PageDocument | ArtworkDocument,
): doc is ArtworkDocument {
  return 'medium' in doc || 'coverImage' in doc;
}

/**
 * Check if a media document represents an image based on MIME type.
 */
export function isImageMedia(media: MediaDocument): boolean {
  return media.mimeType?.startsWith('image/') ?? false;
}

/**
 * Check if a media document represents a video based on MIME type.
 */
export function isVideoMedia(media: MediaDocument): boolean {
  return media.mimeType?.startsWith('video/') ?? false;
}

/**
 * Check if a media document represents audio based on MIME type.
 */
export function isAudioMedia(media: MediaDocument): boolean {
  return media.mimeType?.startsWith('audio/') ?? false;
}
