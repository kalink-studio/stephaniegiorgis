import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import ts from 'typescript';

import { buildCloudflareImageUrl } from '../cloudflare-image-loader.ts';
import { toPublicMediaUrl } from '../payload/runtime/helpers.ts';
import { MEDIA_HOSTNAMES } from '../payload/runtime/siteHosts.ts';

const ORIGINAL_ENV = { ...process.env };

test.afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

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
    'https://media.stephaniegiorgis.ch/cdn-cgi/image/format=auto,width=560,quality=80,fit=scale-down,metadata=none,onerror=redirect/https://media.stephaniegiorgis.ch/media/image.jpg?v=abc',
  );
});

test('buildCloudflareImageUrl transforms staging media on the staging media host', () => {
  assert.equal(
    buildCloudflareImageUrl({
      enabled: true,
      src: 'https://staging-media.stephaniegiorgis.ch/derivatives/image.jpg',
      width: 320,
    }),
    'https://staging-media.stephaniegiorgis.ch/cdn-cgi/image/format=auto,width=320,quality=75,fit=scale-down,metadata=none,onerror=redirect/https://staging-media.stephaniegiorgis.ch/derivatives/image.jpg',
  );
});

test('buildCloudflareImageUrl returns sources off the media hosts unchanged', () => {
  for (const src of [
    '/images/placeholder.jpg',
    'http://media.stephaniegiorgis.ch/media/image.jpg',
    'https://www.stephaniegiorgis.ch/api/media/file/image.jpg',
    'https://s3.pub2.infomaniak.cloud/bucket/media/image.jpg',
    'data:image/png;base64,AAAA',
  ]) {
    assert.equal(
      buildCloudflareImageUrl({ enabled: true, src, width: 320 }),
      src,
    );
  }
});

test('buildCloudflareImageUrl transforms every default public media origin', () => {
  for (const [serverUrl, mediaOrigin] of [
    ['https://www.stephaniegiorgis.ch', 'https://media.stephaniegiorgis.ch'],
    [
      'https://staging.stephaniegiorgis.ch',
      'https://staging-media.stephaniegiorgis.ch',
    ],
  ]) {
    process.env = {
      NODE_ENV: 'production',
      PAYLOAD_PUBLIC_SERVER_URL: serverUrl,
    };
    const src = toPublicMediaUrl('/api/media/file/image.jpg');

    assert.equal(src, `${mediaOrigin}/media/image.jpg`);
    assert.ok(
      buildCloudflareImageUrl({ enabled: true, src, width: 320 }).startsWith(
        `${mediaOrigin}/cdn-cgi/image/`,
      ),
    );
  }
});

/** HTTPS hostnames in `images.remotePatterns`, read from the parsed config. */
const getRemotePatternHostnames = () => {
  const path = new URL('../next.config.ts', import.meta.url);
  const source = ts.createSourceFile(
    path.pathname,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.Latest,
  );
  const hostnames: string[] = [];

  const getProperty = (node: ts.ObjectLiteralExpression, name: string) =>
    node.properties.find(
      (property): property is ts.PropertyAssignment =>
        ts.isPropertyAssignment(property) &&
        ts.isIdentifier(property.name) &&
        property.name.text === name,
    )?.initializer;

  const visit = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'remotePatterns' &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      for (const element of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(element)) {
          continue;
        }

        const protocol = getProperty(element, 'protocol');
        const hostname = getProperty(element, 'hostname');

        if (
          protocol &&
          ts.isStringLiteral(protocol) &&
          protocol.text === 'https' &&
          hostname &&
          ts.isStringLiteral(hostname)
        ) {
          hostnames.push(hostname.text);
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(source);

  return hostnames;
};

test('next.config.ts remotePatterns cover every shared media hostname', () => {
  const hostnames = getRemotePatternHostnames();

  for (const hostname of MEDIA_HOSTNAMES) {
    assert.ok(hostnames.includes(hostname), hostname);
  }
});
