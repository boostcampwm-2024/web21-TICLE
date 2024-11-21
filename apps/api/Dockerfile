FROM node:18-alpine AS base

FROM base AS builder

RUN apk update

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm install -g pnpm

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN pnpm install -g turbo@^2.2.3

COPY . .

RUN turbo prune @app/api --docker

FROM base AS runner

RUN apk update

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm build:api

COPY --from=builder /app/apps/api/.env /app/apps/api/dist/.env
COPY --from=builder /app/apps/api/.env /app/.env

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "/app/apps/api/dist/main.js"]