import { Box, Cover, Heading, Stack, Text } from '@kalink-ui/seedly-react';
import { notFound } from 'next/navigation';

import { DocumentationRenderer } from '@/components/documentation';
import { Hidden } from '@/components/hidden';
import { LexicalRichText } from '@/components/rich-text/lexical-rich-text';
import { getArtworkBySlug } from '@/payload/runtime/queries';

import { artworkPage, artworkData, artworkDescription } from './page.css';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Params {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    return {};
  }

  return {
    title: artwork.meta?.title ?? artwork.title,
    description: artwork.meta?.description ?? undefined,
    openGraph: {
      title: artwork.meta?.title ?? artwork.title,
      images: artwork.meta?.image?.url ? [{ url: artwork.meta.image.url }] : [],
    },
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  return (
    <div className={artworkPage}>
      <Cover>
        <Box data-cover-center className={artworkData}>
          <Stack spacing={8} align="stretch">
            <Heading.Root
              variant="display"
              size="small"
              style={{ fontStyle: 'italic' }}
            >
              {artwork.title}
            </Heading.Root>
            <Stack spacing={8} align="stretch">
              {artwork.medium && (
                <Text variant="headline" size="small">
                  {artwork.medium}
                </Text>
              )}
              {artwork.measure && (
                <Text variant="headline" size="small">
                  {artwork.measure}
                </Text>
              )}
              {artwork.year && (
                <Text variant="headline" size="small">
                  {artwork.year}
                </Text>
              )}
            </Stack>
            <Hidden
              use={DocumentationRenderer}
              at="lgUp"
              useCss
              sections={artwork.documentationSections}
            />
          </Stack>
          {artwork.description && (
            <Box spacing={0} className={artworkDescription}>
              <Stack>
                <LexicalRichText content={artwork.description} />
              </Stack>
            </Box>
          )}
        </Box>
      </Cover>
      <Hidden
        use={DocumentationRenderer}
        at="mdDown"
        useCss
        sections={artwork.documentationSections}
      />
    </div>
  );
}
