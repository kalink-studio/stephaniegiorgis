import { createPreviewUrl, resolveArtworkPath } from '../../runtime/preview.ts';
import { authenticated, publishedOrAuthenticated } from '../access/index.ts';
import { documentationAudioBlock } from '../blocks/documentationAudio.ts';
import { documentationImageGridBlock } from '../blocks/documentationImageGrid.ts';
import { normalizeDocumentationSections } from '../blocks/documentationShared.ts';
import { documentationVideoBlock } from '../blocks/documentationVideo.ts';
import {
  createSingleImageTransformField,
  transformPresets,
} from '../fields/imageTransforms.ts';
import { seoField } from '../fields/seo.ts';
import { triggerRevalidation } from '../utils/revalidate.ts';

import type { CollectionConfig } from 'payload';

export const Artworks: CollectionConfig = {
  slug: 'artworks',
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'year', '_status', 'updatedAt'],
    preview: (doc) => {
      const slug = typeof doc.slug === 'string' ? doc.slug : null;
      return createPreviewUrl({ collection: 'artworks', slug });
    },
    livePreview: {
      url: ({ data }) => {
        const slug = typeof data.slug === 'string' ? data.slug : null;
        return createPreviewUrl({ collection: 'artworks', slug });
      },
    },
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data || typeof data !== 'object') {
          return data;
        }

        return {
          ...data,
          documentationSections: normalizeDocumentationSections(
            data.documentationSections,
          ),
        };
      },
    ],
    afterChange: [
      async ({ doc }) => {
        await triggerRevalidation([
          { path: '/artworks' },
          { path: resolveArtworkPath(doc.slug) },
        ]);
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await triggerRevalidation([
          { path: '/artworks' },
          { path: resolveArtworkPath(doc.slug) },
        ]);
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
    {
      name: 'medium',
      type: 'text',
    },
    {
      name: 'measure',
      type: 'text',
    },
    {
      name: 'year',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
    },
    createSingleImageTransformField({
      name: 'coverImage',
      label: 'Cover image',
      presets: [transformPresets.square],
      mode: 'selectable',
    }),
    {
      name: 'documentationSections',
      type: 'blocks',
      blocks: [
        documentationImageGridBlock,
        documentationAudioBlock,
        documentationVideoBlock,
      ],
    },
    seoField,
  ],
};
