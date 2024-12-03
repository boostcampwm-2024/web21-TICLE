import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { SOCKET_EVENTS } from '@repo/mediasoup';

import Button from '@/components/common/Button';
import { useMediasoupState } from '@/contexts/mediasoup/context';

function AiSummary() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const { socketRef } = useMediasoupState();
  const { ticleId: roomId } = useParams({ from: '/_authenticated/live/$ticleId' });

  const handleRecordStart = () => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.startRecord, { roomId });
    setIsRecording(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="text-body1">
        녹음 시작 버튼을 눌러 AI 음성 요약을 위한 음성 스트림을 녹음할 수 있습니다. 요약 내용은
        대시보드에서 확인할 수 있습니다.
      </span>
      <div className="flex gap-4">
        <Button size="full" variant="secondary" disabled={isRecording} onClick={handleRecordStart}>
          {isRecording ? '녹음 중' : '녹음 시작'}
        </Button>
      </div>
    </div>
  );
}

export default AiSummary;
