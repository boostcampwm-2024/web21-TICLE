FROM node:18-alpine AS base

RUN apk update 
RUN apk add --no-cache python3 py3-pip build-base linux-headers libgcc libstdc++

WORKDIR /app

RUN npm install -g pnpm

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN pnpm install -g turbo@^2.2.3

COPY . .
RUN turbo prune @app/media --docker

FROM base AS builder

WORKDIR /app

COPY --from=base /app/out/json/ .
COPY --from=base /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

COPY --from=base /app/out/full/ .

RUN pnpm build:media

FROM base AS runner

WORKDIR /app

COPY --from=builder /app/out/full/ .

COPY --from=builder /app/apps/media/.env /app/apps/media/dist/.env
COPY --from=builder /app/apps/media/.env /app/.env

EXPOSE 3002

ENV NODE_ENV=production

CMD ["node", "/app/apps/media/dist/src/main.js"]
