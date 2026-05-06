import { draftMode } from 'next/headers';

import type { ArtworkDocument, MainNavigation, PageDocument } from './types';

/* ------------------------------------------------------------------ */
/*  Base helper – thin wrapper around the Payload Local API            */
/* ------------------------------------------------------------------ */

/**
 * Get the Payload Local API client.
 *
 * This lazily imports the generated Payload config and caches the instance
 * for the duration of the request via the Node.js module cache + React cache.
 *
 * NOTE: this assumes `payload` and `@payloadcms/next` are installed and
 * the Payload config at `payload.config.ts` has been wired up. Until that
 * happens, calls will throw at runtime – that is expected during frontend-
 * only scaffolding.
 */
async function getPayload() {
  // Dynamic import so the module is only loaded on the server.
  const { getPayload: getPayloadInstance } = await import('payload');
  const configPromise = (await import('@payload-config')).default;
  return getPayloadInstance({ config: configPromise });
}

async function getDraftState() {
  const { isEnabled } = await draftMode();

  return {
    draft: isEnabled,
    overrideAccess: isEnabled,
  };
}

/* ------------------------------------------------------------------ */
/*  Pages                                                              */
/* ------------------------------------------------------------------ */

export async function getPageBySlug(
  slug: string,
): Promise<PageDocument | null> {
  const payload = await getPayload();
  const draftState = await getDraftState();

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    pagination: false,
    ...draftState,
  });

  return (docs[0] as unknown as PageDocument) ?? null;
}

export async function getAllPages(): Promise<PageDocument[]> {
  const payload = await getPayload();
  const draftState = await getDraftState();

  const { docs } = await payload.find({
    collection: 'pages',
    limit: 300,
    depth: 0,
    pagination: false,
    ...draftState,
  });

  return docs as unknown as PageDocument[];
}

/* ------------------------------------------------------------------ */
/*  Artworks                                                           */
/* ------------------------------------------------------------------ */

export async function getArtworkBySlug(
  slug: string,
): Promise<ArtworkDocument | null> {
  const payload = await getPayload();
  const draftState = await getDraftState();

  const { docs } = await payload.find({
    collection: 'artworks',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    pagination: false,
    ...draftState,
  });

  return (docs[0] as unknown as ArtworkDocument) ?? null;
}

export async function getAllArtworks(): Promise<ArtworkDocument[]> {
  const payload = await getPayload();
  const draftState = await getDraftState();

  const { docs } = await payload.find({
    collection: 'artworks',
    limit: 300,
    depth: 0,
    pagination: false,
    ...draftState,
  });

  return docs as unknown as ArtworkDocument[];
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

export async function getMainNavigation(): Promise<MainNavigation> {
  const payload = await getPayload();
  const draftState = await getDraftState();

  const nav = await payload.findGlobal({
    slug: 'mainNavigation',
    depth: 1,
    ...draftState,
  });

  return nav as unknown as MainNavigation;
}
