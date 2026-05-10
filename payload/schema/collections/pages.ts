import { createPreviewUrl } from '../../runtime/preview.ts';
import { authenticated, publishedOrAuthenticated } from '../access/index.ts';
import { pageLayoutField } from '../fields/pageLayout.ts';
import { seoField } from '../fields/seo.ts';
import { getPageRevalidationEntries } from '../utils/publicInvalidation.ts';
import { triggerRevalidation } from '../utils/revalidate.ts';
import { normalizeEmptyRichText } from '../utils/richText.ts';

import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    preview: (doc) => {
      const slug = typeof doc.slug === 'string' ? doc.slug : null;
      return createPreviewUrl({ collection: 'pages', slug });
    },
    livePreview: {
      url: ({ data }) => {
        const slug = typeof data.slug === 'string' ? data.slug : null;
        return createPreviewUrl({ collection: 'pages', slug });
      },
    },
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        return normalizeEmptyRichText(doc) ?? doc;
      },
    ],
    beforeChange: [
      ({ data }) => {
        return normalizeEmptyRichText(data) ?? data;
      },
    ],
    afterChange: [
      async ({ doc, operation, previousDoc }) => {
        await triggerRevalidation(
          getPageRevalidationEntries(
            doc,
            operation === 'update' ? previousDoc : null,
          ),
        );
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await triggerRevalidation(getPageRevalidationEntries(doc));
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    pageLayoutField,
    seoField,
  ],
};
