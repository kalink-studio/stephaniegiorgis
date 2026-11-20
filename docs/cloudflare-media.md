# Cloudflare media setup

This repository contains the application-side integration for Cloudflare Image
Transformations. The Cloudflare account still needs the following manual setup.
The reusable Naima template lives in
`templates/cloudflare-media-cdn/` in the `naima` repository; this file documents
the Stephanie-specific values and implementation.

## DNS and SSL

- Move `stephaniegiorgis.ch` to Cloudflare or add the zone to the existing
  account.
- Proxy the media records through Cloudflare. They serve the media Worker and
  every image transformation:
  - `media.stephaniegiorgis.ch`
  - `staging-media.stephaniegiorgis.ch`
- The page records (`stephaniegiorgis.ch`, `www.stephaniegiorgis.ch`,
  `staging.stephaniegiorgis.ch`) can be proxied or DNS-only. Image URLs never
  depend on the page hostname. Before switching a page record to DNS-only,
  complete the [cutover checklist](#dns-only-page-hosts).
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
  `<media-origin>/cdn-cgi/image/format=auto,width=<width>,quality=<quality>,fit=scale-down,metadata=none,onerror=redirect/<source>`
  for sources on `https://media.stephaniegiorgis.ch` or
  `https://staging-media.stephaniegiorgis.ch`. The transformation runs on that
  media host, so it keeps working when the page hostnames are DNS-only. Any
  other source is returned unchanged, without optimization.
- The page and media hostnames live in `payload/runtime/siteHosts.ts`, shared
  by the loader, the browser bundle and the server, because browser bundles
  cannot read the server-only `PUBLIC_MEDIA_ORIGIN*` variables. A new media
  origin set through `PUBLIC_MEDIA_ORIGIN*` must be added to `MEDIA_HOSTNAMES`
  there; otherwise its images are served unoptimized. Also add it to
  `images.remotePatterns` in `next.config.ts` (not used by the custom loader,
  but kept in sync by a test in case the loader is removed).
- `payload/runtime/helpers.ts` normalizes media URLs through
  `toPublicMediaUrl()` and `getMediaUrl()`.
- The `media` and `derivatives` collections run `toPublicMediaUrl()` in an
  `afterRead` hook, so documents sent to client components already carry
  media-host URLs.
- `toPublicMediaUrl()` rewrites Infomaniak S3 URLs, `/media/*`,
  `/derivatives/*`, `/api/media/file/*`, and `/api/derivatives/file/*` to the
  public media hostname of the current environment. In the browser only,
  absolute HTTPS `/media/*` and `/derivatives/*` URLs on another origin than
  the page, a page host, S3 or a loopback host are treated as already resolved
  by the server and kept as-is (apart from `v=`), because the browser cannot
  read `PUBLIC_MEDIA_ORIGIN*` to resolve them again.
- In the browser, `toPublicMediaUrl()` uses `window.location` to pick the
  media host and to recognize same-origin Payload file URLs, because
  server-only variables such as `PAYLOAD_PUBLIC_SERVER_URL` are not bundled.
  This is a fallback for URLs that reach client components unresolved.
- `toPublicMediaUrl()` adds `v=` from `sourceVersion`, `fingerprint`, or
  `updatedAt` so edited media gets new Cloudflare cache keys.
- Rendered image components should use `PayloadImage` or `getMediaUrl()` rather
  than reading raw Payload `url` fields.
- `app/(frontend)/api/revalidate/route.ts` keeps `revalidatePath()` for pages
  and also accepts Cloudflare purge URLs.
- Payload media hooks call `getMediaPurgeUrls()` after create/update/delete so
  Cloudflare purges original public media URLs.

Upload URLs in `media` and `derivatives` documents are rewritten on the server,
so their `url` fields carry media-host URLs in hydration data. Raw
`/api/media/file` or `/api/derivatives/file` strings still appear in fields the
hooks do not rewrite, such as Payload's `thumbnailURL`, which no frontend
component reads. That is acceptable as long as the actual
rendered image `src` and `srcSet` values, including those rendered in the
browser after hydration, use
`https://staging-media.stephaniegiorgis.ch/cdn-cgi/image/.../https://staging-media...`.

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

Check rendered page output. This lists the prefix of every `src` and `srcSet`
candidate of every rendered `<img>`; run it on the listing and on an artwork
page:

```bash
curl -sL -H 'Cache-Control: no-cache' https://staging.stephaniegiorgis.ch/artworks \
  | rg -o '<img [^>]*>' \
  | rg -o '\b(src|srcSet)="[^"]+"' \
  | sed -E 's/^(src|srcSet)="//; s/"$//' \
  | tr ' ' '\n' | grep -vE '^([0-9]+w,?)?$' \
  | sed -E 's#^(https://[^/]+/cdn-cgi/image/).*#\1#; s#^(/cdn-cgi/image/).*#\1#; s#^(.{0,60}).*#\1#' \
  | sort | uniq -c
```

Expected:

- the only line is `https://staging-media.stephaniegiorgis.ch/cdn-cgi/image/`;
  a production media host here means the staging server resolved itself as
  production (check `PAYLOAD_PUBLIC_SERVER_URL`)
- no bare `/cdn-cgi/image/` (page-relative) line and no untransformed source
- transformed image responses include `cf-resized`
- the page preconnects to the media host. Next.js usually sends the hint as a
  `Link` response header rather than a `<link>` tag, so check both:
  `curl -s -D - https://staging.stephaniegiorgis.ch/ | rg -io '<https://staging-media\.stephaniegiorgis\.ch>; rel=preconnect|<link rel="preconnect" href="https://staging-media[^"]*"'`
  prints a match

Client components such as the documentation gallery also build image URLs in
the browser. On an artwork page, scroll through the gallery, open the
lightbox, and run this in the DevTools console:

```js
{
  const images = [...document.images].filter((img) => img.currentSrc);
  console.log({
    prefixes: [
      ...new Set(
        images.map((img) =>
          img.currentSrc.replace(/(\/cdn-cgi\/image\/).*/, '$1'),
        ),
      ),
    ],
    broken: images
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc),
    notLoaded: [...document.images]
      .filter((img) => !img.complete || !img.currentSrc)
      .map((img) => img.src || img.alt),
  });
}
```

`prefixes` must contain only the media host's `/cdn-cgi/image/` prefix and
`broken` must be empty; `notLoaded` lists lazy images still outside the
viewport. In the Network panel, filtered on `cdn-cgi`, image responses must be
`200` with a `cf-resized` header.

## DNS-only page hosts

Before switching `www`, the apex or `staging` to DNS-only:

1. Deploy this loader to the environment and run the validation above.
2. Check that the ingress serves the hostname over publicly trusted HTTPS.
   `curl` verifies the chain, the expiry and the hostname. The staging overlay
   uses the `letsencrypt-staging` cluster issuer, which fails this check;
   switch it to `letsencrypt-prod` first:

   ```bash
   curl --fail --show-error -sS -o /dev/null \
     --resolve "staging.stephaniegiorgis.ch:443:<ingress-ip>" \
     https://staging.stephaniegiorgis.ch/
   ```

3. Switch the record to DNS-only, then check that HTML no longer returns
   `cf-ray` headers and that images still return `cf-resized`.
