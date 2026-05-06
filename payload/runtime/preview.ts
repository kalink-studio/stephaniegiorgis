export const resolvePagePath = (slug?: string | null) => {
  if (!slug || slug === 'home') {
    return '/';
  }

  if (slug === 'artworks') {
    return '/artworks';
  }

  return `/${slug}`;
};

export const resolveArtworkPath = (slug?: string | null) => {
  if (!slug) {
    return '/artworks';
  }

  return `/artworks/${slug}`;
};

export type PreviewCollection = 'artworks' | 'pages';

export const getPreviewSecret = () => {
  return process.env.PREVIEW_SECRET || process.env.PAYLOAD_SECRET || '';
};

export const isPreviewCollection = (
  collection?: string | null,
): collection is PreviewCollection => {
  return collection === 'pages' || collection === 'artworks';
};

export const resolvePreviewPath = (
  collection: PreviewCollection,
  slug?: string | null,
) => {
  if (collection === 'artworks') {
    return resolveArtworkPath(slug);
  }

  return resolvePagePath(slug);
};

interface CreatePreviewUrlArgs {
  collection: PreviewCollection;
  slug?: string | null;
}

export const createPreviewUrl = ({
  collection,
  slug,
}: CreatePreviewUrlArgs) => {
  if (!slug) {
    return null;
  }

  const previewSecret = getPreviewSecret();

  if (!previewSecret) {
    return null;
  }

  const searchParams = new URLSearchParams({
    collection,
    slug,
    path: resolvePreviewPath(collection, slug),
    previewSecret,
  });

  return `/api/preview?${searchParams.toString()}`;
};
