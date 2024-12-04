import { useParams } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';
import { client, SOCKET_EVENTS } from '@repo/mediasoup';

import { useMediasoupState } from '@/contexts/mediasoup/context';

const TICK = 10000;

const QUALITY_LEVEL = {
  average: {
    quality: 1,
    options: { packetLossRate: 2, jitter: 15, frameDropRate: 5, averageRTT: 150, nackCount: 20 },
  },
  poor: {
    quality: 0,
    options: { packetLossRate: 5, jitter: 30, frameDropRate: 10, averageRTT: 300, nackCount: 50 },
  },
} as const;

interface UseNetworkMonitorProps {
  streams: client.RemoteStream[];
}

const useNetworkMonitor = ({ streams }: UseNetworkMonitorProps) => {
  const { ticleId } = useParams({ from: '/_authenticated/live/$ticleId' });
  const { socketRef } = useMediasoupState();

  const getNotPausedStreams = (streams: client.RemoteStream[]) => {
    return streams.filter(
      (data) => !data?.paused && data.consumer?.closed === false && data.kind === 'video'
    );
  };

  const calculatePacketLossRate = useCallback((packetsLost: number, packetsReceived: number) => {
    const totalExpectedPackets = packetsReceived + packetsLost;

    if (totalExpectedPackets === 0) return 0;

    return (packetsLost / totalExpectedPackets) * 100;
  }, []);

  const calculateFrameRate = useCallback((framesReceived: number, framesDropped: number) => {
    if (framesReceived === 0) return 0;

    const totalFrames = framesReceived + framesDropped;

    return (framesDropped / totalFrames) * 100;
  }, []);

  const calculateAverageRTT = useCallback(
    (totalRoundTripTime: number, roundTripTimeMeasurements: number) => {
      if (roundTripTimeMeasurements === 0 || !totalRoundTripTime) return 0;

      return (totalRoundTripTime / roundTripTimeMeasurements) * 1000;
    },
    []
  );

  const getNetworkQuality = useCallback(
    (
      packetLossRate: number,
      jitter: number,
      frameDropRate: number,
      averageRTT: number,
      nackCount: number
    ) => {
      if (
        packetLossRate > QUALITY_LEVEL.average.options.packetLossRate ||
        jitter > QUALITY_LEVEL.average.options.jitter ||
        frameDropRate > QUALITY_LEVEL.average.options.frameDropRate ||
        averageRTT > QUALITY_LEVEL.average.options.averageRTT ||
        nackCount > QUALITY_LEVEL.average.options.nackCount
      ) {
        return 1;
      }

      if (
        packetLossRate > QUALITY_LEVEL.poor.options.packetLossRate ||
        jitter > QUALITY_LEVEL.poor.options.jitter ||
        frameDropRate > QUALITY_LEVEL.poor.options.frameDropRate ||
        averageRTT > QUALITY_LEVEL.poor.options.averageRTT ||
        nackCount > QUALITY_LEVEL.poor.options.nackCount
      ) {
        return 0;
      }

      return 2;
    },
    []
  );

  const checkNetworkQuality = async (streams: client.RemoteStream[]) => {
    const networkQualities = await Promise.all(
      streams.map(async (data) => {
        const { consumer } = data;

        if (!consumer) return;

        let networkQuality = 2; // 0: poor, 1: average, 2: good

        const stats = await consumer.getStats();

        stats.forEach((report) => {
          if (report.type !== 'inbound-rtp') return;

          const {
            packetsLost,
            jitter,
            packetsReceived,
            framesDropped,
            framesReceived,
            nackCount,
            totalRoundTripTime,
            roundTripTimeMeasurements,
          } = report;

          const packetLossRate = calculatePacketLossRate(packetsLost, packetsReceived);
          const frameDropRate = calculateFrameRate(framesReceived, framesDropped);
          const averageRTT = calculateAverageRTT(totalRoundTripTime, roundTripTimeMeasurements);

          networkQuality = getNetworkQuality(
            packetLossRate,
            jitter,
            frameDropRate,
            averageRTT,
            nackCount
          );
        });

        return { consumerId: consumer.id, networkQuality };
      })
    );

    return networkQualities;
  };

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) return;

    const interval = setInterval(async () => {
      const notPausedStreams = getNotPausedStreams(streams);

      const networkQualities = await checkNetworkQuality(notPausedStreams);

      socket.emit(SOCKET_EVENTS.changeConsumerPreferredLayers, {
        roomId: ticleId,
        networkQualities,
      });
    }, TICK);

    return () => clearInterval(interval);
  }, [streams, socketRef, ticleId]);
};

export default useNetworkMonitor;
