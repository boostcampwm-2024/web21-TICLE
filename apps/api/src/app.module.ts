import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfigService } from '@/config/typeorm.config';

import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/log/logger.middleware';
import { LoggerModule } from './common/log/logger.module';
import { NcpModule } from './common/ncp/ncp.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StreamModule } from './stream/stream.module';
import { TicleModule } from './ticle/ticle.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    TicleModule,
    StreamModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    DashboardModule,
    LoggerModule,
    NcpModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // 모든 라우트에 미들웨어 적용
  }
}
