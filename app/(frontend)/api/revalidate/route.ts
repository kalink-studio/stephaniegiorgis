import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  if (body.secret !== process.env.REVALIDATE_SECRET) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  const entries = Array.isArray(body.entries) ? body.entries : [];

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

  return NextResponse.json({
    revalidated: true,
    count: entries.length,
    now: Date.now(),
  });
}
