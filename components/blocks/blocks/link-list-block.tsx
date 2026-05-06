import { Box, Cluster, Stack, Text } from '@kalink-ui/seedly-react';

import { PayloadImage } from '@/components/image/payload-image';
import type { LinkListBlock } from '@/payload/runtime/types';

interface Props {
  block: LinkListBlock;
}

export function LinkListBlockComponent({ block }: Props) {
  const items = block.items ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <Cluster spacing={6} justify="center">
      {items.map((item, index) => {
        if (!item.link) {
          return null;
        }

        return (
          <Box
            render={
              <a href={item.link} target="_blank" rel="noopener noreferrer" />
            }
            key={item.link ?? index}
            variant="solid"
            colorSource="container"
            colorKey="high"
            spacing={6}
            corner="small"
          >
            <Stack align="stretch" spacing={4}>
              {item.screenshot && (
                <PayloadImage media={item.screenshot} transform="1_1" />
              )}
              {item.label && <Text>{item.label}</Text>}
            </Stack>
          </Box>
        );
      })}
    </Cluster>
  );
}
