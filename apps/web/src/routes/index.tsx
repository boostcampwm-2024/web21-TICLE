import { createFileRoute } from '@tanstack/react-router';

import BasicLayout from '@/components/common/BasicLayout';
import TicleList from '@/components/ticle/list';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <BasicLayout className="my-12 px-[7.5rem]">
      <TicleList />
    </BasicLayout>
  );
}
