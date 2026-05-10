import { Stack } from '@kalink-ui/seedly-react';

import { Frame } from '@/components/frame/frame';
import { PayloadImage } from '@/components/image/payload-image';
import { LexicalRichText } from '@/components/rich-text/lexical-rich-text';
import {
  getSelectedTransformKey,
  transformKeyToRatio,
} from '@/payload/runtime/helpers';
import type { CaptionImageBlock } from '@/payload/runtime/types';

interface Props {
  block: CaptionImageBlock;
  sizes?: string;
}

export function CaptionImageBlockComponent({ block, sizes }: Props) {
  const selectedTransform = getSelectedTransformKey(block.image) ?? undefined;

  return (
    <Stack render={<section />} spacing={3} align="stretch">
      {!selectedTransform ? (
        <PayloadImage media={block.image} sizes={sizes} />
      ) : (
        <Frame
          use={PayloadImage}
          media={block.image}
          transform={selectedTransform}
          ratio={
            transformKeyToRatio(selectedTransform) as
              | '1:1'
              | '2:3'
              | '3:2'
              | '4:3'
              | '16:9'
          }
          cover
          sizes={sizes}
        />
      )}
      {block.caption && <LexicalRichText content={block.caption} />}
    </Stack>
  );
}
