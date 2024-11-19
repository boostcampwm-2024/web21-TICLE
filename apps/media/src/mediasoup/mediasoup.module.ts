import { Module } from '@nestjs/common';

import { MediasoupService } from './mediasoup.service';
import { RoomModule } from 'src/room/room.module';
import { MediasoupConfig } from './config';

@Module({
  imports: [RoomModule],
  providers: [MediasoupService, MediasoupConfig],
  exports: [MediasoupService],
})
export class MediasoupModule {}
