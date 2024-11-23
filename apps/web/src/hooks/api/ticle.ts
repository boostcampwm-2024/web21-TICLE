import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getTitleList, getTicle, createTicle, applyTicle } from '@/api/ticle';

interface GetTicleListParams {
  page?: number;
  pageSize?: number;
  isOpen?: boolean;
  sort?: 'newest' | 'oldest' | 'trending';
}

export const useTicleList = (params: GetTicleListParams = {}) => {
  return useQuery({
    queryKey: ['ticleList', params],
    queryFn: () => getTitleList(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
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
      queryClient.invalidateQueries({ queryKey: ['ticle', ticleId] });
    },
  });
};
