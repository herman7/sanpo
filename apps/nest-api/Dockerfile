FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /repo

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/nest-api/package.json ./apps/nest-api/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/nest-api/node_modules ./apps/nest-api/node_modules
COPY . .
RUN pnpm --filter nest-api build

FROM node:24-alpine AS runner
# Keep the /repo layout so pnpm's symlinked node_modules resolve into the .pnpm store
WORKDIR /repo/apps/nest-api
ENV NODE_ENV=production
COPY --from=builder /repo/node_modules /repo/node_modules
COPY --from=builder /repo/apps/nest-api/node_modules ./node_modules
COPY --from=builder /repo/apps/nest-api/dist ./dist
COPY --from=builder /repo/apps/nest-api/package.json ./package.json
EXPOSE 4000
CMD ["node", "dist/main.js"]