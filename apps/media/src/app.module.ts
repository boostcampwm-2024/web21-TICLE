import { Module } from '@nestjs/common';

import { SignalingModule } from './signaling/signaling.module';

import { ConfigModule } from '@nestjs/config';
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
