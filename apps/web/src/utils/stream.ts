const DEFAULT_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  sampleRate: { ideal: 48000, min: 16000, max: 96000 },
  sampleSize: { ideal: 16, min: 8, max: 32 },
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

const getCameraStream = async (options: MediaTrackConstraints = {}) => {
  return navigator.mediaDevices.getUserMedia({
    video: { ...options },
  });
};

const getMicStream = async (options: MediaTrackConstraints = {}) => {
  return navigator.mediaDevices.getUserMedia({
    audio: { ...DEFAULT_AUDIO_CONSTRAINTS, ...options },
  });
};

const getScreenStream = async (options: MediaTrackConstraints = {}) => {
  return navigator.mediaDevices.getDisplayMedia({
    video: { ...options },
  });
};

export { getCameraStream, getMicStream, getScreenStream };
