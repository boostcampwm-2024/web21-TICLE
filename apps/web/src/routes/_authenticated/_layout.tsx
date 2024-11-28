import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import useAuthStore from '@/stores/useAuthStore';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/oauth',
        search: {
          redirect: location.href,
        },
        replace: true,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
