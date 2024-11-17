import { Module } from '@nestjs/common';

import { MediasoupModule } from 'src/mediasoup/mediasoup.module';

import { SignalingGateway } from './signaling.gateway';

@Module({
  imports: [MediasoupModule],
  providers: [SignalingGateway],
  exports: [SignalingGateway],
})
export class SignalingModule {}
