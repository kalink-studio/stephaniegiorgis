import { getMediaPurgeUrls } from '../../runtime/helpers.ts';
import { resolveArtworkPath, resolvePagePath } from '../../runtime/preview.ts';

import { triggerRevalidation, type RevalidateEntry } from './revalidate.ts';

import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload';

interface PublicDocument {
  _status?: 'draft' | 'published' | null;
  slug?: string | null;
}

const isPublicDocument = (doc: PublicDocument | null | undefined) => {
  return Boolean(doc) && (doc?._status === 'published' || !doc?._status);
};

const uniqueEntries = (entries: RevalidateEntry[]) => {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    const key = `${entry.type ?? 'path'}:${entry.path}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const getPageRevalidationEntries = (
  doc: PublicDocument,
  previousDoc?: PublicDocument | null,
) => {
  if (!isPublicDocument(doc) && !isPublicDocument(previousDoc)) {
    return [];
  }

  return uniqueEntries(
    [previousDoc?.slug, doc.slug]
      .filter((slug): slug is string => typeof slug === 'string')
      .map((slug) => ({ path: resolvePagePath(slug) })),
  );
};

export const getArtworkRevalidationEntries = (
  doc: PublicDocument,
  previousDoc?: PublicDocument | null,
) => {
  if (!isPublicDocument(doc) && !isPublicDocument(previousDoc)) {
    return [];
  }

  return uniqueEntries([
    { path: '/artworks' },
    ...[previousDoc?.slug, doc.slug]
      .filter((slug): slug is string => typeof slug === 'string')
      .map((slug) => ({ path: resolveArtworkPath(slug) })),
  ]);
};

const getUploadPurgeUrls = (
  ...docs: (Record<string, unknown> | null | undefined)[]
) => {
  return Array.from(
    new Set(docs.flatMap((doc) => getMediaPurgeUrls(doc ?? null))),
  );
};

export const purgeUploadAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
}) => {
  await triggerRevalidation({
    purgeUrls: getUploadPurgeUrls(previousDoc, doc),
  });

  return doc;
};

export const purgeUploadAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
}) => {
  await triggerRevalidation({
    purgeUrls: getUploadPurgeUrls(doc),
  });

  return doc;
};
