import { Module } from '@nestjs/common';

import { NcpConfig } from './ncp.config';
import { NcpService } from './ncp.service';

@Module({
  providers: [NcpService, NcpConfig],
  exports: [NcpService],
})
export class NcpModule {}
