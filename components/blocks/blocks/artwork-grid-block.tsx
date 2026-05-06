import { Grid, GridChild } from '@kalink-ui/seedly-react';
import Link from 'next/link';

import { Frame } from '@/components/frame/frame';
import { PayloadImage } from '@/components/image/payload-image';
import type { ArtworkGridBlock } from '@/payload/runtime/types';

interface Props {
  block: ArtworkGridBlock;
}

export function ArtworkGridBlockComponent({ block }: Props) {
  const items = [...block.items].reverse();

  return (
    <Grid minSize="12rem" autoLayout="fill" spacing={8} columns={6}>
      {items.map(({ artwork }) => {
        if (!artwork?.coverImage) {
          return null;
        }

        return (
          <GridChild
            key={artwork.id}
            render={<Link href={`/artworks/${artwork.slug}`} />}
          >
            <Frame
              use={PayloadImage}
              media={artwork.coverImage}
              transform="1_1"
              ratio="1:1"
              cover
              sizes="(max-width: 28rem) 100vw, (max-width: 56rem) 50vw, (max-width: 84rem) 33vw, 25rem"
            />
          </GridChild>
        );
      })}
    </Grid>
  );
}
