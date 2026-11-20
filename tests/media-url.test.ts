import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getMediaPurgeUrls,
  getMediaUrl,
  toPublicMediaUrl,
} from '../payload/runtime/helpers.ts';
import { getPayloadServerURL } from '../payload/runtime/serverUrl.ts';
import { publicMediaUrlAfterRead } from '../payload/schema/utils/publicMediaUrl.ts';

const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_WINDOW = Object.getOwnPropertyDescriptor(globalThis, 'window');

test.afterEach(() => {
  process.env = { ...ORIGINAL_ENV };

  if (ORIGINAL_WINDOW) {
    Object.defineProperty(globalThis, 'window', ORIGINAL_WINDOW);
  } else {
    Reflect.deleteProperty(globalThis, 'window');
  }
});

// Browser bundles only see NODE_ENV; server-only variables are undefined.
const simulateBrowser = (origin: string) => {
  process.env = { NODE_ENV: 'production' };
  Reflect.set(globalThis, 'window', {
    location: { origin, hostname: new URL(origin).hostname },
  });
};

test('toPublicMediaUrl rewrites Infomaniak S3 media URLs to the configured media host', () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://www.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_PRODUCTION =
    'https://media.stephaniegiorgis.ch';
  process.env.S3_PUBLIC_ENDPOINT = 'https://s3.pub2.infomaniak.cloud';
  process.env.S3_BUCKET = 'stephaniegiorgis-production';

  assert.equal(
    toPublicMediaUrl(
      'https://s3.pub2.infomaniak.cloud/stephaniegiorgis-production/media/example.jpg',
      {
        id: 1,
        updatedAt: '2026-05-06T10:00:00.000Z',
      },
    ),
    'https://media.stephaniegiorgis.ch/media/example.jpg?v=2026-05-06T10%3A00%3A00.000Z',
  );
});

test('toPublicMediaUrl leaves unrelated absolute URLs unchanged', () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://www.stephaniegiorgis.ch';

  assert.equal(
    toPublicMediaUrl('https://example.com/image.jpg'),
    'https://example.com/image.jpg',
  );
});

test('toPublicMediaUrl rewrites Payload derivative file URLs to the staging media host', () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://staging.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_STAGING =
    'https://staging-media.stephaniegiorgis.ch';

  assert.equal(
    toPublicMediaUrl('/api/derivatives/file/crop.jpg', {
      id: 1,
      updatedAt: '2026-05-06T10:00:00.000Z',
    }),
    'https://staging-media.stephaniegiorgis.ch/derivatives/crop.jpg?v=2026-05-06T10%3A00%3A00.000Z',
  );
});

test('toPublicMediaUrl infers production media host from production bucket', () => {
  delete process.env.PAYLOAD_PUBLIC_SERVER_URL;
  process.env.PUBLIC_MEDIA_ORIGIN_PRODUCTION =
    'https://media.stephaniegiorgis.ch';
  process.env.S3_BUCKET = 'stephaniegiorgis-production';

  assert.equal(
    toPublicMediaUrl('/api/media/file/example.jpg', {
      id: 1,
      updatedAt: '2026-05-06T10:00:00.000Z',
    }),
    'https://media.stephaniegiorgis.ch/media/example.jpg?v=2026-05-06T10%3A00%3A00.000Z',
  );
});

test('toPublicMediaUrl rewrites absolute Payload media file URLs on the app origin', () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://staging.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_STAGING =
    'https://staging-media.stephaniegiorgis.ch';

  assert.equal(
    toPublicMediaUrl(
      'https://staging.stephaniegiorgis.ch/api/media/file/example.jpg',
      {
        id: 1,
        updatedAt: '2026-05-06T10:00:00.000Z',
      },
    ),
    'https://staging-media.stephaniegiorgis.ch/media/example.jpg?v=2026-05-06T10%3A00%3A00.000Z',
  );
});

test('getMediaPurgeUrls includes unversioned and versioned media URLs', () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://staging.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_STAGING =
    'https://staging-media.stephaniegiorgis.ch';
  process.env.S3_PUBLIC_ENDPOINT = 'https://s3.pub2.infomaniak.cloud';
  process.env.S3_BUCKET = 'stephaniegiorgis-staging';

  assert.deepEqual(
    getMediaPurgeUrls({
      id: 1,
      updatedAt: '2026-05-06T10:00:00.000Z',
      url: 'https://s3.pub2.infomaniak.cloud/stephaniegiorgis-staging/derivatives/crop.webp',
    }),
    [
      'https://staging-media.stephaniegiorgis.ch/derivatives/crop.webp',
      'https://staging-media.stephaniegiorgis.ch/derivatives/crop.webp?v=2026-05-06T10%3A00%3A00.000Z',
    ],
  );
});

