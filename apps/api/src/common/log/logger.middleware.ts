import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;

      this.logger.log(
        `[${method}] ${originalUrl} - ${statusCode} - ${contentLength} bytes - UserAgent: ${userAgent}`,
        'HTTP'
      );
    });

    next();
  }
}
