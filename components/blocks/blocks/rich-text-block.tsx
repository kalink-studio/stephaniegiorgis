import { Stack } from '@kalink-ui/seedly-react';

import { LexicalRichText } from '@/components/rich-text/lexical-rich-text';
import { richText } from '@/components/rich-text/rich-text.css';
import type { RichTextBlock } from '@/payload/runtime/types';

interface Props {
  block: RichTextBlock;
}

export function RichTextBlockComponent({ block }: Props) {
  return (
    <Stack render={<section />} spacing={6} className={richText}>
      <LexicalRichText content={block.content} />
    </Stack>
  );
}