test('getMediaPurgeUrls includes Payload media file URLs rewritten to the media host', () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://staging.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_STAGING =
    'https://staging-media.stephaniegiorgis.ch';

  assert.deepEqual(
    getMediaPurgeUrls({
      id: 1,
      updatedAt: '2026-05-06T10:00:00.000Z',
      url: '/api/media/file/example.jpg',
    }),
    [
      'https://staging-media.stephaniegiorgis.ch/media/example.jpg',
      'https://staging-media.stephaniegiorgis.ch/media/example.jpg?v=2026-05-06T10%3A00%3A00.000Z',
    ],
  );
});

test('toPublicMediaUrl rewrites same-origin Payload file URLs in the production browser', () => {
  simulateBrowser('https://www.stephaniegiorgis.ch');

  assert.equal(
    toPublicMediaUrl(
      'https://www.stephaniegiorgis.ch/api/derivatives/file/crop.jpg',
    ),
    'https://media.stephaniegiorgis.ch/derivatives/crop.jpg',
  );
});

test('toPublicMediaUrl keeps staging media on the staging media host in the browser', () => {
  simulateBrowser('https://staging.stephaniegiorgis.ch');

  assert.equal(
    toPublicMediaUrl(
      'https://staging.stephaniegiorgis.ch/api/derivatives/file/crop.jpg',
    ),
    'https://staging-media.stephaniegiorgis.ch/derivatives/crop.jpg',
  );
  assert.equal(
    toPublicMediaUrl('https://staging-media.stephaniegiorgis.ch/media/a.jpg'),
    'https://staging-media.stephaniegiorgis.ch/media/a.jpg',
  );
});

test('publicMediaUrlAfterRead rewrites derivative URLs to the media host', async () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://staging.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_STAGING =
    'https://staging-media.stephaniegiorgis.ch';

  const doc = await publicMediaUrlAfterRead({
    doc: {
      id: 1,
      updatedAt: '2026-05-06T10:00:00.000Z',
      url: 'https://staging.stephaniegiorgis.ch/api/derivatives/file/crop.jpg',
    },
  } as unknown as Parameters<typeof publicMediaUrlAfterRead>[0]);

  assert.equal(
    doc.url,
    'https://staging-media.stephaniegiorgis.ch/derivatives/crop.jpg?v=2026-05-06T10%3A00%3A00.000Z',
  );
});

test('toPublicMediaUrl keeps server-resolved media URLs unchanged in the browser', () => {
  const resolved =
    'https://staging-media.stephaniegiorgis.ch/derivatives/crop.jpg?v=2026-05-06T10%3A00%3A00.000Z';

  for (const origin of [
    'https://www.stephaniegiorgis.ch',
    'https://preview.example.com',
  ]) {
    simulateBrowser(origin);

    assert.equal(
      toPublicMediaUrl(resolved, {
        id: 1,
        updatedAt: '2026-05-06T10:00:00.000Z',
      }),
      resolved,
    );
  }
});

test('a custom media origin resolved on the server survives browser rendering', async () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://staging.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_STAGING = 'https://assets.example.com';

  const doc = await publicMediaUrlAfterRead({
    doc: {
      id: 1,
      updatedAt: 'version-2',
      url: 'https://staging.stephaniegiorgis.ch/api/derivatives/file/crop.jpg',
    },
  } as unknown as Parameters<typeof publicMediaUrlAfterRead>[0]);

  assert.equal(
    doc.url,
    'https://assets.example.com/derivatives/crop.jpg?v=version-2',
  );

  simulateBrowser('https://staging.stephaniegiorgis.ch');

  assert.equal(getMediaUrl(doc), doc.url);
});

test('getMediaPurgeUrls handles both the raw previous doc and the rewritten doc', async () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://staging.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_STAGING =
    'https://staging-media.stephaniegiorgis.ch';

  const rawUrl =
    'https://staging.stephaniegiorgis.ch/api/derivatives/file/crop.jpg';
  // `previousDoc` skips collection afterRead hooks; `doc` has run them.
  const previousDoc = { id: 1, updatedAt: 'old', url: rawUrl };
  const doc = await publicMediaUrlAfterRead({
    doc: { id: 1, updatedAt: 'new', url: rawUrl },
  } as unknown as Parameters<typeof publicMediaUrlAfterRead>[0]);

  assert.deepEqual(getMediaPurgeUrls(previousDoc), [
    'https://staging-media.stephaniegiorgis.ch/derivatives/crop.jpg',
    'https://staging-media.stephaniegiorgis.ch/derivatives/crop.jpg?v=old',
  ]);
  assert.deepEqual(getMediaPurgeUrls(doc), [
    'https://staging-media.stephaniegiorgis.ch/derivatives/crop.jpg',
    'https://staging-media.stephaniegiorgis.ch/derivatives/crop.jpg?v=new',
  ]);
});

