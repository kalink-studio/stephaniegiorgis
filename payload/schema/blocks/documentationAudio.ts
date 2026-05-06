import type { Block } from 'payload';

export const documentationAudioBlock: Block = {
  slug: 'docAudio',
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
      ],
    },
  ],
};
