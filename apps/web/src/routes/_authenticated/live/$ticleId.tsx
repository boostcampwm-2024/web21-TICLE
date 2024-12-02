import { createFileRoute } from '@tanstack/react-router';

import MediaContainer from '@/components/live';
import { DummyStreamProvider } from '@/contexts/dummyStream/provider';
import { LocalStreamProvider } from '@/contexts/localStream/provider';
import { MediasoupProvider } from '@/contexts/mediasoup/provider';
import { RemoteStreamProvider } from '@/contexts/remoteStream/provider';

export const Route = createFileRoute('/_authenticated/live/$ticleId')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MediasoupProvider>
      <LocalStreamProvider>
        <RemoteStreamProvider>
          <DummyStreamProvider>
            <MediaContainer />
          </DummyStreamProvider>
        </RemoteStreamProvider>
      </LocalStreamProvider>
    </MediasoupProvider>
  );
}
