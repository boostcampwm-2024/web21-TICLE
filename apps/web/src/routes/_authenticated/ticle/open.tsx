import { createFileRoute } from '@tanstack/react-router';

import BasicLayout from '@/components/common/BasicLayout';
import Header from '@/components/common/Header';
import Open from '@/components/ticle/open';

export const Route = createFileRoute('/_authenticated/ticle/open')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <BasicLayout>
        <Open />
      </BasicLayout>
    </>
  );
}
