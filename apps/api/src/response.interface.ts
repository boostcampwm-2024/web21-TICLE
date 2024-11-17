export interface Response<T> {
  status: string;
  data: T;
}

export type ErrorResponse = {
  status: 'error';
  error: {
    code: number;
    message: string;
    details?: any;
  };
};
