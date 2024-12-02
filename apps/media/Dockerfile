FROM node:18-bullseye-slim AS base

FROM base AS builder

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

RUN turbo prune @app/media --docker

FROM base AS runner

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

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm build:media

COPY --from=builder /app/apps/media/.env /app/apps/media/dist/.env
COPY --from=builder /app/apps/media/.env /app/.env

EXPOSE 3002

ENV NODE_ENV=production

CMD ["node", "/app/apps/media/dist/main.js"]