test('toPublicMediaUrl rewrites direct S3 upload paths to the media host', () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://staging.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_STAGING =
    'https://staging-media.stephaniegiorgis.ch';
  process.env.S3_PUBLIC_ENDPOINT = 'https://s3.pub2.infomaniak.cloud';
  process.env.S3_BUCKET = 'stephaniegiorgis-staging';

  for (const url of [
    'https://s3.pub2.infomaniak.cloud/derivatives/crop.webp',
    'https://s3.pub2.infomaniak.cloud/stephaniegiorgis-staging/derivatives/crop.webp',
  ]) {
    assert.equal(
      toPublicMediaUrl(url),
      'https://staging-media.stephaniegiorgis.ch/derivatives/crop.webp',
    );
  }
});

test('toPublicMediaUrl rewrites media paths on other origins on the server', () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://www.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_PRODUCTION =
    'https://media.stephaniegiorgis.ch';
  process.env.S3_ENDPOINT = 'https://s3.internal.example';
  process.env.S3_PUBLIC_ENDPOINT = 'https://s3.pub2.infomaniak.cloud';

  for (const url of [
    'https://www.stephaniegiorgis.ch/media/a.jpg',
    'https://stephaniegiorgis.ch/media/a.jpg',
    'http://media.stephaniegiorgis.ch/media/a.jpg',
    'https://s3.internal.example/media/a.jpg',
    'https://127.0.0.1:3107/media/a.jpg',
  ]) {
    assert.equal(
      toPublicMediaUrl(url),
      'https://media.stephaniegiorgis.ch/media/a.jpg',
      url,
    );
  }
});

test('toPublicMediaUrl re-resolves page, http, S3 and loopback media URLs in the browser', () => {
  simulateBrowser('https://www.stephaniegiorgis.ch');

  for (const url of [
    'https://www.stephaniegiorgis.ch/media/a.jpg',
    'https://stephaniegiorgis.ch/media/a.jpg',
    'https://staging.stephaniegiorgis.ch/media/a.jpg',
    'http://media.stephaniegiorgis.ch/media/a.jpg',
    'https://s3.pub2.infomaniak.cloud/media/a.jpg',
    'https://localhost:3107/media/a.jpg',
    'https://localhost.:3107/media/a.jpg',
    'https://127.0.0.2:3107/media/a.jpg',
  ]) {
    assert.equal(
      toPublicMediaUrl(url),
      'https://media.stephaniegiorgis.ch/media/a.jpg',
      url,
    );
  }
});

test('the afterRead hook resolves loopback Payload file URLs for the browser', async () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://staging.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_STAGING = 'https://assets.example.com';

  const doc = await publicMediaUrlAfterRead({
    doc: {
      id: 1,
      updatedAt: 'v1',
      url: 'https://localhost:3107/api/derivatives/file/crop.jpg',
    },
  } as unknown as Parameters<typeof publicMediaUrlAfterRead>[0]);

  assert.equal(doc.url, 'https://assets.example.com/derivatives/crop.jpg?v=v1');

  simulateBrowser('https://staging.stephaniegiorgis.ch');

  assert.equal(getMediaUrl(doc), doc.url);
});

test('the afterRead hook resolves http localhost Payload file URLs from dev data', async () => {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://www.stephaniegiorgis.ch';
  process.env.PUBLIC_MEDIA_ORIGIN_PRODUCTION =
    'https://media.stephaniegiorgis.ch';

  const doc = await publicMediaUrlAfterRead({
    doc: {
      id: 1,
      updatedAt: 'v1',
      url: 'http://localhost:3000/api/media/file/x.jpg',
    },
  } as unknown as Parameters<typeof publicMediaUrlAfterRead>[0]);

  assert.equal(doc.url, 'https://media.stephaniegiorgis.ch/media/x.jpg?v=v1');

  simulateBrowser('https://www.stephaniegiorgis.ch');

  assert.equal(getMediaUrl(doc), doc.url);
});

test('getPayloadServerURL defaults to the canonical page hosts', () => {
  process.env = { NODE_ENV: 'production' };
  assert.equal(getPayloadServerURL(), 'https://www.stephaniegiorgis.ch');

  process.env = { NODE_ENV: 'production', S3_BUCKET: 'site-staging' };
  assert.equal(getPayloadServerURL(), 'https://staging.stephaniegiorgis.ch');
});
