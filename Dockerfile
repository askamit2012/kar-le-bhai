FROM node:22-alpine AS base

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

FROM base AS builder
# Copy workspace configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.json ./

# Copy package structures for dependency installation caching
COPY packages/domain/package.json ./packages/domain/
COPY packages/api-contract/package.json ./packages/api-contract/
COPY packages/config/ ./packages/config/
COPY services/api/package.json ./services/api/

# Install all dependencies (dev dependencies are needed to build)
RUN pnpm install --frozen-lockfile

# Copy source code files
COPY packages/domain/src ./packages/domain/src
COPY packages/domain/tsconfig.json ./packages/domain/
COPY packages/api-contract/src ./packages/api-contract/src
COPY packages/api-contract/tsconfig.json ./packages/api-contract/
COPY services/api/src ./services/api/src
COPY services/api/tsconfig.json ./services/api/

# Build and typecheck the typescript code
RUN pnpm --filter @kar-le-bhai/api typecheck

FROM base AS runner
WORKDIR /app

# Copy built app and node_modules from builder stage
COPY --from=builder /app /app

ENV PORT=8787
EXPOSE 8787

# Run the API service using node on the compiled code
CMD ["node", "services/api/dist/index.js"]
