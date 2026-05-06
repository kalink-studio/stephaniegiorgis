import {
  createSingleImageTransformField,
  transformPresets,
} from '../fields/imageTransforms.ts';

import {
  getDocumentationGridImageCount,
  documentationGridLayouts,
} from './documentationShared.ts';

import type { Block, Validate } from 'payload';

interface DocumentationGridSiblingData {
  layout?: (typeof documentationGridLayouts)[number]['value'];
}

const validateDocumentationGridItems: Validate<
  unknown[],
  unknown,
  DocumentationGridSiblingData
> = (value, { siblingData }) => {
  const layout = siblingData.layout;

  if (!layout) {
    return 'Layout is required.';
  }

  const expectedCount = getDocumentationGridImageCount(layout);
  const itemCount = Array.isArray(value) ? value.length : 0;

  if (itemCount !== expectedCount) {
    return `Add exactly ${expectedCount} image${expectedCount === 1 ? '' : 's'} for ${layout}.`;
  }

  for (const item of value ?? []) {
    if (
      !item ||
      typeof item !== 'object' ||
      !('image' in item) ||
      !item.image
    ) {
      return 'Each image row requires an image transform.';
    }
  }

  return true;
};

export const documentationImageGridBlock: Block = {
  slug: 'docGrid',
  fields: [
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'Grid 1/1',
      options: documentationGridLayouts.map((layout) => ({ ...layout })),
    },
    {
      name: 'items',
      type: 'array',
      minRows: 0,
      maxRows: 4,
      validate: validateDocumentationGridItems,
      admin: {
        description:
          'Add the exact number of image rows required by the selected layout.',
      },
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
      ],
    },
  ],
};
