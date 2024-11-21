FROM node:18-bullseye-slim AS base

FROM base AS builder

# Debian 이미지에서는 apk 대신 apt-get 사용
RUN apt-get update \
    && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    linux-headers-amd64 \
    libgcc1 \
    libstdc++6 \
    ninja-build \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm install -g pnpm

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN pnpm install -g turbo@^2.2.3

COPY . .

RUN turbo prune @app/web --docker

FROM base AS installer

RUN apt-get update \
    && apt-get install -y \
    libc6-dev \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm build:web

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=installer /app/apps/web/dist ./dist

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
