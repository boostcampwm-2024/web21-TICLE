import { createFileRoute } from '@tanstack/react-router';

import BasicLayout from '@/components/common/BasicLayout';
import Detail from '@/components/ticle/detail';

export const Route = createFileRoute('/ticle/$ticleId')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <BasicLayout>
      <Detail />
    </BasicLayout>
  );
}
