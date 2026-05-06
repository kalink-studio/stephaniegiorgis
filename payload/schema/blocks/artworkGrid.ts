import type { Block } from 'payload';

export const artworkGridBlock: Block = {
  slug: 'artworkGrid',
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      admin: {
        description: 'Drag to reorder artworks.',
      },
      fields: [
        {
          name: 'artwork',
          type: 'relationship',
          relationTo: 'artworks',
          required: true,
        },
      ],
    },
  ],
};
