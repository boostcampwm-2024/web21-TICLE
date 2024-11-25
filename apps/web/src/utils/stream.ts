const getCameraStream = async () => {
  return navigator.mediaDevices.getUserMedia({ video: true });
};

const getMicStream = async () => {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      sampleRate: 48000,
      sampleSize: 16,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
};

const getScreenStream = async () => {
  return navigator.mediaDevices.getDisplayMedia({
    video: {
      width: { max: 1920 },
      height: { max: 1080 },
      frameRate: { max: 30 },
    },
  });
};

export { getCameraStream, getMicStream, getScreenStream };
