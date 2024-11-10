export type SuccessResponse<T> = {
  status: 'success';
  data: {
    result: T;
    message: string;
  };
};

export type ErrorResponse = {
  status: 'error';
  error: {
    code: number;
    message: string;
    details?: any;
  };
};

export class Response {
  static success<T>(
    result: T,
    message: string = '요청이 성공적으로 처리되었습니다.'
  ): SuccessResponse<T> {
    return {
      status: 'success',
      data: {
        result,
        message,
      },
    };
  }

  static error(
    code: number = 400,
    message: string = '유효하지 않은 요청입니다.',
    details?: any
  ): ErrorResponse {
    return {
      status: 'error',
      error: {
        code,
        message,
        details,
      },
    };
  }
}
