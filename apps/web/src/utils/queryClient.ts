import { QueryClient } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants/query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME,
      gcTime: STALE_TIME,
    },
  },
});

export default queryClient;
