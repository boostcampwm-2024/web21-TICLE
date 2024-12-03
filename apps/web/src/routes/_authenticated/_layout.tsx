import { queryOptions } from '@tanstack/react-query';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { isAxiosError } from 'axios';

import { getUserProfileOfMe } from '@/api/user';
import useAuthStore from '@/stores/useAuthStore';
import queryClient from '@/utils/queryClient';

const userProfileOfMeOptions = queryOptions({
  queryKey: ['userProfileOfMe'],
  queryFn: () => getUserProfileOfMe(),
});

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    try {
      const userData = await queryClient.ensureQueryData(userProfileOfMeOptions);

      useAuthStore.setState({
        authInfo: {
          nickname: userData.nickname,
          profileImageUrl: userData.profileImageUrl,
          provider: userData.provider,
          userId: userData.id.toString(),
        },
        isAuthenticated: true,
      });

      return userData;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.setState({
          authInfo: null,
          isAuthenticated: false,
        });

        throw redirect({
          to: '/auth/oauth',
          search: {
            redirect: location.pathname,
          },
          replace: true,
        });
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
