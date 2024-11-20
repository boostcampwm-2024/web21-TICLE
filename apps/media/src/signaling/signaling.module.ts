import { Module } from '@nestjs/common';

import { MediasoupModule } from '@/mediasoup/mediasoup.module';

import { SignalingGateway } from './signaling.gateway';

@Module({
  imports: [MediasoupModule],
  providers: [SignalingGateway],
  exports: [SignalingGateway],
})
export class SignalingModule {}
