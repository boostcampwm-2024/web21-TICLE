import axiosInstance from '@/api/axios';

interface GetAppliedTicleListParams {
  isSpeaker: boolean;
  page: number;
  pageSize: number;
  status: 'open' | 'close';
}

const getAppliedTicleList = async (params: GetAppliedTicleListParams) => {
  const { data } = await axiosInstance.get('/dashboard', { params });

  return data;
};

const getApplicantsTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.get(`/dashboard/${ticleId}/applicants`);

  return data;
};

const startTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.post('/dashboard/start', { ticleId });

  return data;
};

const joinTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.post('/dashboard/join', { ticleId });

  return data;
};

export { getAppliedTicleList, startTicle, joinTicle, getApplicantsTicle };
