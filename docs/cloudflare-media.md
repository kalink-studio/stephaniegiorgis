# Cloudflare media setup

This repository contains the application-side integration for Cloudflare Image
Transformations. The Cloudflare account still needs the following manual setup.

## DNS and SSL

- Move `stephaniegiorgis.ch` to Cloudflare or add the zone to the existing
  account.
- Proxy these records through Cloudflare:
  - `stephaniegiorgis.ch`
  - `www.stephaniegiorgis.ch`
  - `staging.stephaniegiorgis.ch`
  - `media.stephaniegiorgis.ch`
  - `staging-media.stephaniegiorgis.ch`
- Use Full Strict SSL.

## Image transformations

- Enable Cloudflare Images Transformations for the zone.
- Allow these remote source origins:
  - `https://media.stephaniegiorgis.ch`
  - `https://staging-media.stephaniegiorgis.ch`

## Cache rules

- Bypass cache for HTML, `/api/*`, `/admin*`, `/api/preview`, and
  `/api/exit-preview`.
- Cache `/_next/static/*` as immutable.
- Let the media Worker set cache headers for `/media/*` and `/derivatives/*`.

## Media Worker

Copy `cloudflare/media-worker/wrangler.toml.example` to `wrangler.toml`, fill in
the production and staging bucket names, then deploy with Wrangler.

The Worker only serves `/media/*` and `/derivatives/*`, signs origin requests
to Infomaniak S3 at `https://s3.pub2.infomaniak.cloud`, caches non-range GET
responses with Cloudflare's Cache API, forwards range requests without Worker
cache, and sets long-lived cache headers for versioned media URLs.

Set the S3 credentials as Worker secrets:

```bash
cd cloudflare/media-worker
npx wrangler secret put S3_ACCESS_KEY_ID
npx wrangler secret put S3_SECRET_ACCESS_KEY
npx wrangler deploy
```

## Purge token

Create a Cloudflare API token scoped to this zone with cache purge permission.
Expose only the sensitive Cloudflare values through the runtime secret:

- `CLOUDFLARE_ZONE_ID`
- `CLOUDFLARE_API_TOKEN`

Expose these as plain runtime configuration:

- `PUBLIC_MEDIA_ORIGIN_PRODUCTION=https://media.stephaniegiorgis.ch`
- `PUBLIC_MEDIA_ORIGIN_STAGING=https://staging-media.stephaniegiorgis.ch`
- `CLOUDFLARE_PURGE_ENABLED=true`
