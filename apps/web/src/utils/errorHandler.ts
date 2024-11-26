import axios from 'axios';

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data;

      // TODO: alert가 아닌 toast로 교체
      alert(serverError?.error.message || '오류가 발생했습니다.');
    }
  }
};
