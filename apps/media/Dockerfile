# 1. Base 이미지 설정 및 공통 설정
FROM node:18-bullseye-slim AS base

RUN apt-get update \
    && apt-get install -y \
    python3 python3-pip build-essential libgcc1 libstdc++6 ninja-build \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm install -g pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

# 캐시 디렉토리 경로 설정
ENV PNPM_STORE_PATH="/pnpm/store"
ENV MEDIASOUP_CACHE_DIR="/mediasoup-cache"

# 2. Builder 단계
FROM base AS builder

# Turbo CLI 설치
RUN pnpm install -g turbo@^2.2.3

# PNPM 및 Turbo 캐시를 Docker 캐시 디렉토리에 연결
ARG PNPM_STORE_PATH=/pnpm/store
ARG MEDIASOUP_CACHE_DIR=/mediasoup-cache
ENV PNPM_STORE_PATH=${PNPM_STORE_PATH}
ENV MEDIASOUP_CACHE_DIR=${MEDIASOUP_CACHE_DIR}

# 캐시 디렉토리 생성
RUN mkdir -p ${PNPM_STORE_PATH} ${MEDIASOUP_CACHE_DIR}

# 의존성 파일만 우선 복사하여 캐시 활용
COPY package.json pnpm-lock.yaml ./

# PNPM 및 Turbo 캐시를 사용하여 의존성 설치
RUN pnpm install --frozen-lockfile --store=${PNPM_STORE_PATH}

# 소스 파일 전체 복사
COPY . .

# mediasoup 빌드
RUN pnpm build:mediasoup --output ${MEDIASOUP_CACHE_DIR}

# Turbo Prune으로 최소화된 결과 생성
RUN turbo prune --scope=@app/media --docker

# 3. Runner 단계
FROM base AS runner

# 작업 디렉토리 설정
WORKDIR /app

# PNPM 및 Turbo 캐시를 Docker 캐시 디렉토리에 연결
ARG PNPM_STORE_PATH=/pnpm/store
ARG MEDIASOUP_CACHE_DIR=/mediasoup-cache
ENV PNPM_STORE_PATH=${PNPM_STORE_PATH}
ENV MEDIASOUP_CACHE_DIR=${MEDIASOUP_CACHE_DIR}

# 캐시 디렉토리 생성
RUN mkdir -p ${PNPM_STORE_PATH} ${MEDIASOUP_CACHE_DIR}

# Turbo Prune 결과 복사
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# PNPM 및 Turbo 캐시를 사용하여 의존성 설치
RUN pnpm install --frozen-lockfile --store=${PNPM_STORE_PATH}

# 전체 소스 복사 및 빌드
COPY --from=builder /app/out/full/ .

# mediasoup 빌드 결과 사용
COPY --from=builder ${MEDIASOUP_CACHE_DIR}/build_output /app/apps/media/node_modules/.pnpm/mediasoup@3.15.1/node_modules/mediasoup

# 환경 파일 복사
COPY --from=builder /app/apps/media/.env /app/apps/media/dist/.env
COPY --from=builder /app/apps/media/.env /app/.env

# 포트 및 실행 환경 설정
EXPOSE 3002
ENV NODE_ENV=production

# 실행 명령
CMD ["node", "/app/apps/media/dist/main.js"]
