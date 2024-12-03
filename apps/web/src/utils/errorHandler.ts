import axios from 'axios';

import { toast } from '@/core/toast';
import { renderError } from '@/utils/toast/renderMessage';

export const handleError = (error: unknown) => {
  if (!(error instanceof Error)) return;

  if (!axios.isAxiosError(error)) return;

  const serverError = error.response?.data;
  toast(renderError(serverError?.error.message || '오류가 발생했습니다.'));
};
