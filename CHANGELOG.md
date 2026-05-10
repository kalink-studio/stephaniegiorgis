# stephaniegiorgis

## 0.3.1

### Patch Changes

- f3b6076: Use layout-aware image sizes for caption images, generate larger image transform derivatives, and remove mobile horizontal overflow from standard pages.

## 0.3.0

### Minor Changes

- 87d6400: Upgrade Next.js to 16 with Turbopack, update Payload and vanilla-extract integration, and opt GitHub Actions into the Node 24 JavaScript action runtime.

### Patch Changes

- c74402f: Update GitHub Actions workflow actions to Node 24 runtime versions.
- 079c75e: Scope the dummy Payload build secret to the Docker build command.
- 22ffcf3: Disable Payload schema push by default and add the missing migration snapshot for the artwork documentation image layout migration.

## 0.2.3

### Patch Changes

- 9bdb94a: Stretch artwork documentation sections so single-image layouts fill the available column width.

## 0.2.2

### Patch Changes

- a0fe809: Fix single-image artwork documentation layouts filling their available width.
- 01e0cb4: Remove the Instagram link from desktop and mobile navigation.

## 0.2.1

### Patch Changes

- ee64da7: Constrain documentation audio players to the artwork media column width.
- d3a2402: Fix contact page layout width and form control sizing.
- f33327d: Add a migration for the artwork documentation Image layout.

## 0.2.0

### Minor Changes

- 20fdb14: Migrate the site from Prismic to Payload CMS, including Payload schema, migrations, frontend rendering, media handling, and staging deployment configuration.

### Patch Changes

- 7ba25d1: Fix artwork documentation layouts that display a single image.
- d9812ec: Fix contact page form alignment and message field sizing.

## 0.1.2

### Patch Changes

- 7acf6df: Ensure Kubernetes deployments use the GHCR pull secret so staging and production pods can authenticate and start successfully on Naima.

## 0.1.1

### Patch Changes

- 076cda1: Migrate the site deployment from Vercel-oriented hosting to the Naima Kubernetes workflow with pnpm, containerization, and ArgoCD-ready manifests.
- cbae5f6: Ensure the self-hosted build installs and verifies sharp correctly in CI and Docker while disabling Scarf analytics noise during automated installs.
