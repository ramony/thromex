# 构建阶段
FROM node:22-alpine AS builder
WORKDIR /app
# 1. 安装 corepack 并启用 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 运行阶段
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# 监听0.0.0.0，不能用127.0.0.1
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run" ,"dev"]
