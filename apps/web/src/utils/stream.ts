const DEFAULT_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  sampleRate: { ideal: 48000, min: 16000, max: 96000 },
  sampleSize: { ideal: 16, min: 8, max: 32 },
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

const DEFAULT_VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 1280, min: 640, max: 1920 },
  height: { ideal: 720, min: 360, max: 1080 },
  frameRate: { max: 30, ideal: 15, min: 15 },
  aspectRatio: { ideal: 16 / 9 },
};

const DEFAULT_SCREEN_CONSTRAINTS: MediaTrackConstraints = {
  width: { max: 1920, ideal: 1280 },
  height: { max: 1080, ideal: 720 },
  frameRate: { max: 30, ideal: 15 },
};

const getCameraStream = async (options: MediaTrackConstraints = {}) => {
  return navigator.mediaDevices.getUserMedia({
    video: {
      ...DEFAULT_VIDEO_CONSTRAINTS,
      ...options,
    },
  });
};

const getMicStream = async (options: MediaTrackConstraints = {}) => {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      ...DEFAULT_AUDIO_CONSTRAINTS,
      ...options,
    },
  });
};

const getScreenStream = async (options: MediaTrackConstraints = {}) => {
  return navigator.mediaDevices.getDisplayMedia({
    video: {
      ...DEFAULT_SCREEN_CONSTRAINTS,
      ...options,
    },
  });
};

export { getCameraStream, getMicStream, getScreenStream };
