import { useEffect, useRef, useState } from 'react';
import { client } from '@repo/mediasoup';

import { useRemoteStreamState } from '@/contexts/remoteStream/context';

interface AudioLevelData {
  socketId: string;
  audioLevel: number;
  analyser: AnalyserNode;
  dataArray: Float32Array;
}

const useAudioLevelDetector = () => {
  const { audioStreams } = useRemoteStreamState();

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioLevelsRef = useRef<AudioLevelData[]>([]);
  const intervalRef = useRef<number>();

  const lastActiveTimeRef = useRef<number>(0);
  const currentSpeakerRef = useRef<string | null>(null);

  const [activeSocketId, setActiveSocketId] = useState<string | null>(null);

  const startAudioLevelDetection = () => {
    const AUDIO_THRESHOLD = 0.01;
    const SPEECH_END_DELAY = 1000;

    const detectAudioLevels = () => {
      const unmutedStreamIds = new Set(
        audioStreams.filter((stream) => !stream.paused).map((stream) => stream.socketId)
      );

      const unmutedAudioLevels = audioLevelsRef.current.filter((data) =>
        unmutedStreamIds.has(data.socketId)
      );

      if (!unmutedAudioLevels.length) return;

      let maxLevel = 0;
      let maxLevelSocketId = null;

      unmutedAudioLevels.forEach((levelData) => {
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

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(detectAudioLevels, 300);
  };

  const resetAudioContext = () => {
    if (audioContextRef.current?.state === 'closed') {
      audioContextRef.current = new AudioContext();

      const audioContext = audioContextRef.current;

      audioStreams.forEach((stream) => {
        if (stream.kind === 'audio') {
          const source = audioContext.createMediaStreamSource(stream.stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Float32Array(analyser.frequencyBinCount);

          const audioLevelData: AudioLevelData = {
            socketId: stream.socketId,
            audioLevel: 0,
            analyser,
            dataArray,
          };

          audioLevelsRef.current = [...audioLevelsRef.current, audioLevelData];
        }
      });

      startAudioLevelDetection();
    }
  };

  const createAudioLevel = (remoteStream: client.RemoteStream) => {
    resetAudioContext();

    if (audioContextRef.current?.state === 'closed') {
      audioContextRef.current = null;
    }

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
    audioStreams.forEach((stream) => {
      if (stream.paused) return;
      createAudioLevel(stream);
    });
  }, [audioStreams]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }

      currentSpeakerRef.current = null;
      setActiveSocketId(null);
    };
  }, []);

  return {
    audioLevelsRef,
    activeSocketId,
    createAudioLevel,
  };
};

export default useAudioLevelDetector;
