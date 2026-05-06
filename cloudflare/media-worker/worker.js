const DEFAULT_S3_ENDPOINT = 'https://s3.pub2.infomaniak.cloud';
const DEFAULT_S3_REGION = 'us-east-1';
const S3_SERVICE = 's3';
const ALLOWED_PREFIXES = ['/media/', '/derivatives/'];

const encoder = new TextEncoder();

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const getBucket = (hostname, env) => {
  if (hostname === 'staging-media.stephaniegiorgis.ch') {
    return env.S3_BUCKET_STAGING || env.S3_BUCKET;
  }

  return env.S3_BUCKET_PRODUCTION || env.S3_BUCKET;
};

const encodeRfc3986 = (value) => {
  return encodeURIComponent(value).replace(/[!'()*]/g, (character) => {
    return `%${character.charCodeAt(0).toString(16).toUpperCase()}`;
  });
};

const encodePathSegment = (segment) => {
  try {
    return encodeRfc3986(decodeURIComponent(segment));
  } catch {
    return encodeRfc3986(segment);
  }
};

const getCanonicalUri = (pathname) => {
  return pathname.split('/').map(encodePathSegment).join('/');
};

const getCanonicalQueryString = (url) => {
  return Array.from(url.searchParams.entries())
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => {
      if (leftKey === rightKey) {
        return leftValue.localeCompare(rightValue);
      }

      return leftKey.localeCompare(rightKey);
    })
    .map(([key, value]) => `${encodeRfc3986(key)}=${encodeRfc3986(value)}`)
    .join('&');
};

const normalizeHeaderValue = (value) => value.trim().replace(/\s+/g, ' ');

const getCanonicalHeaders = (headers) => {
  const entries = Array.from(headers.entries())
    .map(([name, value]) => [name.toLowerCase(), normalizeHeaderValue(value)])
    .sort(([leftName], [rightName]) => leftName.localeCompare(rightName));

  return {
    canonicalHeaders: entries
      .map(([name, value]) => `${name}:${value}\n`)
      .join(''),
    signedHeaders: entries.map(([name]) => name).join(';'),
  };
};

const toHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const sha256Hex = async (value) => {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
};

const hmac = async (key, value) => {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['sign'],
  );

  return crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(value));
};

const getSigningKey = async (secretAccessKey, dateStamp, region) => {
  const dateKey = await hmac(
    encoder.encode(`AWS4${secretAccessKey}`),
    dateStamp,
  );
  const dateRegionKey = await hmac(dateKey, region);
  const dateRegionServiceKey = await hmac(dateRegionKey, S3_SERVICE);

  return hmac(dateRegionServiceKey, 'aws4_request');
};

const getAmzDates = (date = new Date()) => {
  const isoDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');

  return {
    amzDate: isoDate,
    dateStamp: isoDate.slice(0, 8),
  };
};

const signOriginRequest = async ({ env, headers, method, originUrl }) => {
  const accessKeyId = env.S3_ACCESS_KEY_ID;
  const secretAccessKey = env.S3_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    return null;
  }

  const region = env.S3_REGION || DEFAULT_S3_REGION;
  const { amzDate, dateStamp } = getAmzDates();
  const credentialScope = `${dateStamp}/${region}/${S3_SERVICE}/aws4_request`;

  headers.set('host', originUrl.host);
  headers.set('x-amz-content-sha256', 'UNSIGNED-PAYLOAD');
  headers.set('x-amz-date', amzDate);

  if (env.S3_SESSION_TOKEN) {
    headers.set('x-amz-security-token', env.S3_SESSION_TOKEN);
  }

  const { canonicalHeaders, signedHeaders } = getCanonicalHeaders(headers);
  const canonicalRequest = [
    method,
    getCanonicalUri(originUrl.pathname),
    getCanonicalQueryString(originUrl),
    canonicalHeaders,
    signedHeaders,
    'UNSIGNED-PAYLOAD',
  ].join('\n');
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join('\n');
  const signingKey = await getSigningKey(secretAccessKey, dateStamp, region);
  const signature = toHex(await hmac(signingKey, stringToSign));

  headers.set(
    'authorization',
    [
      `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`,
    ].join(', '),
  );

  headers.delete('host');

  return headers;
};

const isAllowedPath = (pathname) => {
  return ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const buildOriginUrl = (requestUrl, env) => {
  const bucket = getBucket(requestUrl.hostname, env);

  if (!bucket) {
    return null;
  }

  const endpoint = trimTrailingSlash(env.S3_ENDPOINT || DEFAULT_S3_ENDPOINT);
  const originUrl = new URL(`${endpoint}/${bucket}${requestUrl.pathname}`);
  originUrl.search = requestUrl.search;

  return originUrl;
};

const getCacheControl = (requestUrl) => {
  if (requestUrl.searchParams.has('v')) {
    return 'public, max-age=31536000, immutable';
  }

  return 'public, max-age=3600, must-revalidate';
};

const buildOriginHeaders = (request) => {
  const headers = new Headers();

  for (const header of ['if-modified-since', 'if-none-match', 'range']) {
    const value = request.headers.get(header);

    if (value) {
      headers.set(header, value);
    }
  }

  return headers;
};

const canUseWorkerCache = (request) => {
  return (
    request.method === 'GET' &&
    !request.headers.has('range') &&
    !request.headers.has('if-none-match') &&
    !request.headers.has('if-modified-since')
  );
};

const withResponseHeaders = (response, requestUrl) => {
  const headers = new Headers(response.headers);

  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Cache-Control', getCacheControl(requestUrl));
  headers.delete('set-cookie');

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
};

export default {
  async fetch(request, env, ctx) {
    const requestUrl = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Headers':
            'range,if-none-match,if-modified-since',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
          'Access-Control-Allow-Origin': '*',
        },
        status: 204,
      });
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    if (!isAllowedPath(requestUrl.pathname)) {
      return new Response('Not Found', { status: 404 });
    }

    const originUrl = buildOriginUrl(requestUrl, env);

    if (!originUrl) {
      return new Response('Missing S3 bucket configuration', { status: 500 });
    }

    const cacheKey = new Request(request.url, { method: 'GET' });
    const shouldUseWorkerCache = canUseWorkerCache(request);

    if (shouldUseWorkerCache) {
      const cachedResponse = await caches.default.match(cacheKey);

      if (cachedResponse) {
        return cachedResponse;
      }
    }

    const originHeaders = await signOriginRequest({
      env,
      headers: buildOriginHeaders(request),
      method: request.method,
      originUrl,
    });

    if (!originHeaders) {
      return new Response('Missing S3 signing configuration', { status: 500 });
    }

    const response = await fetch(originUrl, {
      headers: originHeaders,
      method: request.method,
    });

    const publicResponse = withResponseHeaders(response, requestUrl);

    if (shouldUseWorkerCache && publicResponse.status === 200) {
      ctx.waitUntil(caches.default.put(cacheKey, publicResponse.clone()));
    }

    return publicResponse;
  },
};
