import { useEffect, useRef, useState } from 'react';
import { client } from '@repo/mediasoup';

interface AudioLevelData {
  socketId: string;
  audioLevel: number;
  analyser: AnalyserNode;
  dataArray: Float32Array;
}

const useAudioLevelDetector = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioLevelsRef = useRef<AudioLevelData[]>([]);

  const lastActiveTimeRef = useRef<number>(0);
  const currentSpeakerRef = useRef<string | null>(null);

  const [activeSocketId, setActiveSocketId] = useState<string | null>(null);

  const startAudioLevelDetection = () => {
    const AUDIO_THRESHOLD = 0.01;
    const SPEECH_END_DELAY = 1000;

    const detectAudioLevels = () => {
      const audioLevels = audioLevelsRef.current;

      let maxLevel = 0;
      let maxLevelSocketId = null;

      audioLevels.forEach((levelData) => {
        const { analyser, dataArray, socketId } = levelData;
        analyser.getFloatTimeDomainData(dataArray);

        let sum = 0;
        for (const amplitude of dataArray) {
          sum += amplitude * amplitude;
        }
        const level = Math.sqrt(sum / dataArray.length);

        if (level > maxLevel) {
          maxLevel = level;
          maxLevelSocketId = socketId;
        }
      });

      if (maxLevel > AUDIO_THRESHOLD) {
        lastActiveTimeRef.current = Date.now();

        if (currentSpeakerRef.current === null) {
          currentSpeakerRef.current = maxLevelSocketId;
          setActiveSocketId(maxLevelSocketId);
        } else if (maxLevelSocketId !== currentSpeakerRef.current) {
          currentSpeakerRef.current = maxLevelSocketId;
          setActiveSocketId(maxLevelSocketId);
        }
      } else {
        const activeTime = Date.now() - lastActiveTimeRef.current;

        if (activeTime > SPEECH_END_DELAY && currentSpeakerRef.current !== null) {
          currentSpeakerRef.current = null;
          setActiveSocketId(null);
        }
      }
    };

    setInterval(detectAudioLevels, 300);
  };

  const createAudioLevel = (remoteStream: client.RemoteStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    const audioLevels = audioLevelsRef.current;

    const isExist = audioLevels.some((data) => data.socketId === remoteStream.socketId);
    if (isExist || remoteStream.kind !== 'audio') return;

    const source = audioContext.createMediaStreamSource(remoteStream.stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Float32Array(analyser.frequencyBinCount);

    const audioLevelData: AudioLevelData = {
      socketId: remoteStream.socketId,
      audioLevel: 0,
      analyser,
      dataArray,
    };

    audioLevelsRef.current = [...audioLevels, audioLevelData];

    if (audioLevelsRef.current.length === 1) {
      startAudioLevelDetection();
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    audioLevelsRef,
    activeSocketId,
    createAudioLevel,
  };
};

export default useAudioLevelDetector;
