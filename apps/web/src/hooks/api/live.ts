import { useMutation, useQueryClient } from '@tanstack/react-query';

import { endTicle } from '@/api/live';

export const useEndTicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: endTicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliedTicleList'] });
    },
  });
};
