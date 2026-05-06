import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getMediaPurgeUrls,
  toPublicMediaUrl,
} from '../payload/runtime/helpers.ts';

const ORIGINAL_ENV = { ...process.env };

test.afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

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
