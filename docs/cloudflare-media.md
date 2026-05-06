# Cloudflare media setup

This repository contains the application-side integration for Cloudflare Image
Transformations. The Cloudflare account still needs the following manual setup.
The reusable Naima template lives in
`templates/cloudflare-media-cdn/` in the `naima` repository; this file documents
the Stephanie-specific values and implementation.

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

## How the app code participates

Cloudflare is not only infrastructure. The app must produce Cloudflare-friendly
URLs and invalidate them when Payload content changes.

- `next.config.ts` uses `cloudflare-image-loader.ts` as the production
  `next/image` loader.
- `cloudflare-image-loader.ts` emits
  `/cdn-cgi/image/format=auto,width=<width>,quality=<quality>,fit=scale-down,metadata=none,onerror=redirect/<source>`.
- `payload/runtime/helpers.ts` normalizes media URLs through
  `toPublicMediaUrl()` and `getMediaUrl()`.
- `toPublicMediaUrl()` rewrites Infomaniak S3 URLs, `/media/*`,
  `/derivatives/*`, `/api/media/file/*`, and `/api/derivatives/file/*` to the
  public media hostname.
- `toPublicMediaUrl()` adds `v=` from `sourceVersion`, `fingerprint`, or
  `updatedAt` so edited media gets new Cloudflare cache keys.
- Rendered image components should use `PayloadImage` or `getMediaUrl()` rather
  than reading raw Payload `url` fields.
- `app/(frontend)/api/revalidate/route.ts` keeps `revalidatePath()` for pages
  and also accepts Cloudflare purge URLs.
- Payload media hooks call `getMediaPurgeUrls()` after create/update/delete so
  Cloudflare purges original public media URLs.

Raw `/api/media/file` or `/api/derivatives/file` strings may still appear inside
serialized Payload hydration data when client components receive full CMS
objects. That is acceptable as long as the actual rendered image `src` and
`srcSet` values use `/cdn-cgi/image/.../https://staging-media...`.

## Validation

After staging deploys, verify Argo synced the deploy commit that updates the
image tag, not just the preceding merge commit:

```bash
kubectl -n argocd get application stephaniegiorgis-staging \
  -o jsonpath='{.status.sync.status}{"\n"}{.status.sync.revision}{"\n"}{.status.health.status}{"\n"}'

kubectl -n staging get deployment stephaniegiorgis \
  -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
```

If the image tag is stale after GitHub Actions pushed the staging deploy commit,
force an Argo hard refresh:

```bash
kubectl -n argocd annotate application stephaniegiorgis-staging \
  argocd.argoproj.io/refresh=hard --overwrite
```

Check rendered page output:

```bash
curl -sL -H 'Cache-Control: no-cache' https://staging.stephaniegiorgis.ch/artworks \
  | rg -o '/cdn-cgi/image|staging-media\.stephaniegiorgis\.ch|/api/derivatives/file' \
  | sort | uniq -c
```

Expected:

- rendered image `src` and `srcSet` URLs contain `/cdn-cgi/image`
- rendered image source origins contain `staging-media.stephaniegiorgis.ch`
- rendered image `src` and `srcSet` URLs do not contain `/api/derivatives/file`
- HTML responses show `cf-cache-status: DYNAMIC`
- transformed image responses include `cf-resized`
