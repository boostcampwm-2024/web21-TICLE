import { Module } from '@nestjs/common';

import { MediasoupService } from './mediasoup.service';
import { RoomService } from 'src/room/room.service';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [RoomModule],
  providers: [MediasoupService],
  exports: [MediasoupService],
})
export class MediasoupModule {}
