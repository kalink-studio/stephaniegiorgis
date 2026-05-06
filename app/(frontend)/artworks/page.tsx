import { notFound } from 'next/navigation';

import { PageLayoutRenderer } from '@/components/blocks';
import { getPageBySlug } from '@/payload/runtime/queries';

import { mainStack } from './page.css';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default async function ArtworksPage() {
  const page = await getPageBySlug('artworks');

  if (!page) {
    notFound();
  }

  return (
    <div className={mainStack}>
      <PageLayoutRenderer sections={page.layout} centerSections={false} />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('artworks');

  return {
    title: page?.meta?.title ?? 'Artworks',
    description: page?.meta?.description ?? undefined,
  };
}
