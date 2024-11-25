import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetDashboardListQueryType } from '@repo/types';

import { getDashboardTicleList, getApplicantsTicle, startTicle, joinTicle } from '@/api/dashboard';

export const useDashboardTicleList = (params: GetDashboardListQueryType) => {
  return useQuery({
    queryKey: ['dashboardTicleList', params],
    queryFn: () => getDashboardTicleList(params),
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
    onSuccess: (_, ticleId) => {
      queryClient.invalidateQueries({ queryKey: ['appliedTicleList'] });
      queryClient.invalidateQueries({ queryKey: ['applicantsTicle', ticleId] });
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
