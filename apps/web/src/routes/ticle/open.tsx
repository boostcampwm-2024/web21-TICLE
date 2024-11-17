import { createFileRoute } from '@tanstack/react-router';

import BasicLayout from '@/components/common/BasicLayout';

export const Route = createFileRoute('/ticle/open')({
  component: RouteComponent,
});

function RouteComponent() {
  return <BasicLayout></BasicLayout>;
}
