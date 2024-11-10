import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { SuccessResponse, ErrorResponse } from './response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<SuccessResponse<any> | ErrorResponse> {
    return next.handle().pipe(
      map((data) => ({
        status: 'success' as const,
        data: {
          result: data,
          message: this.getSuccessMessage(context),
        },
      })),
      catchError((error) => {
        if (error instanceof HttpException) {
          const response = error.getResponse();
          return throwError(() => ({
            status: 'error' as const,
            error: {
              code: error.getStatus(),
              message: error.message,
              details: response,
            },
          }));
        }
        return throwError(() => ({
          status: 'error',
          error: {
            code: 500,
            message: '서버 내부 오류가 발생했습니다.',
            details: error.message,
          },
        }));
      })
    );
  }

  private getSuccessMessage(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    switch (request.method) {
      case 'GET':
        return '데이터를 성공적으로 조회했습니다';
      case 'POST':
        return '데이터를 성공적으로 생성했습니다';
      case 'PATCH':
      case 'PUT':
        return '데이터를 성공적으로 수정했습니다';
      case 'DELETE':
        return '데이터를 성공적으로 삭제했습니다';
      default:
        return '요청이 성공적으로 처리되었습니다';
    }
  }
}
