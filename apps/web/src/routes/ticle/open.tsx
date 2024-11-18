import { createFileRoute } from '@tanstack/react-router';

import BasicLayout from '@/components/common/BasicLayout';
import Open from '@/components/ticle/open';

export const Route = createFileRoute('/ticle/open')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <BasicLayout>
      <Open />
    </BasicLayout>
  );
}
