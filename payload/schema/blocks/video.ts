import {
  createSingleImageTransformField,
  transformPresets,
} from '../fields/imageTransforms.ts';

import type { Block } from 'payload';

export const videoBlock: Block = {
  slug: 'video',
  fields: [
    createSingleImageTransformField({
      name: 'poster',
      label: 'Poster',
      presets: [
        transformPresets.square,
        transformPresets.classic,
        transformPresets.widescreen,
      ],
    }),
    {
      name: 'av1File',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'h264File',
      type: 'relationship',
      relationTo: 'media',
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
    {
      name: 'maxWidth',
      type: 'text',
    },
  ],
};
