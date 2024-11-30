import { Module } from '@nestjs/common';

import { MediasoupModule } from '@/mediasoup/mediasoup.module';
import { RoomModule } from '@/room/room.module';

import { RecordService } from './record.service';

@Module({
  imports: [RoomModule, MediasoupModule],
  providers: [RecordService],
  exports: [],
})
export class RecordModule {}
