import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '@/app.controller';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { dbConfig } from './config/dbConfig';
import { StreamModule } from './stream/stream.module';
import { TicleModule } from './ticle/ticle.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, TicleModule, StreamModule, UserModule, TypeOrmModule.forRoot(dbConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
