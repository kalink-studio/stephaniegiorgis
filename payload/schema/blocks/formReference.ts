import type { Block } from 'payload';

export const formReferenceBlock: Block = {
  slug: 'formReference',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'intro',
      type: 'richText',
    },
  ],
};
