import { createFileRoute } from '@tanstack/react-router'

import Apply from '@/components/dashboard/apply'

export const Route = createFileRoute('/_authenticated/dashboard/apply')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Apply />
}
