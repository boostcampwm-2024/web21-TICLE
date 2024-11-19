import { Module } from '@nestjs/common';

import { RoomModule } from 'src/room/room.module';

import { MediasoupConfig } from './config';
import { MediasoupService } from './mediasoup.service';

@Module({
  imports: [RoomModule],
  providers: [MediasoupService, MediasoupConfig],
  exports: [MediasoupService],
})
export class MediasoupModule {}
