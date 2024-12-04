import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class WSExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const errorMessage = exception.message || 'An unknown error occurred';

    const errorResponse = {
      status: 'error',
      error: { code: 500, message: errorMessage },
    };

    client.emit('error', errorResponse);
  }
}
