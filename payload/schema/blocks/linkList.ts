import {
  createSingleImageTransformField,
  transformPresets,
} from '../fields/imageTransforms.ts';

import type { Block } from 'payload';

export const linkListBlock: Block = {
  slug: 'linkList',
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
          name: 'link',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
        },
        createSingleImageTransformField({
          name: 'screenshot',
          label: 'Screenshot',
          presets: [transformPresets.square],
        }),
      ],
    },
  ],
};
