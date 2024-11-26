import {
  UserProfileOfMeResponse,
  UserProfileOfMeSchema,
  UserProfileResponse,
  UserProfileSchema,
} from '@repo/types';

import request from '@/hooks/api/request';

export const getUserProfileOfMe = async () => {
  return request<UserProfileOfMeResponse>({
    method: 'GET',
    url: '/user/me',
    schema: UserProfileOfMeSchema,
  });
};

export const getUserProfileByUserId = async (userId: number) => {
  return request<UserProfileResponse>({
    method: 'GET',
    url: `/user/${userId}`,
    schema: UserProfileSchema,
  });
};
