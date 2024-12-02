import { Module } from '@nestjs/common';

import { MediasoupModule } from '@/mediasoup/mediasoup.module';
import { NcpModule } from '@/ncp/ncp.module';
import { RoomModule } from '@/room/room.module';

import { RecordService } from './record.service';

@Module({
  imports: [RoomModule, MediasoupModule, NcpModule],
  providers: [RecordService],
  exports: [RecordService],
})
export class RecordModule {}
