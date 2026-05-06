# Payload Migration Plan

## Objective

Migrate this repository from Prismic to Payload CMS in a way that is fully implementable by a new session with no additional context.

The target system must:

- replace all Prismic runtime integrations with Payload
- use Neon Postgres with 3 database branches: `dev`, `staging`, `production`
- use private Infomaniak S3-compatible storage with 3 containers:
  - `stephaniegiorgis-dev`
  - `stephaniegiorgis-staging`
  - `stephaniegiorgis`
- use `@kalink-ui/canopy@1.0.0-beta.0`
- use Canopy's slug custom field for routable collections
- use Canopy's `image-transform` field/plugin to recreate Prismic thumbnail semantics
- treat content import from Prismic as a throwaway one-off task, not permanent repo infrastructure
- keep CI simple: CI runs the standard Payload `migrate` command, and environment variables decide the target database

This document supersedes earlier planning decisions that proposed more globals, `pageType`, reserved slugs, or dedicated documentation blocks.

---

## Final Decisions

These decisions are locked in and should be treated as the source of truth.

### Framework / Infra

- Use Payload with Postgres on Neon
- Use Neon branches: `dev`, `staging`, `production`
- Use private Infomaniak S3 storage
- Use one S3 container per environment
- Do not add GraphQL
- Local development uses Postgres `push` mode
- CI runs only `pnpm payload migrate`

### Collections / Globals

- Use a `pages` collection for:
  - `home`
  - `presentation`
  - `contact`
  - `links`
  - `artworks`
  - all standard pages
- Use an `artworks` collection for artwork documents
- Keep only one global: `mainNavigation`
- Do not create `homepage`, `presentation`, `contact`, or `archives` globals
- Do not use `pageType`
- Do not reserve static page slugs in schema validation; create the expected page documents in Payload admin instead

### Routing

- Homepage canonical slug is `home`
- Former archives content moves to `/links`
- `/archives` is retired entirely
- Special behavior is handled by Next routes, not by a `pageType` field

### Canopy

- Use Canopy slug custom field on `pages` and `artworks`
- Use underscore-based canonical transform keys:
  - `1_1`
  - `2_3`
  - `3_2`
  - `4_3`
  - `16_9`

### Navigation

- `mainNavigation` remains a global
- each nav item is only:
  - `label`
  - `document`
- no `destinationType`
- no multiple target fields

### Presentation / Contact

- `presentation` is a normal page in `pages`
- `contact` is a normal page in `pages`
- prefer the official Payload form-builder plugin for contact form management

### Artwork Documentation

- documentation is first-class data on `artworks`
- do not preserve Prismic's image / sound / video documentation slices as separate dedicated block types
- model documentation as a simplified structured field composed of layout choices and media items

---

## Current Repository Summary

### Stack

- Next.js App Router application
- current `next` version: `15.5.9`
- current app is Prismic-backed through:
  - `prismicio.ts`
  - `prismicio-types.d.ts`
  - `customtypes/**`
  - `slices/**`
  - `@prismicio/*`

### Existing Routes

- `/`
- `/:uid`
- `/artworks`
- `/artworks/:uid`
- `/presentation`
- `/contact`
- `/archives`

### Deployment Shape

- Next standalone Docker build
- Kubernetes deployment
- staging: 1 replica
- production: 2 replicas
- no shared writable application filesystem

Implication:

- Payload uploads must not use local disk in deployed environments
- Infomaniak S3 storage is mandatory for staging and production

---

## High-Level Migration Strategy

Execute the migration in this order:

1. align Next.js with Payload compatibility
2. introduce Payload dependencies and file structure
3. wire Neon and Infomaniak environments
4. define Payload schema and Canopy fields
5. refactor frontend fetching and rendering away from Prismic
6. create and commit Payload schema migrations
7. rehearse one-off content import against Neon `dev`
8. validate on `staging`
9. cut over `production`
10. remove all Prismic dependencies and files

Treat these as separate tracks:

- permanent and committed:
  - Payload config
  - Payload schema
  - Payload migrations
  - frontend integration code
- temporary and disposable:
  - Prismic export / import scripts
  - migration manifests
  - one-off asset mapping helpers

