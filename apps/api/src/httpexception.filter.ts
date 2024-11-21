import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

import { ErrorResponse } from './response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.message;

    const errorResponse: ErrorResponse = {
      status: 'error',
      error: {
        code: status,
        message: message,
      },
    };
    response.status(status).json(errorResponse);
  }
}
