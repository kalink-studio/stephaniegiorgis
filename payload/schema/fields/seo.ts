import type { Field } from 'payload';

export const seoField: Field = {
  name: 'meta',
  label: 'SEO',
  type: 'group',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
    },
  ],
};
