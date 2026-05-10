import { Box, Grid, GridChild, Stack, Text } from '@kalink-ui/seedly-react';

import { Frame } from '@/components/frame/frame';
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
    <Grid minSize="12rem" autoLayout="fill" spacing={8} columns={6}>
      {items.map((item, index) => {
        if (!item.link) {
          return null;
        }

        return (
          <GridChild
            render={
              <a href={item.link} target="_blank" rel="noopener noreferrer" />
            }
            key={item.link ?? index}
          >
            <Box
              variant="solid"
              colorSource="container"
              colorKey="high"
              spacing={6}
              corner="small"
            >
              <Stack align="stretch" spacing={4}>
                {item.screenshot && (
                  <Frame
                    use={PayloadImage}
                    media={item.screenshot}
                    transform="1_1"
                    ratio="1:1"
                    cover
                    sizes="(max-width: 28rem) 100vw, (max-width: 56rem) 50vw, (max-width: 84rem) 33vw, 25rem"
                  />
                )}
                {item.label && <Text>{item.label}</Text>}
              </Stack>
            </Box>
          </GridChild>
        );
      })}
    </Grid>
  );
}
