import { types } from 'mediasoup-client';

import ControlBar from '@/components/live/ControlBar';
import StreamView from '@/components/live/StreamView';
import useMediasoup from '@/hooks/mediasoup/useMediasoup';

export interface StreamData {
  consumer?: types.Consumer;
  socketId: string;
  kind: types.MediaKind;
  stream: MediaStream | null;
  paused: boolean;
}

function MediaContainer() {
  useMediasoup();

  return (
    <div className="fixed inset-0 flex flex-col justify-between bg-black px-32">
      <StreamView />
      <footer className="flex h-[70px] w-full justify-end gap-4 pb-4 text-white">
        <ControlBar />
      </footer>
    </div>
  );
}

export default MediaContainer;
