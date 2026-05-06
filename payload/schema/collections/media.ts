import { authenticated, anyone } from '../access/index.ts';

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
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
};
