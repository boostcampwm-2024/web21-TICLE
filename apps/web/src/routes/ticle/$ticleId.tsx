import { createFileRoute } from '@tanstack/react-router';

import BasicLayout from '@/components/common/BasicLayout';
import Header from '@/components/Header';
import Detail from '@/components/ticle/detail';

export const Route = createFileRoute('/ticle/$ticleId')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <BasicLayout>
        <Detail />
      </BasicLayout>
    </>
  );
}
