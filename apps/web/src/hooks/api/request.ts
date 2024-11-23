import { AxiosRequestConfig } from 'axios';
import { z } from 'zod';

import axiosInstance from '@/api/axios';

const request = async <T>({
  schema,
  ...config
}: AxiosRequestConfig & {
  schema: z.ZodSchema<T>;
}): Promise<T> => {
  const { data: response } = await axiosInstance.request(config);
  const validation = schema.safeParse(response.data);

  if (!validation.success) {
    const errorDetails = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      error: issue.message,
      received: issue.path.reduce((obj, key) => obj?.[key], response.data),
    }));

    // eslint-disable-next-line no-console
    console.error(
      `서버 응답이 정의된 스키마와 일치하지 않습니다. (${config.method} ${config.url})`,
      JSON.stringify(errorDetails, null, 2)
    );
  }

  return response.data;
};

export default request;
