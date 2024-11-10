import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/apply')({
  component: RouteComponent,
});

function RouteComponent() {
  return '내가 신청한 티클';
}
