import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { getPayload, type PayloadRequest } from 'payload';

import config from '@payload-config';

import {
  getPreviewSecret,
  isPreviewCollection,
  resolvePreviewPath,
} from '@/payload/runtime/preview';

export async function GET(request: NextRequest): Promise<Response> {
  const payload = await getPayload({ config });
  const { searchParams } = new URL(request.url);
  const secret =
    searchParams.get('previewSecret') || searchParams.get('secret');
  const collection = searchParams.get('collection');
  const slug = searchParams.get('slug');
  const path = searchParams.get('path');

  if (secret !== getPreviewSecret()) {
    return new Response('You are not allowed to preview this page', {
      status: 403,
    });
  }

  if (!isPreviewCollection(collection)) {
    return new Response('Invalid preview collection', { status: 404 });
  }

  const resolvedPath = path || resolvePreviewPath(collection, slug);

  if (!resolvedPath.startsWith('/')) {
    return new Response(
      'This endpoint can only be used for relative previews',
      {
        status: 500,
      },
    );
  }

  let authResult;

  try {
    authResult = await payload.auth({
      headers: request.headers,
      req: request as unknown as Omit<PayloadRequest, 'user'>,
    });
  } catch (error) {
    payload.logger.error({ err: error }, 'Error verifying preview session');

    return new Response('You are not allowed to preview this page', {
      status: 403,
    });
  }

  const draft = await draftMode();

  if (!authResult.user) {
    draft.disable();

    return new Response('You are not allowed to preview this page', {
      status: 403,
    });
  }

  draft.enable();

  redirect(resolvedPath);
}
