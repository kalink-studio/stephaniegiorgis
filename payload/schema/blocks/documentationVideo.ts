import type { Block } from 'payload';

export const documentationVideoBlock: Block = {
  slug: 'docVideo',
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'media',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'ratio',
          type: 'select',
          defaultValue: '16_9',
          required: true,
          options: [
            { label: '16:9', value: '16_9' },
            { label: '4:3', value: '4_3' },
            { label: '1:1', value: '1_1' },
          ],
        },
      ],
    },
  ],
};
