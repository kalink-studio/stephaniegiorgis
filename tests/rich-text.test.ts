import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeEmptyRichText } from '../payload/schema/utils/richText.ts';

const emptyLexicalValue = {
  root: {
    children: [],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
};

test('normalizeEmptyRichText converts empty Lexical roots to null', () => {
  assert.equal(normalizeEmptyRichText(emptyLexicalValue), null);
});

test('normalizeEmptyRichText normalizes nested empty rich text fields', () => {
  assert.deepEqual(
    normalizeEmptyRichText({
      layout: [
        {
          blocks: [
            {
              blockType: 'linkList',
              items: [{ description: emptyLexicalValue, label: 'Kalink' }],
            },
          ],
        },
      ],
    }),
    {
      layout: [
        {
          blocks: [
            {
              blockType: 'linkList',
              items: [{ description: null, label: 'Kalink' }],
            },
          ],
        },
      ],
    },
  );
});
