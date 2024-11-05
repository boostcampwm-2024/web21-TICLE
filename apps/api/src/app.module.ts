import { Module } from '@nestjs/common';

import { AppController } from '@/app.controller';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StreamModule } from './stream/stream.module';
import { TicleModule } from './ticle/ticle.module';

@Module({
  imports: [AuthModule, TicleModule, StreamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
