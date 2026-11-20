import { toPublicMediaUrl } from '../../runtime/helpers.ts';

import type { CollectionAfterReadHook } from 'payload';

/**
 * Rewrite an upload's `url` to its public media host on the server, so client
 * components receive media-host URLs instead of resolving them in the browser.
 */
export const publicMediaUrlAfterRead: CollectionAfterReadHook = ({ doc }) => {
  if (typeof doc?.url !== 'string') {
    return doc;
  }

  return {
    ...doc,
    url: toPublicMediaUrl(doc.url, doc),
  };
};
