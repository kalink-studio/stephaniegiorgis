import { toPublicMediaUrl } from '../../runtime/helpers.ts';
import { authenticated, anyone } from '../access/index.ts';
import {
  purgeUploadAfterChange,
  purgeUploadAfterDelete,
} from '../utils/publicInvalidation.ts';

import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'filename',
  },
  upload: true,
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (typeof doc.url !== 'string') {
          return doc;
        }

        return {
          ...doc,
          url: toPublicMediaUrl(doc.url, doc),
        };
      },
    ],
    afterChange: [purgeUploadAfterChange],
    afterDelete: [purgeUploadAfterDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
};
