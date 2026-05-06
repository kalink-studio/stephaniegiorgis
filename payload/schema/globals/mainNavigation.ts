import { authenticated, anyone } from '../access/index.ts';
import { triggerRevalidation } from '../utils/revalidate.ts';

import type { GlobalConfig } from 'payload';

export const MainNavigation: GlobalConfig = {
  slug: 'mainNavigation',
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        await triggerRevalidation([{ path: '/(frontend)', type: 'layout' }]);
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'document',
          type: 'relationship',
          relationTo: ['pages', 'artworks'],
          required: true,
        },
      ],
    },
  ],
};
