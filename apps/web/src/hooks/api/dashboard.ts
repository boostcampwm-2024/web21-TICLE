import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getAppliedTicleList, getApplicantsTicle, startTicle, joinTicle } from '@/api/dashboard';

interface GetAppliedTicleListParams {
  isSpeaker: boolean;
  page: number;
  pageSize: number;
  status: 'open' | 'close';
}

export const useAppliedTicleList = (params: GetAppliedTicleListParams) => {
  return useQuery({
    queryKey: ['appliedTicleList', params],
    queryFn: () => getAppliedTicleList(params),
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
