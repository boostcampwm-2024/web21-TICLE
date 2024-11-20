import { cva } from 'class-variance-authority';

import VideoPlayer from './VideoPlayer';

import { StreamData } from '.';

interface SubVideoGridProps {
  videoStreamData: StreamData[];
}

function SubVideoGrid({ videoStreamData }: SubVideoGridProps) {
  return (
    <div className="flex w-full justify-around">
      {videoStreamData.map((streamData) => (
        <div key={streamData.socketId} className="aspect-video w-44">
          <VideoPlayer stream={streamData.stream} />
        </div>
      ))}
    </div>
  );
}

export default SubVideoGrid;
