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
