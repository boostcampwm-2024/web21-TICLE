import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const errorMessage = exception.message || 'An unknown error occurred';

    client.emit('error', {
      status: 'error',
      error: {
        code: 500,
        message: errorMessage,
      },
    });
  }
}
