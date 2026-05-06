import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { purgeCloudflareUrls } from '@/payload/schema/utils/cloudflare';

export async function POST(request: Request) {
  const body = await request.json();

  if (body.secret !== process.env.REVALIDATE_SECRET) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  const entries = Array.isArray(body.entries) ? body.entries : [];
  const purgeUrls = Array.isArray(body.purgeUrls) ? body.purgeUrls : [];

  for (const entry of entries) {
    if (!entry?.path || typeof entry.path !== 'string') {
      continue;
    }

    if (entry.type === 'layout' || entry.type === 'page') {
      revalidatePath(entry.path, entry.type);
      continue;
    }

    revalidatePath(entry.path);
  }

  const purge = await purgeCloudflareUrls(purgeUrls);

  return NextResponse.json({
    purge,
    revalidated: true,
    count: entries.length,
    now: Date.now(),
  });
}