---

## Compatibility and Dependencies

## 1. Next.js Compatibility

Payload's supported Next peer range does not include the current `15.5.9`.

Action:

- pin `next` to `15.4.11`

After changing the version:

- run `pnpm install`
- run `pnpm test`
- run `pnpm build`

## 2. Dependencies To Add

Add runtime dependencies:

- `payload`
- `@payloadcms/next`
- `@payloadcms/db-postgres`
- `@payloadcms/richtext-lexical`
- `@payloadcms/storage-s3`
- `@payloadcms/plugin-form-builder`
- `@kalink-ui/canopy@1.0.0-beta.0`

Keep:

- `sharp`

Add env helper tooling only if it meaningfully improves local ergonomics.

Do not add:

- `graphql`

## 3. Dependencies To Remove After Cutover

Remove after the site is fully on Payload:

- `@prismicio/client`
- `@prismicio/next`
- `@prismicio/react`
- `@prismicio/richtext`
- `@slicemachine/adapter-next`
- `slice-machine-ui`

Delete obsolete Prismic files after cutover:

- `prismicio.ts`
- `prismicio-types.d.ts`
- `slicemachine.config.json`
- `customtypes/**`
- slice model files under `slices/**/model.json`
- slice simulator route if still present

---

## Permanent Filesystem Layout

Create and maintain this permanent structure:

```text
docs/
  plan.md

src/
  migrations/
  payload/
    access/
    blocks/
    collections/
    fields/
    globals/
    plugins/
    utils/

payload.config.ts
```

Guidelines:

- `src/migrations/` is permanent and committed
- `src/payload/**` is permanent and committed
- throwaway Prismic import scripts should not live here permanently

Recommended temporary local-only location for content import work:

- `.tmp/prismic-import/`

If `.tmp/` is used, add it to `.gitignore`.

---

## Environment Model

## Shared Environment Variable Names

The variable names are the same in all environments, but values differ by environment:

- `PAYLOAD_SECRET`
- `PAYLOAD_PUBLIC_SERVER_URL`
- `DATABASE_URL`
- `DATABASE_URL_DIRECT`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_BUCKET`

## Environment Matrix

### Development

- Neon branch: `dev`
- S3 container: `stephaniegiorgis-dev`

### Staging

- Neon branch: `staging`
- S3 container: `stephaniegiorgis-staging`

### Production

- Neon branch: `production`
- S3 container: `stephaniegiorgis`

## Database Usage

- `DATABASE_URL` is the pooled Neon runtime connection
- `DATABASE_URL_DIRECT` is the direct Neon migration / maintenance connection

## S3 Values

Use:

- `S3_ENDPOINT=https://s3.pub1.infomaniak.cloud`
- `S3_REGION=us-east-1`

Infomaniak-specific requirements:

- configure the S3 client with `forcePathStyle: true`
- keep containers private
- do not rely on S3 bucket policies
- do not make containers public in phase 1

---

## Neon Plan

## 1. Create or Verify Branches

Ensure the Neon project contains:

- `dev`
- `staging`
- `production`

## 2. Operational Rules

- local development points only to `dev`
- staging deploy points only to `staging`
- production deploy points only to `production`
- no environment points to another environment's branch
- CI just runs the standard migrate command; the injected env controls the target branch

---

## Infomaniak S3 Plan

## 1. Create Private Containers

Create and keep private:

- `stephaniegiorgis-dev`
- `stephaniegiorgis-staging`
- `stephaniegiorgis`

## 2. Storage Strategy

Use Payload's S3 storage adapter with private storage in phase 1.

Goals:

- avoid cross-environment asset collisions
- avoid direct public exposure of uploads
- support unpublished and draft-safe media workflows
- keep the option open to move to public asset delivery later if needed

## 3. Adapter Requirements

Configure the S3 adapter / client with:

- endpoint `https://s3.pub1.infomaniak.cloud`
- region `us-east-1`
- credentials from env
- `forcePathStyle: true`

Keep Payload access control enabled for media in phase 1.

---

## Kubernetes Secret Readiness

Staging and production already use Bitnami SealedSecrets.

