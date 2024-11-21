import * as mediasoup from 'mediasoup-client';
import { useRef } from 'react';
import type { client } from '@repo/mediasoup';

const useDevice = () => {
  const deviceRef = useRef<client.Device | null>(null);

  const createDevice = async (rtpCapabilities: client.RtpCapabilities) => {
    const device = new mediasoup.Device();

    await device.load({ routerRtpCapabilities: rtpCapabilities });
    deviceRef.current = device;

    return device;
  };

  return {
    deviceRef,
    createDevice,
  };
};

export default useDevice;
