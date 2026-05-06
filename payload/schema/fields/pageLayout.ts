import {
  oneColumnPageBlocks,
  twoColumnPageBlocks,
} from '../blocks/pageContentBlocks.ts';

import type { Field } from 'payload';

export const pageLayoutWidths = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Full', value: 'full' },
] as const;

export const pageLayoutRatios = [
  { label: '1:1', value: '1_1' },
  { label: '3:2', value: '3_2' },
  { label: '2:3', value: '2_3' },
] as const;

interface LayoutSectionSiblingData {
  columns?: 'one' | 'two';
}

const showWhenTwoColumns = (
  _: unknown,
  siblingData: LayoutSectionSiblingData,
) => siblingData.columns === 'two';

const showWhenOneColumn = (_: unknown, siblingData: LayoutSectionSiblingData) =>
  siblingData.columns !== 'two';

export const pageLayoutField: Field = {
  name: 'layout',
  type: 'array',
  admin: {
    description: 'Build the page with one- or two-column layout sections.',
  },
  fields: [
    {
      name: 'width',
      type: 'select',
      defaultValue: 'large',
      required: true,
      options: pageLayoutWidths.map((option) => ({ ...option })),
      admin: {
        description: 'Controls the centered max inline size of this section.',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: 'one',
      required: true,
      options: [
        { label: '1 column', value: 'one' },
        { label: '2 columns', value: 'two' },
      ],
    },
    {
      name: 'blocks',
      label: 'Blocks',
      type: 'blocks',
      minRows: 1,
      blocks: oneColumnPageBlocks,
      admin: {
        condition: showWhenOneColumn,
        description:
          'Available in single-column sections. Includes the artwork grid.',
      },
    },
    {
      name: 'ratio',
      type: 'select',
      defaultValue: '1_1',
      options: pageLayoutRatios.map((option) => ({ ...option })),
      admin: {
        condition: showWhenTwoColumns,
        description:
          'Controls the width balance between the primary and secondary columns.',
      },
    },
    {
      name: 'primaryBlocks',
      label: 'Primary column blocks',
      type: 'blocks',
      minRows: 1,
      blocks: twoColumnPageBlocks,
      admin: {
        condition: showWhenTwoColumns,
      },
    },
    {
      name: 'secondaryBlocks',
      label: 'Secondary column blocks',
      type: 'blocks',
      blocks: twoColumnPageBlocks,
      admin: {
        condition: showWhenTwoColumns,
      },
    },
  ],
};
