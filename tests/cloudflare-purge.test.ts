import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createCloudflarePurgeBatches,
  purgeCloudflareUrls,
} from '../payload/schema/utils/cloudflare.ts';

const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_FETCH = globalThis.fetch;

test.afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  globalThis.fetch = ORIGINAL_FETCH;
});

test('createCloudflarePurgeBatches filters invalid URLs and chunks requests', () => {
  const batches = createCloudflarePurgeBatches(
    [
      'https://media.stephaniegiorgis.ch/media/a.jpg',
      'not-a-url',
      'https://media.stephaniegiorgis.ch/media/a.jpg',
      'https://media.stephaniegiorgis.ch/media/b.jpg',
    ],
    1,
  );

  assert.deepEqual(batches, [
    ['https://media.stephaniegiorgis.ch/media/a.jpg'],
    ['https://media.stephaniegiorgis.ch/media/b.jpg'],
  ]);
});

test('purgeCloudflareUrls posts purge batches when configured', async () => {
  const calls: unknown[] = [];

  process.env.CLOUDFLARE_PURGE_ENABLED = 'true';
  process.env.CLOUDFLARE_ZONE_ID = 'zone-id';
  process.env.CLOUDFLARE_API_TOKEN = 'token';

  globalThis.fetch = (async (url, init) => {
    calls.push({ init, url });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  }) as typeof fetch;

  const result = await purgeCloudflareUrls([
    'https://media.stephaniegiorgis.ch/media/a.jpg',
  ]);

  assert.equal(result.skipped, false);
  assert.equal(result.purged, 1);
  assert.equal(calls.length, 1);
  assert.deepEqual(
    JSON.parse((calls[0] as { init: RequestInit }).init.body as string),
    {
      files: ['https://media.stephaniegiorgis.ch/media/a.jpg'],
    },
  );
});

test('purgeCloudflareUrls skips when credentials are missing', async () => {
  process.env.CLOUDFLARE_PURGE_ENABLED = 'true';
  delete process.env.CLOUDFLARE_ZONE_ID;
  delete process.env.CLOUDFLARE_API_TOKEN;

  const result = await purgeCloudflareUrls([
    'https://media.stephaniegiorgis.ch/media/a.jpg',
  ]);

  assert.equal(result.skipped, true);
  assert.equal(result.purged, 0);
});
