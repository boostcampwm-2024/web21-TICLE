import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { getTitleList, getTicle, createTicle, applyTicle } from '@/api/ticle';

interface GetTicleListParams {
  page?: number;
  pageSize?: number;
  isOpen?: boolean;
  sort?: 'newest' | 'oldest' | 'trending';
}

export const useTicleList = (params: GetTicleListParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['ticleList', params],
    queryFn: ({ pageParam = 1 }) =>
      getTitleList({
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta.hasNextPage) return undefined;
      return lastPage.meta.page + 1;
    },
    initialPageParam: 1,
  });
};

export const useTicle = (ticleId: string) => {
  return useQuery({
    queryKey: ['ticle', ticleId],
    queryFn: () => getTicle(ticleId),
    enabled: !!ticleId,
  });
};

export const useCreateTicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticleList'] });
    },
  });
};

export const useApplyTicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyTicle,
    onSuccess: (_, ticleId) => {
      queryClient.invalidateQueries({ queryKey: ['ticleList'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardTicleList'] });
      queryClient.invalidateQueries({ queryKey: ['applicantsTicle', ticleId] });
    },
  });
};
