import { useMutation, useQueryClient } from '@tanstack/react-query';

import { endTicle } from '@/api/live';

export const useEndTicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: endTicle,
    onSuccess: (_, ticleId) => {
      queryClient.invalidateQueries({ queryKey: ['appliedTicleList'] });
      queryClient.invalidateQueries({ queryKey: ['ticleList'] });
      queryClient.invalidateQueries({ queryKey: ['ticle', ticleId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardTicleList'] });
    },
  });
};
