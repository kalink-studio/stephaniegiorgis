# stephaniegiorgis

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
