import assert from 'node:assert/strict';
import test from 'node:test';

import { buildCloudflareImageUrl } from '../cloudflare-image-loader.ts';

test('buildCloudflareImageUrl returns the original source when disabled', () => {
  assert.equal(
    buildCloudflareImageUrl({
      enabled: false,
      src: 'https://media.stephaniegiorgis.ch/media/image.jpg',
      width: 320,
    }),
    'https://media.stephaniegiorgis.ch/media/image.jpg',
  );
});

test('buildCloudflareImageUrl maps image props to Cloudflare URL options', () => {
  assert.equal(
    buildCloudflareImageUrl({
      enabled: true,
      quality: 80,
      src: 'https://media.stephaniegiorgis.ch/media/image.jpg?v=abc',
      width: 560,
    }),
    '/cdn-cgi/image/format=auto,width=560,quality=80,fit=scale-down,metadata=none,onerror=redirect/https://media.stephaniegiorgis.ch/media/image.jpg?v=abc',
  );
});
