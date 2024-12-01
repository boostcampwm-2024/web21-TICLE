import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';

import { WinstonConfig } from '@/config/winston.confing';

import { LogBatchService } from './logger.batch';
import { LoggerService } from './logger.service';
import { NcpModule } from '../ncp/ncp.module';

@Global()
@Module({
  imports: [WinstonModule.forRoot(WinstonConfig), ScheduleModule.forRoot(), NcpModule],
  providers: [LoggerService, LogBatchService],
  exports: [LoggerService],
})
export class LoggerModule {}
