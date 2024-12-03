import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { getTitleList, getTicle, createTicle, applyTicle, deleteTicle } from '@/api/ticle';
import { toast } from '@/core/toast';
import { renderSuccess } from '@/utils/toast/renderMessage';

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
      toast(renderSuccess('티클이 생성되었습니다.'));
      queryClient.invalidateQueries({ queryKey: ['ticleList'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardTicleList'] });
    },
  });
};

export const useApplyTicle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: '/ticle/$ticleId' });

  return useMutation({
    mutationFn: applyTicle,
    onSuccess: (_, ticleId) => {
      toast(renderSuccess('티클 신청이 완료되었습니다.'));
      navigate({ to: `/dashboard/apply` });
      queryClient.invalidateQueries({ queryKey: ['ticleList'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardTicleList'] });
      queryClient.invalidateQueries({ queryKey: ['ticle', ticleId] });
      queryClient.invalidateQueries({ queryKey: ['applicantsTicle', ticleId] });
    },
  });
};

export const useDeleteTicle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: '/ticle/$ticleId' });

  return useMutation({
    mutationFn: deleteTicle,
    onSuccess: () => {
      toast(renderSuccess('티클이 삭제되었습니다.'));
      navigate({ to: `/` });
      queryClient.invalidateQueries({ queryKey: ['ticleList'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardTicleList'] });
    },
  });
};
