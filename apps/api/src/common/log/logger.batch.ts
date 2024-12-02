import fs from 'fs/promises';
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

  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  @Cron('10 * * * * *')
  async uploadLogToObjectStorage() {
    const logsDir = path.join(__dirname, '../../../logs');
    const today = new Date();
    today.setHours(today.getHours() + 9);
    today.setDate(today.getDate() - 1);

    const logFileName = `application-${today.toISOString().split('T')[0]}.log`;
    const localFilePath = path.join(logsDir, logFileName);
    try {
      await fs.access(localFilePath);

      const remoteFileName = `logs/${logFileName}`;
      const result = await this.ncpService.uploadFile(localFilePath, remoteFileName);
      this.loggerService.log(`Log file uploaded successfully: ${result}`, 'logBatchService');
    } catch (error) {
      const err = error as Error;
      this.loggerService.error(
        `Log file not found: ${localFilePath}`,
        err.stack,
        'logBatchService'
      );
    }
  }
}
