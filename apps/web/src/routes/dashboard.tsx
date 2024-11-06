import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import DashboardTab from '@/components/dashboard';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: () => {
    if (window.location.pathname === '/dashboard') {
      throw redirect({
        to: '/dashboard/apply',
      });
    }
  },
});

function RouteComponent() {
  return (
    <>
      <DashboardTab />
      <Outlet />
    </>
  );
}
