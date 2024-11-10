import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ticle/open')({
  component: RouteComponent,
});

function RouteComponent() {
  return '티클 개설하기';
}
