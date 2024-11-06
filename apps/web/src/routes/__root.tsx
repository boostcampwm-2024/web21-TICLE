import { Outlet, createRootRoute, useRouter } from '@tanstack/react-router';

import Header from '@/components/common/Header';

const NO_HEADER_PATHS = ['/live'];

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const shouldShowHeader = !NO_HEADER_PATHS.includes(currentPath);

  return (
    <>
      {shouldShowHeader && <Header />}
      <Outlet />
    </>
  );
}
