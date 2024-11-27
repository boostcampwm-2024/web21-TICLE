import { createFileRoute } from '@tanstack/react-router'

import BasicLayout from '@/components/common/BasicLayout'
import Header from '@/components/common/Header'
import Detail from '@/components/ticle/detail'

export const Route = createFileRoute('/_authenticated/ticle/$ticleId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <BasicLayout>
        <Detail />
      </BasicLayout>
    </>
  )
}
