import ControlBar from '@/components/live/ControlBar';
import StreamView from '@/components/live/StreamView';
import useMediasoup from '@/hooks/mediasoup/useMediasoup';

function MediaContainer() {
  useMediasoup();

  return (
    <div className="flex h-dvh flex-col justify-between gap-y-4 bg-black">
      <StreamView />
      <footer className="flex w-full justify-end gap-4 px-8 pb-4 text-white">
        <ControlBar />
      </footer>
    </div>
  );
}

export default MediaContainer;
