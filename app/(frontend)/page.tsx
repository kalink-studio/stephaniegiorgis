import { notFound } from 'next/navigation';

import { PageLayoutRenderer } from '@/components/blocks';
import { getPageBySlug } from '@/payload/runtime/queries';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default async function Homepage() {
  const page = await getPageBySlug('home');

  if (!page) {
    notFound();
  }

  return (
    <main>
      <PageLayoutRenderer sections={page.layout} />
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home');

  return {
    title: page?.meta?.title ?? 'Stéphanie Giorgis',
    description: page?.meta?.description ?? undefined,
  };
}
