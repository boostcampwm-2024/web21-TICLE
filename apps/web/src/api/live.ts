import axiosInstance from './axios';

export const endTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.post(`/dashboard/${ticleId}/end`);

  return data;
};
