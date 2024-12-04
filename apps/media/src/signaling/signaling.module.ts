import { Module } from '@nestjs/common';

import { MediasoupModule } from '@/mediasoup/mediasoup.module';
import { RecordModule } from '@/record/record.module';

import { SignalingGateway } from './signaling.gateway';

@Module({
  imports: [MediasoupModule, RecordModule],
  providers: [SignalingGateway],
  exports: [SignalingGateway],
})
export class SignalingModule {}
