# Base 이미지 설정
FROM node:18-bullseye-slim AS base

# Runner 단계
FROM base AS runner

# 런타임에 필요한 패키지 설치
RUN apt-get update \
    && apt-get install -y \
    libc6-dev \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 결과물과 환경 변수 복사
COPY --from=builder /app/apps/media/dist /app/apps/media/dist
COPY --from=builder /app/apps/media/.env /app/apps/media/dist/.env
COPY --from=builder /app/.env /app/.env
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# 포트 노출
EXPOSE 3002

# 프로덕션 환경 설정
ENV NODE_ENV=production

# 애플리케이션 시작 명령어
CMD ["node", "/app/apps/media/dist/main.js"]
