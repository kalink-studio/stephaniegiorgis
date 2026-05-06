import {
  createSingleImageTransformField,
  transformPresets,
} from '../fields/imageTransforms.ts';

import type { Block } from 'payload';

export const captionImageBlock: Block = {
  slug: 'captionImage',
  fields: [
    createSingleImageTransformField({
      name: 'image',
      label: 'Image',
      mode: 'selectable',
      presets: [
        transformPresets.square,
        transformPresets.classic,
        transformPresets.portrait,
        transformPresets.landscape,
      ],
      required: true,
    }),
    {
      name: 'caption',
      type: 'richText',
    },
  ],
};
