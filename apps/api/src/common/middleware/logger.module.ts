import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { WinstonConfig } from '@/config/winston.confing';

import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [WinstonModule.forRoot(WinstonConfig)],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
