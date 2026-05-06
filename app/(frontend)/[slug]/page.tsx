import { notFound } from 'next/navigation';

import { PageLayoutRenderer } from '@/components/blocks';
import { getPageBySlug } from '@/payload/runtime/queries';

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
  const page = await getPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.meta?.title ?? page.title,
    description: page.meta?.description ?? undefined,
    openGraph: {
      title: page.meta?.title ?? page.title,
      images: page.meta?.image?.url ? [{ url: page.meta.image.url }] : [],
    },
  };
}

export default async function StandardPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <PageLayoutRenderer sections={page.layout} />
    </main>
  );
}
