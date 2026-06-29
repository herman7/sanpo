# Stage 1: deps（依赖阶段）（利用 pnpm 的 workspace 协议）
# corepack 是 Node.js 内置的包管理器版本控制工具
# 启用corepack，安装并激活最新版pnpm 这样后续阶段直接可以用 pnpm 命令，不需要 npm install -g pnpm
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /repo

# 只复制 package 相关文件，充分利用 Docker 层缓存
# 缓存命中规则：只要上面复制的 package.json 和 lock 文件没变，这一层就会直接命中缓存，跳过耗时的 install，这是整个 Dockerfile 最关键的优化。
# 继承 Stage 1 的环境（已有 Node + pnpm），起名为 deps
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile # 安装所有依赖，使用冻结锁文件，避免版本冲突

# Stage 2: builder（构建阶段）
FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules
COPY . .
RUN pnpm --filter web build

# Stage 3: runner（运行阶段）（只保留运行时必要文件）
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# In a monorepo, standalone output keeps the workspace layout (apps/web/server.js).
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /repo/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3008
CMD ["node", "apps/web/server.js"]
