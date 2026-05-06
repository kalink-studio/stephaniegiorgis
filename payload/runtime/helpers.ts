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

const DEFAULT_S3_PUBLIC_ENDPOINT = 'https://s3.pub2.infomaniak.cloud';
const DEFAULT_PRODUCTION_MEDIA_ORIGIN = 'https://media.stephaniegiorgis.ch';
const DEFAULT_STAGING_MEDIA_ORIGIN =
  'https://media.staging.stephaniegiorgis.ch';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const normalizeOrigin = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return trimTrailingSlash(value);
  }
};

const getRuntimeHostname = () => {
  if (process.env.PAYLOAD_PUBLIC_SERVER_URL) {
    try {
      return new URL(process.env.PAYLOAD_PUBLIC_SERVER_URL).hostname;
    } catch {
      // fall through
    }
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    return window.location.hostname;
  }

  return null;
};

export const getPublicMediaOrigin = () => {
  const explicitOrigin = normalizeOrigin(process.env.PUBLIC_MEDIA_ORIGIN);

  if (explicitOrigin) {
    return explicitOrigin;
  }

  const runtimeHostname = getRuntimeHostname();

  if (runtimeHostname === 'staging.stephaniegiorgis.ch') {
    return (
      normalizeOrigin(process.env.PUBLIC_MEDIA_ORIGIN_STAGING) ??
      DEFAULT_STAGING_MEDIA_ORIGIN
    );
  }

  if (
    runtimeHostname === 'www.stephaniegiorgis.ch' ||
    runtimeHostname === 'stephaniegiorgis.ch'
  ) {
    return (
      normalizeOrigin(process.env.PUBLIC_MEDIA_ORIGIN_PRODUCTION) ??
      DEFAULT_PRODUCTION_MEDIA_ORIGIN
    );
  }

  return null;
};

const getS3PublicEndpoint = () => {
  return (
    normalizeOrigin(process.env.S3_PUBLIC_ENDPOINT) ??
    normalizeOrigin(process.env.S3_ENDPOINT) ??
    DEFAULT_S3_PUBLIC_ENDPOINT
  );
};

const isMediaPath = (pathname: string) => {
  return (
    pathname === '/media' ||
    pathname.startsWith('/media/') ||
    pathname === '/derivatives' ||
    pathname.startsWith('/derivatives/')
  );
};

const getUploadPathFromS3Path = (pathname: string) => {
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  const bucket = process.env.S3_BUCKET;
  const bucketlessParts =
    bucket && parts[0] === bucket ? parts.slice(1) : parts;

  const directPath = `/${bucketlessParts.join('/')}`;

  if (isMediaPath(directPath)) {
    return directPath;
  }

  const mediaIndex = parts.findIndex(
    (part) => part === 'media' || part === 'derivatives',
  );

  if (mediaIndex >= 0) {
    return `/${parts.slice(mediaIndex).join('/')}`;
  }

  return null;
};

const getUploadVersion = (media?: Partial<UploadDocument> | null) => {
  if (!media) {
    return null;
  }

  const metadata = media as Record<string, unknown>;

  for (const key of ['sourceVersion', 'fingerprint', 'updatedAt']) {
    const value = metadata[key];

    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return null;
};

export function toPublicMediaUrl(
  url: string,
  media?: Partial<UploadDocument> | null,
): string {
  const publicMediaOrigin = getPublicMediaOrigin();

  if (!publicMediaOrigin) {
    return toRelativeSameOriginUrl(url);
  }

  let parsed: URL;

  try {
    parsed = new URL(url, publicMediaOrigin);
  } catch {
    return url;
  }

  let uploadPath: string | null = null;

  if (isMediaPath(parsed.pathname)) {
    uploadPath = parsed.pathname;
  } else {
    const s3PublicEndpoint = getS3PublicEndpoint();

    if (parsed.origin === s3PublicEndpoint) {
      uploadPath = getUploadPathFromS3Path(parsed.pathname);
    }
  }

  if (!uploadPath) {
    return toRelativeSameOriginUrl(url);
  }

  const publicUrl = new URL(uploadPath, publicMediaOrigin);
  publicUrl.search = parsed.search;
  publicUrl.hash = parsed.hash;

  const version = getUploadVersion(media);

  if (version) {
    publicUrl.searchParams.set('v', version);
  }

  return publicUrl.toString();
}

export function getMediaPurgeUrls(
  media: Partial<UploadDocument> | null | undefined,
): string[] {
  if (!media?.url) {
    return [];
  }

  const unversionedUrl = toPublicMediaUrl(media.url);

  try {
    const parsed = new URL(unversionedUrl);
    parsed.searchParams.delete('v');

    return Array.from(
      new Set([parsed.toString(), toPublicMediaUrl(media.url, media)]),
    );
  } catch {
    return Array.from(
      new Set([unversionedUrl, toPublicMediaUrl(media.url, media)]),
    );
  }
}

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
    return toPublicMediaUrl(resolved.transforms[transform].url, resolved);
  }

  if (!resolved.url) {
    return null;
  }

  return toPublicMediaUrl(resolved.url, resolved);
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
