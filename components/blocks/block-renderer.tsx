import { Stack } from '@kalink-ui/seedly-react';
import { ReactNode } from 'react';

import type { PageBlock } from '@/payload/runtime/types';

import { ArtworkGridBlockComponent } from './blocks/artwork-grid-block';
import { CaptionImageBlockComponent } from './blocks/caption-image-block';
import { FormReferenceBlockComponent } from './blocks/form-reference-block';
import { LinkListBlockComponent } from './blocks/link-list-block';
import { RichTextBlockComponent } from './blocks/rich-text-block';
import { VideoBlockComponent } from './blocks/video-block';

interface BlockRendererProps {
  blocks: PageBlock[] | null | undefined;
  className?: string;
}

/**
 * Replacement for Prismic's SliceZone.
 * Maps each Payload block type to its corresponding React component.
 */
export function BlockRenderer({ blocks, className }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <Stack spacing={8} align="stretch" className={className}>
      {blocks.map((block, index) => (
        <BlockSwitch key={block.id ?? index} block={block} />
      ))}
    </Stack>
  );
}

function BlockSwitch({ block }: { block: PageBlock }): ReactNode {
  switch (block.blockType) {
    case 'richText':
      return <RichTextBlockComponent block={block} />;
    case 'captionImage':
      return <CaptionImageBlockComponent block={block} />;
    case 'video':
      return <VideoBlockComponent block={block} />;
    case 'linkList':
      return <LinkListBlockComponent block={block} />;
    case 'artworkGrid':
      return <ArtworkGridBlockComponent block={block} />;
    case 'formReference':
      return <FormReferenceBlockComponent block={block} />;
    default:
      return null;
  }
}
