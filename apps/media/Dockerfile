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
ENV MEDIASOUP_CACHE_DIR="/mediasoup-cache"

# 2. Builder 단계
FROM base AS builder

ARG MEDIASOUP_CACHE_DIR
ENV MEDIASOUP_CACHE_DIR=${MEDIASOUP_CACHE_DIR}

# 의존성 파일만 우선 복사하여 캐시 활용
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile && echo "Dependencies installed successfully"

# 소스 파일 전체 복사 및 전체 빌드
COPY . .
RUN pnpm build && echo "Build completed successfully"

# 3. Mediasoup 빌드 결과 캐싱
RUN mkdir -p ${MEDIASOUP_CACHE_DIR} && \
    cp -r node_modules/.pnpm/mediasoup@*/node_modules/mediasoup ${MEDIASOUP_CACHE_DIR} && echo "Mediasoup cached successfully"

# 4. Runner 단계
FROM base AS runner

# 작업 디렉토리 설정
WORKDIR /app

# 캐시된 mediasoup 빌드 결과물 복사
COPY --from=builder ${MEDIASOUP_CACHE_DIR}/mediasoup ./node_modules/mediasoup
RUN echo "Mediasoup copied to runner"

# 나머지 파일 복사 및 실행
COPY --from=builder /app .

# 포트 및 실행 환경 설정
EXPOSE 3002
ENV NODE_ENV=production

# 실행 명령
CMD ["node", "/app/apps/media/dist/main.js"]
