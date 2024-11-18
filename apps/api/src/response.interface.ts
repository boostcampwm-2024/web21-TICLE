export interface Response<T> {
  status: string;
  data: T;
}

export interface ErrorResponse {
  status: 'error';
  error: {
    code: number;
    message: string;
  };
}