Confirmed existing files:

- `k8s/overlays/staging/sealedsecret.yaml`
- `k8s/overlays/production/sealedsecret.yaml`

Current state:

- both currently include `RESEND_KEY`
- both currently include `REVALIDATE_SECRET`
- they do not yet include the new Payload / DB / S3 variables needed for deployment

This means local development and schema work can begin before secrets are updated, but staging and production deployment cannot be completed until the SealedSecrets are expanded.

Add the following sealed values for both staging and production:

- `PAYLOAD_SECRET`
- `PAYLOAD_PUBLIC_SERVER_URL`
- `DATABASE_URL`
- `DATABASE_URL_DIRECT`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_BUCKET`

Deployment readiness rule:

- sealed secret updates are not the first coding step
- sealed secret updates are mandatory before staging or production rollout

---

## Payload Application Structure

## 1. Route Grouping

Restructure the Next app to avoid collisions between public routes and Payload routes.

Recommended shape:

```text
app/
  (frontend)/
    ...public routes
  (payload)/
    admin/
    api/
```

Goal:

- public site stays in the existing Next app
- Payload owns admin and API routes cleanly

## 2. Core Payload Files To Create

- `payload.config.ts`
- `src/payload/collections/users.ts`
- `src/payload/collections/media.ts`
- `src/payload/collections/pages.ts`
- `src/payload/collections/artworks.ts`
- `src/payload/globals/mainNavigation.ts`
- `src/payload/blocks/richText.ts`
- `src/payload/blocks/captionImage.ts`
- `src/payload/blocks/video.ts`
- `src/payload/blocks/linkList.ts`
- `src/payload/blocks/artworkGrid.ts`
- `src/payload/blocks/formReference.ts`
- helpers under `src/payload/fields/`
- shared access helpers under `src/payload/access/` if needed
- plugin helpers under `src/payload/plugins/` if needed

---

## Target Content Model

## Collections

### `users`

Purpose:

- Payload admin/editor authentication

Fields:

- auth-enabled collection
- optional `role` if admin/editor distinction is needed

### `media`

Purpose:

- central upload collection for images, PDFs, audio, and video

Base fields:

- `alt`
- optional editorial metadata only if useful
- Canopy image-transform support for image assets

Guideline:

- keep the media model simple in phase 1
- do not redesign the media collection beyond the needs of this migration

### `pages`

Purpose:

- replace `standardPage`
- host the homepage document
- host `presentation`, `contact`, `links`, and `artworks` index pages
- host all standard pages

Core fields:

- `title`
- Canopy slug custom field
- `layout` structured section field
- SEO group
- drafts enabled

Important decisions:

- do not add `pageType`
- do not reserve slugs in schema
- simply create the expected documents in admin with these slugs:
  - `home`
  - `presentation`
  - `contact`
  - `links`
  - `artworks`

Routing model:

- `/` fetches the page with slug `home`
- `/artworks` fetches the page with slug `artworks`
- `/[slug]` fetches all other standard pages including `presentation`, `contact`, and `links`

### `artworks`

Purpose:

- replace Prismic `artwork`

Core fields:

- `title`
- Canopy slug custom field
- `medium`
- `measure`
- `year`
- `description`
- `coverImage`
- `documentationSections`
- SEO group
- drafts enabled

Route behavior:

- `/artworks/[slug]`

---

## Globals

### `mainNavigation`

This is the only global that should remain.

Fields:

- `items[]`

Each item contains only:

- `label`
- `document`

`document` should be a relationship to the routable collections used by the site.

Recommended relationship targets:

- `pages`
- `artworks`

Frontend rule:

- one shared helper resolves the final URL from the related document's collection and slug
- if the related page slug is `home`, the helper returns `/`
- if the related document is an artwork, the helper returns `/artworks/{slug}`

No separate target fields should be created.

---

## Recommended Page Block Set

These blocks form the main page-building toolkit.

### `richText`

Purpose:

- replace Prismic `rich_text`
- provide general narrative content

Fields:

- `content`

### `captionImage`

Purpose:

- replace Prismic `caption_image`

Fields:

- `image`
- `caption`

Implementation note:

- `image` should use Canopy's `image-transform` field in `selectable` mode
- the selected preset is the source of truth for the rendered ratio

### `video`

Purpose:

- replace Prismic `video`

Fields:

- `poster`
- `av1File`
- `h264File`
- `ratio`
- `maxWidth`

### `linkList`

Purpose:

- replace Prismic `link_list`

Fields:

- `items[]`
  - `label`
  - `link`
  - `description`
  - `screenshot`

### `artworkGrid`

Purpose:

- replace Prismic `grid`
- render selected artworks on the artworks index page

Fields:

- ordered relationship array to `artworks`

### `formReference`

Purpose:

- embed a Payload form-builder form inside a standard page layout
- intended primarily for the `contact` page

Fields:

- relationship to the plugin-generated `forms` collection
- optional heading / intro if useful

This keeps `contact` a normal page while still allowing editor-managed forms.

---

## Artwork Documentation Model

Prismic forced documentation into a shape that is no longer necessary.

Model documentation as a first-class structured field directly on each artwork.

### Recommended Field

- `documentationSections` as a `blocks` field on `artworks`

Recommended blocks:

- `docGrid`
- `docAudio`
- `docVideo`

`docGrid` contains:

- `layout` limited to the supported grid variants
- `items[]` rows containing one image per row
- exact row count enforced by `layout`
- image fields implemented as Canopy `image-transform` fields in `selectable` mode
- allowed presets limited to `1:1`, `2:3`, and `3:2`

Contract rule:

- `Grid 1/1` requires exactly 2 image slots
- `Grid 1/2`, `Grid 2/1`, and `Grid 1/1/1` require exactly 3 image slots
- `Grid 2/2` and `Grid 1/1/2` require exactly 4 image slots

`docAudio` and `docVideo` remain dedicated blocks so the section type, not the frontend, defines the contract.

---

## Canopy Usage

## 1. Slug Custom Field

Use the Canopy slug custom field on:

- `pages`
- `artworks`

Expected behavior:

- slug derives from title according to Canopy's field behavior
- slug remains editor-visible and editable

## 2. Image-Transform Convention

Canonical transform keys must use underscore names:

- `1_1`
- `2_3`
- `3_2`
- `4_3`
- `16_9`

Do not use raw Prismic labels as canonical keys.

### Legacy Prismic Mapping

- `1:1` -> `1_1`
- `2/3` -> `2_3`
- `2:3` -> `2_3`
- `3:2` -> `3_2`
- `4:3` -> `4_3`
- `16:9` -> `16_9`
- `Square` -> `1_1`

### Where To Apply Canopy Transforms

#### Artwork cover images

`coverImage` supports:

- `1_1`

#### Contact imagery

contact page images should support:

- `2_3`

#### Caption images

caption image fields should support:

- `4_3`
- `2_3`
- `3_2`

#### Documentation images

documentation media should support:

- `1_1`
- `2_3`
- `3_2`

#### Documentation video posters

poster fields should support:

- `1_1`
- `4_3`
- `16_9`

#### Link list screenshots

screenshots should support:

- `1_1`

Frontend rule:

- always access transforms by canonical keys
- use a shared image helper so rendering code does not depend on raw Payload field internals

---

## Rich Text Plan

Use Payload Lexical for all rich text editing and storage.

### Existing Semantics To Preserve

Current frontend rendering depends on labels such as:

- `codespan`
- `quote`
- `align-end`
- `legend`

### Migration Rule

During import, convert Prismic rich text into Lexical while preserving these semantics in the frontend renderer.

### Rendering Rules

- `codespan` -> inline code-like presentation
- `quote` -> quote / blockquote presentation
- `align-end` -> end-aligned paragraph presentation
- `legend` -> legend / caption presentation

---

## Contact Form Strategy

Use the official Payload form-builder plugin.

Why:

- it matches the requirement for a standard page with an editor-managed form
- forms and submissions live in Payload
- frontend stays fully custom and can match the existing design system

Implementation recommendation:

- enable `@payloadcms/plugin-form-builder`
- keep the generated forms collection private enough for admin use
- lock down submissions using Payload access control
- reference the chosen contact form from the `contact` page via the `formReference` block

Security note from plugin docs:

- the plugin's forms collection is publicly readable by default
- override access as needed so private email-related configuration is not exposed

---

## Exact Prismic To Payload Mapping

## Custom Types

### `homepage`

Target:

- `pages` document with slug `home`

Mapping:

- Prismic slice zone -> Payload `layout`
- importer should wrap slices into layout sections rather than writing a flat block array
- keep SEO fields
- no global needed

### `standardPage`

Target:

- `pages` collection

Mapping:

- Prismic `uid` -> Canopy slug value
- keep `title`
- keep SEO fields
- Prismic slice zone -> Payload `layout`
- importer should wrap slices into layout sections rather than writing a flat block array

### `artworks`

Target:

- `pages` document with slug `artworks`

Mapping:

- Prismic slice zone -> Payload `layout`
- page layout should use the `artworkGrid` block

### `archives`

Target:

- `pages` document with slug `links`

Mapping:

- Prismic slice zone -> Payload `layout`
- primarily composed of `linkList`
- `/archives` is not retained

### `artwork`

Target:

- `artworks` collection

Mapping:

- Prismic `uid` -> Canopy slug value
- keep `title`
- keep `medium`
- keep `measure`
- keep `year`
- `description` -> rich text field
- `cover_image` -> `coverImage`
- Prismic documentation slice content -> `documentationSections`
- keep SEO fields

### `presentation`

Target:

- `pages` document with slug `presentation`

Mapping:

- rich intro content -> `richText` block(s)
- importer should create one-column layout section(s) for intro content
- importer should create a two-column layout section for the biography image/text area
- links should remain in rich text or a `linkList` block inside the new layout section model
- keep SEO fields

### `contact`

Target:

- `pages` document with slug `contact`

Mapping:

- existing editorial content -> page `layout`
- contact form -> `formReference` block
- keep SEO fields

### `main_navigation`

Target:

- global `mainNavigation`

Mapping:

- convert items to `label + document`

## Shared Slices

### `caption_image`

Target:

- `captionImage` block

### `video`

Target:

- `video` block

### `rich_text`

Target:

- `richText` block

### `link_list`

Target:

- `linkList` block

### `grid`

Target:

- `artworkGrid` block

### `documentation`

Target:

- absorbed into the `documentationSections` array field on `artworks`

### `navigation_links`

Target:

- absorbed into `mainNavigation.items`

---

## Payload Config Plan

## `payload.config.ts` Responsibilities

- build the full Payload config
- register collections and globals
- register Lexical rich text
- configure Postgres adapter
- configure S3 storage adapter
- register Canopy plugin / custom fields
- enable form-builder plugin
- configure migrations directory

## Postgres Adapter Requirements

- point the adapter to the runtime / direct connections as needed
- set `migrationDir` to `src/migrations`
- keep `push` enabled for local development

## S3 Adapter Requirements

- store uploads for the `media` collection in Infomaniak S3
- configure the underlying client with:
  - endpoint
  - credentials
  - region
  - `forcePathStyle: true`

## Drafts

Enable drafts on:

- `pages`
- `artworks`

`mainNavigation` global may also use drafts if desired, but this is optional based on editorial needs.

---

## Next Routing Plan

The routing layer, not a `pageType` field, determines special behavior.

Recommended route strategy:

### `/`

- `app/page.tsx`
- fetch the page document with slug `home`

### `/artworks`

- `app/artworks/page.tsx`
- fetch the page document with slug `artworks`

### `/artworks/[slug]`

- `app/artworks/[slug]/page.tsx`
- fetch the artwork document by slug

### `/[slug]`

- `app/[slug]/page.tsx`
- fetch standard page documents including `presentation`, `contact`, and `links`

Result:

- no `pageType`
- no schema-level special cases
- special behavior stays in route implementations where it belongs

---

## Frontend Refactor Plan

## 1. Remove Prismic Runtime Dependencies

Replace runtime usage of:

- `createClient()`
- Prismic route resolvers
- `PrismicPreview`
- `SliceZone`
- `PrismicNextImage`
- `PrismicNextLink`

with a shared Payload query / rendering layer.

## 2. Recommended Query Helpers

Implement server-side helpers for:

- get page by slug
- get artwork by slug
- get navigation global

All route pages should read from these helpers instead of querying Payload ad hoc.

## 3. Replace Slice Rendering With Block Rendering

- remove the Prismic slice registry pattern
- replace it with a Payload block renderer registry
- reuse existing UI components where practical to reduce visual drift

## 4. Replace Image Handling

- replace all Prismic image integration with Payload + Canopy-aware helpers
- render image variants using canonical transform keys such as `1_1` and `4_3`

## 5. Replace Link Handling

- replace Prismic-specific link handling with one shared document URL resolver
- the resolver should understand:
  - page slug `home` -> `/`
  - page slug `x` -> `/${x}`
  - artwork slug `y` -> `/artworks/${y}`

## 6. Replace Rich Text Rendering

- render Lexical content in the existing design language
- preserve the current custom semantics noted earlier

---

## Next Image Plan

## Goal

Ensure `next/image` works with the final Payload media delivery setup.

## Recommended Phase 1 Behavior

Serve uploads through the Payload application endpoint rather than direct Infomaniak public URLs.

Why:

- storage stays private
- access control remains possible
- no direct public object storage exposure is needed

## Required `next.config.ts` Changes

- remove the current Prismic `images.prismic.io` remote pattern
- remove the current `/archives -> /links` redirect

If media is served from the same app host:

- no `images.remotePatterns` entry is required for Payload media

If media is served from a different Payload host:

- add one strict `images.remotePatterns` entry for that host only

Do not add Infomaniak remote patterns unless the implementation intentionally switches to direct public S3 URLs later.

## Security / Cache Notes

- keep remote patterns strict when used
- avoid broad wildcard host/path patterns
- Next Image does not forward auth headers to remote origins
- keep image cache TTL reasonable unless URLs are explicitly versioned

---

## Preview and Revalidation Plan

## Preview

Replace Prismic preview with Payload draft preview.

Required behavior:

- editors can preview draft pages and artworks
- the frontend can render draft content when preview is enabled

## Revalidation

Replace the current Prismic-specific revalidation flow with Payload-driven hooks.

Revalidation should cover:

- homepage route
- standard page routes by slug
- artworks index route
- artwork detail routes by slug
- navigation consumers when `mainNavigation` changes

---

## Permanent Migration System

## Directory

Use:

- `src/migrations/`

## Required Package Scripts

Add permanent scripts along these lines:

```json
{
  "scripts": {
    "payload": "cross-env PAYLOAD_CONFIG_PATH=payload.config.ts payload",
    "payload:migrate": "pnpm payload migrate",
    "payload:migrate:create": "pnpm payload migrate:create",
    "payload:migrate:status": "pnpm payload migrate:status"
  }
}
```

Notes:

- do not add a dedicated `payload:migrate:dev` script
- do not add environment-specific migrate scripts if CI already injects the correct env vars
- CI should simply run the standard migrate command

## Workflow

### Local Development

- use Neon `dev`
- rely on Postgres `push` mode while iterating
- do not routinely run migrations locally against the dev branch

### When a Schema Change Is Ready

- run `pnpm payload migrate:create`
- review the generated migration files
- commit `src/migrations/**`

### In CI

- run `pnpm payload migrate`
- the environment determines whether the target branch is `staging` or `production`

---

## Temporary Content Migration Plan

Content migration from Prismic is intentionally one-off.

It should not become permanent repo infrastructure.

## Execution Style

Use temporary local-only scripts in a disposable location, for example:

- `.tmp/prismic-import/`

Delete them afterward or keep them untracked.

## One-Off Import Tasks

### 1. Media Import

- enumerate all referenced Prismic assets
- download source assets
- upload them into Payload `media`
- maintain a temporary asset mapping from old Prismic refs to new Payload media IDs

### 2. Navigation Import

- import `mainNavigation`

### 3. Pages Import

Create/import page documents for:

- `home`
- `presentation`
- `contact`
- `links`
- `artworks`
- all other standard pages

### 4. Artworks Import

Import:

- all artworks
- cover images
- rich text description
- documentation sections
- SEO fields

### 5. Rich Text Conversion

- convert Prismic rich text to Lexical before writing documents

### 6. Verification

Verify:

- route parity
- metadata parity
- image transform parity
- navigation parity
- preview behavior

## Environment Usage

- rehearse the full import on Neon `dev`
- validate against `staging`
- perform final production import during cutover

---

## CI and Deployment Plan

## CI Responsibilities

Keep CI responsibilities simple:

- install dependencies
- lint
- typecheck
- build
- run `pnpm payload migrate` before deploy where applicable

## Staging Deployment

- inject staging env vars
- run `pnpm payload migrate`
- deploy against Neon `staging`
- use S3 container `stephaniegiorgis-staging`

## Production Deployment

- inject production env vars
- run `pnpm payload migrate`
- deploy against Neon `production`
- use S3 container `stephaniegiorgis`

---

## Implementation Checklist

## Phase 1 - Foundation

1. pin `next` to `15.4.11`
2. install Payload, Postgres adapter, S3 adapter, Lexical, form-builder, and Canopy
3. create the permanent Payload directory structure
4. add `payload.config.ts`
5. add package scripts for Payload CLI and migrations

## Phase 2 - Environment Wiring

6. configure local env vars for Neon `dev` and `stephaniegiorgis-dev`
7. prepare staging and production env var sets
8. expand staging and production SealedSecrets with Payload / DB / S3 values
9. wire the Payload S3 adapter with Infomaniak-compatible configuration

## Phase 3 - Schema

10. create collections: `users`, `media`, `pages`, `artworks`
11. create global: `mainNavigation`
12. create page blocks: `richText`, `captionImage`, `video`, `linkList`, `artworkGrid`, `formReference`
13. add Canopy slug fields to `pages` and `artworks`
14. add Canopy image-transform fields using canonical underscore keys
15. add the simplified `documentationSections` field to `artworks`
16. enable form-builder and connect it to the contact page design

## Phase 4 - Frontend Refactor

17. replace Prismic queries with Payload query helpers
18. replace slice rendering with block rendering
19. replace Prismic image rendering with Payload + Canopy helpers
20. replace link handling with a shared document URL resolver
21. replace Prismic preview/revalidation with Payload equivalents
22. update `next.config.ts` for Payload media and retired `/archives`

## Phase 5 - Schema Migration Workflow

23. run local dev in `push` mode against Neon `dev`
24. generate schema migrations when a coherent schema milestone is complete
25. commit `src/migrations/**`

## Phase 6 - Content Migration

26. create temporary import scripts in a disposable local-only location
27. import media into Payload `media`
28. import navigation
29. import pages
30. import artworks
31. verify parity in `dev`

## Phase 7 - Validation and Cutover

32. deploy to `staging` and run `migrate`
33. validate staging admin, frontend, media, and preview
34. perform final production content import and deploy
35. remove Prismic dependencies and files
36. run final lint, typecheck, and build

---

## Cleanup After Cutover

After production is fully validated, remove all Prismic-specific leftovers:

- `prismicio.ts`
- `prismicio-types.d.ts`
- `slicemachine.config.json`
- `customtypes/**`
- slice model files
- slice simulator route
- Prismic packages
- Slice Machine packages and scripts

Also update:

- `README.md`
- deployment notes if needed
- any internal docs that still reference Prismic

---

## Acceptance Criteria

The migration is complete when all of the following are true:

- Payload admin works in all intended environments
- Neon branch isolation is correct
- Infomaniak uploads work in each environment
- Canopy slug fields are used for routable collections
- Canopy image transforms replace Prismic thumbnail assumptions using canonical underscore keys
- all public routes render from Payload instead of Prismic
- `/` loads the page with slug `home`
- `/links` correctly replaces former archives content
- `/archives` is retired
- `presentation` and `contact` are normal page documents, not globals
- artwork documentation is driven by the simplified first-class `documentationSections` model
- CI runs schema migrations through the standard migrate command
- staging and production SealedSecrets contain the new Payload / DB / S3 variables
- production no longer depends on any Prismic runtime package or endpoint
