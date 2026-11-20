/**
 * Hostnames of the site, shared by the server, the browser bundle and the
 * `next/image` loader. Keep this module free of imports and env access: the
 * browser cannot read server-only variables such as `PUBLIC_MEDIA_ORIGIN*`.
 */

/** Canonical page hostnames: Payload's default `serverURL` per environment. */
export const PRODUCTION_PAGE_HOSTNAME = 'www.stephaniegiorgis.ch';
export const STAGING_PAGE_HOSTNAME = 'staging.stephaniegiorgis.ch';

export const PRODUCTION_PAGE_HOSTNAMES: ReadonlySet<string> = new Set([
  PRODUCTION_PAGE_HOSTNAME,
  'stephaniegiorgis.ch',
]);

export const STAGING_PAGE_HOSTNAMES: ReadonlySet<string> = new Set([
  STAGING_PAGE_HOSTNAME,
]);

export const PAGE_HOSTNAMES: ReadonlySet<string> = new Set([
  ...PRODUCTION_PAGE_HOSTNAMES,
  ...STAGING_PAGE_HOSTNAMES,
]);

export const DEFAULT_PRODUCTION_SERVER_URL = `https://${PRODUCTION_PAGE_HOSTNAME}`;
export const DEFAULT_STAGING_SERVER_URL = `https://${STAGING_PAGE_HOSTNAME}`;

export const PRODUCTION_MEDIA_HOSTNAME = 'media.stephaniegiorgis.ch';
export const STAGING_MEDIA_HOSTNAME = 'staging-media.stephaniegiorgis.ch';

/** Cloudflare-proxied hosts that serve uploads and `/cdn-cgi/image/*`. */
export const MEDIA_HOSTNAMES: ReadonlySet<string> = new Set([
  PRODUCTION_MEDIA_HOSTNAME,
  STAGING_MEDIA_HOSTNAME,
]);

export const DEFAULT_PRODUCTION_MEDIA_ORIGIN = `https://${PRODUCTION_MEDIA_HOSTNAME}`;
export const DEFAULT_STAGING_MEDIA_ORIGIN = `https://${STAGING_MEDIA_HOSTNAME}`;
