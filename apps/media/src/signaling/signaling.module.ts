import { Module } from '@nestjs/common';

import { MediasoupModule } from '@/mediasoup/mediasoup.module';
import { RecordModule } from '@/record/record.module';
import { RoomModule } from '@/room/room.module';

import { SignalingGateway } from './signaling.gateway';

@Module({
  imports: [MediasoupModule, RecordModule, RoomModule],
  providers: [SignalingGateway],
  exports: [SignalingGateway],
})
export class SignalingModule {}
