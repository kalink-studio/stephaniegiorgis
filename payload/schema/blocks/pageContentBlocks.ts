import { artworkGridBlock } from './artworkGrid.ts';
import { captionImageBlock } from './captionImage.ts';
import { formReferenceBlock } from './formReference.ts';
import { linkListBlock } from './linkList.ts';
import { richTextBlock } from './richText.ts';
import { videoBlock } from './video.ts';

import type { Block } from 'payload';

export const oneColumnPageBlocks: Block[] = [
  richTextBlock,
  captionImageBlock,
  videoBlock,
  linkListBlock,
  artworkGridBlock,
  formReferenceBlock,
];

export const twoColumnPageBlocks: Block[] = [
  richTextBlock,
  captionImageBlock,
  videoBlock,
  linkListBlock,
  formReferenceBlock,
];
