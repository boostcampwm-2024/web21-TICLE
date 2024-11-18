import * as mediasoup from 'mediasoup-client';
import { useRef } from 'react';

import { Device, RtpCapabilities } from '@/types/mediasoup';

const useDevice = () => {
  const deviceRef = useRef<Device | null>(null);

  const createDevice = async (rtpCapabilities: RtpCapabilities) => {
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
