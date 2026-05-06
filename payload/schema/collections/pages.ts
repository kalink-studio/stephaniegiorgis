import { createPreviewUrl, resolvePagePath } from '../../runtime/preview.ts';
import { authenticated, publishedOrAuthenticated } from '../access/index.ts';
import { pageLayoutField } from '../fields/pageLayout.ts';
import { seoField } from '../fields/seo.ts';
import { triggerRevalidation } from '../utils/revalidate.ts';

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
    afterChange: [
      async ({ doc }) => {
        await triggerRevalidation([{ path: resolvePagePath(doc.slug) }]);
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await triggerRevalidation([{ path: resolvePagePath(doc.slug) }]);
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
