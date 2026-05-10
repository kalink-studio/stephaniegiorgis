# Next.js Standalone Dockerfile
# Optimized for production deployment on Kubernetes
# Supports pnpm (preferred) or npm

# =============================================================================
# Stage 1: Dependencies
# =============================================================================
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV SCARF_ANALYTICS=false

# Enable corepack for pnpm
RUN corepack enable pnpm

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* package-lock.json* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "No lockfile found. Please use pnpm or npm." && exit 1; \
  fi

RUN node -e "require('sharp'); console.log('sharp ok')"

# =============================================================================
# Stage 2: Builder
# =============================================================================
FROM node:24-alpine AS builder
WORKDIR /app
ENV SCARF_ANALYTICS=false

# Enable corepack for pnpm
RUN corepack enable pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for environment variables needed at build time
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN \
  if [ -f pnpm-lock.yaml ]; then PAYLOAD_SECRET=build-time-payload-secret pnpm build; \
  elif [ -f package-lock.json ]; then PAYLOAD_SECRET=build-time-payload-secret npm run build; \
  else echo "No lockfile found." && exit 1; \
  fi

# =============================================================================
# Stage 3: Runner
# =============================================================================
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SCARF_ANALYTICS=false

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set correct permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
