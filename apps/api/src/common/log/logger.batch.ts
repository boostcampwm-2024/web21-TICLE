import path from 'path';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { LoggerService } from './logger.service';
import { NcpService } from '../ncp/ncp.service';

@Injectable()
export class LogBatchService {
  constructor(
    private readonly ncpService: NcpService,
    private readonly loggerService: LoggerService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async uploadLogToObjectStorage() {
    const logsDir = path.join(__dirname, '../../../logs');
    console.log('logsDir : ', logsDir);
    const today = new Date();
    today.setHours(today.getHours() + 9);
    today.setDate(today.getDate() - 1);

    console.log('today : ', today);
    const logFileName = `application-${today.toISOString().split('T')[0]}.log`;
    const localFilePath = path.join(logsDir, logFileName);

    console.log('localFilePath : ', localFilePath);
    try {
      const remoteFileName = `logs/${logFileName}`;
      const result = await this.ncpService.uploadFile(localFilePath, remoteFileName);
      this.loggerService.log(`Log file uploaded successfully: ${result}`, 'logBatchService');
    } catch (error) {
      this.loggerService.log(`Failed to upload log file: ${error}`, 'logBatchService');
    }
  }
}
