import { useQuery } from '@tanstack/react-query';

import { getUserProfileByUserId, getUserProfileOfMe } from '@/api/user';

export const useUserProfileOfMe = () => {
  return useQuery({
    queryKey: ['userProfileOfMe'],
    queryFn: getUserProfileOfMe,
    retry: 0,
  });
};

export const useUserProfile = (userId: number) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfileByUserId(userId),
  });
};
