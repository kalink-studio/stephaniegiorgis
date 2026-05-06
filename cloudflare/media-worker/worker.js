const DEFAULT_S3_ENDPOINT = 'https://s3.pub2.infomaniak.cloud';
const ALLOWED_PREFIXES = ['/media/', '/derivatives/'];

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const getBucket = (hostname, env) => {
  if (hostname === 'media.staging.stephaniegiorgis.ch') {
    return env.S3_BUCKET_STAGING || env.S3_BUCKET;
  }

  return env.S3_BUCKET_PRODUCTION || env.S3_BUCKET;
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

  for (const header of [
    'accept',
    'accept-encoding',
    'if-modified-since',
    'if-none-match',
    'range',
  ]) {
    const value = request.headers.get(header);

    if (value) {
      headers.set(header, value);
    }
  }

  return headers;
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
  async fetch(request, env) {
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

    const response = await fetch(originUrl, {
      headers: buildOriginHeaders(request),
      method: request.method,
    });

    return withResponseHeaders(response, requestUrl);
  },
};
