# Stéphanie Giorgis Web site repository

Made with Payload and Next.js.

## Environment setup

From the project root, select Node.js and install the dependencies with the project's pinned pnpm version.

```sh
nvm install
npm install --global corepack@0.36.0
corepack enable pnpm
pnpm install --frozen-lockfile
```

1. Copy `.env.example` to `.env.local`
2. Fill in all required secrets and service URLs
3. Run `pnpm payload migrate`
4. Run `pnpm dev`

Required variables are documented in `.env.example`.

Set `PAYLOAD_ENABLE_SCHEMA_PUSH=true` only for local schema iteration against a disposable
development database. Leave it unset or `false` for staging, production, and one-off import
scripts.
