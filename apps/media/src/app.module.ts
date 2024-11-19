import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SignalingModule } from './signaling/signaling.module';

@Module({
  imports: [
    SignalingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
