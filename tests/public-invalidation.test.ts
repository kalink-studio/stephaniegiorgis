import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getArtworkRevalidationEntries,
  getPageRevalidationEntries,
} from '../payload/schema/utils/publicInvalidation.ts';

test('getPageRevalidationEntries returns no entries for draft-only changes', () => {
  assert.deepEqual(
    getPageRevalidationEntries({
      _status: 'draft',
      slug: 'about',
    }),
    [],
  );
});

test('getPageRevalidationEntries includes old and new paths for slug changes', () => {
  assert.deepEqual(
    getPageRevalidationEntries(
      {
        _status: 'published',
        slug: 'new-page',
      },
      {
        _status: 'published',
        slug: 'old-page',
      },
    ),
    [{ path: '/old-page' }, { path: '/new-page' }],
  );
});

test('getArtworkRevalidationEntries includes the listing and slug path', () => {
  assert.deepEqual(
    getArtworkRevalidationEntries({
      _status: 'published',
      slug: 'work',
    }),
    [{ path: '/artworks' }, { path: '/artworks/work' }],
  );
});
