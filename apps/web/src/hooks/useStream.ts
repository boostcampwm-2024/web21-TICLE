/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

function useStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
    });

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  return stream;
}

export default useStream;
