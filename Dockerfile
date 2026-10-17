# Production Dockerfile for Chronicle Changelog Studio
# Multi-stage build leveraging pnpm & Node.js 22 Alpine

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Dependency installation stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Application build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm run build

# Production runner stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy minimal runtime output from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma/starter.db ./prisma/starter.db
COPY --from=builder /app/public/starter.db ./public/starter.db

EXPOSE 3000

USER node

CMD ["node", ".output/server/index.mjs"]
