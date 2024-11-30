import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { GetDashboardListQueryType } from '@repo/types';

import { getDashboardTicleList, getApplicantsTicle, startTicle, joinTicle } from '@/api/dashboard';

export const useDashboardTicleList = (params: GetDashboardListQueryType) => {
  return useInfiniteQuery({
    queryKey: ['dashboardTicleList', params],
    queryFn: ({ pageParam = 1 }) =>
      getDashboardTicleList({
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta.hasNextPage) return undefined;
      return lastPage.meta.page + 1;
    },
    initialPageParam: 1,
    placeholderData: (previousData) => previousData,
  });
};

export const useApplicantsTicle = (ticleId: string) => {
  return useQuery({
    queryKey: ['applicantsTicle', ticleId],
    queryFn: () => getApplicantsTicle(ticleId),
    enabled: !!ticleId,
  });
};

export const useStartTicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startTicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliedTicleList'] });
    },
  });
};

export const useJoinTicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinTicle,
    onSuccess: (_, ticleId) => {
      queryClient.invalidateQueries({ queryKey: ['appliedTicleList'] });
      queryClient.invalidateQueries({ queryKey: ['applicantsTicle', ticleId] });
    },
  });
};
