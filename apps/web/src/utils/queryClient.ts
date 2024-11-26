import { QueryClient } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants/query';

import { handleError } from './errorHandler';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME,
      gcTime: STALE_TIME,
    },
    mutations: {
      onError: handleError,
    },
  },
});

export default queryClient;
