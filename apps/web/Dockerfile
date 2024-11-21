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

RUN turbo prune @app/web --docker

FROM base AS installer

RUN apk update

RUN apk add --no-cache libc6-compat python3 py3-pip build-base

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
