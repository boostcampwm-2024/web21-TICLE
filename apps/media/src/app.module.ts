import { Module } from '@nestjs/common';

import { MediasoupModule } from './mediasoup/mediasoup.module';
import { MediasoupService } from './mediasoup/mediasoup.service';
import { SignalingModule } from './signaling/signaling.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [SignalingModule, MediasoupModule, RoomModule],
  controllers: [],
  providers: [MediasoupService],
})
export class AppModule {}
