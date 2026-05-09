import { notFound } from 'next/navigation';

import { PageLayoutRenderer } from '@/components/blocks';
import { Center } from '@/components/center';
import { getMediaUrl } from '@/payload/runtime';
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

  const imageUrl = getMediaUrl(page.meta?.image);

  return {
    title: page.meta?.title ?? page.title,
    description: page.meta?.description ?? undefined,
    openGraph: {
      title: page.meta?.title ?? page.title,
      images: imageUrl ? [{ url: imageUrl }] : [],
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

  if (slug === 'contact') {
    return (
      <Center render={<main />} gutters={10}>
        <PageLayoutRenderer sections={page.layout} centerSections={false} />
      </Center>
    );
  }

  return (
    <main>
      <PageLayoutRenderer sections={page.layout} />
    </main>
  );
}
