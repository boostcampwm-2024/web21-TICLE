import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/open')({
  component: RouteComponent,
});

function RouteComponent() {
  return '내가 개설한 티클';
}
