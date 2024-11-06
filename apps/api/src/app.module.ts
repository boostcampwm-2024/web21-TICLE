import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '@/app.controller';
import databaseConfig from 'config/database.config';
import { TypeOrmConfigService } from 'config/typeorm.config';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StreamModule } from './stream/stream.module';
import { TicleModule } from './ticle/ticle.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    AuthModule,
    TicleModule,
    StreamModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService, // TypeOrmConfigService로 대체
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
