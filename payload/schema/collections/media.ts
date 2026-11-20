import { authenticated, anyone } from '../access/index.ts';
import {
  purgeUploadAfterChange,
  purgeUploadAfterDelete,
} from '../utils/publicInvalidation.ts';
import { publicMediaUrlAfterRead } from '../utils/publicMediaUrl.ts';

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
    afterRead: [publicMediaUrlAfterRead],
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
