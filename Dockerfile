# syntax=docker/dockerfile:1

# Multi-stage production build for the Mindful Healing Trips Next.js app.
# Optimized for a small, non-root runtime image via Next.js "standalone" output.

FROM node:22-alpine AS base
# Required by Prisma's query engine and a few native deps on Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable

# --- deps: install dependencies with a frozen lockfile -----------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# --- builder: compile the Next.js app ----------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are baked into the client bundle at build time.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
RUN pnpm build

# --- runner: minimal production runtime --------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# `pnpm build`'s postbuild script already copies public/ and .next/static
# into .next/standalone (scripts/copy-standalone-assets.mjs), so this one
# copy is a fully self-contained runtime.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
