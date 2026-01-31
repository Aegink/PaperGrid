# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
ARG NPM_REGISTRY=https://registry.npmmirror.com
RUN npm config set registry $NPM_REGISTRY \
  && npm i -g pnpm@9.12.3
ENV SKIP_DB_PREPARE=1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY scripts/prepare-db.mjs ./scripts/prepare-db.mjs
RUN pnpm install --frozen-lockfile

FROM base AS builder
ARG NPM_REGISTRY=https://registry.npmmirror.com
RUN npm config set registry $NPM_REGISTRY \
  && npm i -g pnpm@9.12.3
ENV SKIP_DB_PREPARE=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 生成一个开箱即用的 SQLite 模板库（首次启动会复制到数据卷）
ENV DATABASE_URL="file:/app/prisma/template.db"
RUN mkdir -p /app/prisma \
  && pnpm prisma generate \
  && pnpm prisma migrate deploy \
  && pnpm prisma db seed

RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# non-root user + 初始化数据卷目录（用于写 SQLite 与生成 NEXTAUTH_SECRET）
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001 -G nodejs \
  && mkdir -p /data /app/prisma \
  && echo "init" > /data/.keep \
  && chown -R nextjs:nodejs /data /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma/template.db ./prisma/template.db
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && chown nextjs:nodejs /entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["/entrypoint.sh"]
