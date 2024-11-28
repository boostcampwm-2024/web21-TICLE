import { createFileRoute } from '@tanstack/react-router';

import Open from '@/components/dashboard/open';

export const Route = createFileRoute('/_authenticated/dashboard/open')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Open />;
}
