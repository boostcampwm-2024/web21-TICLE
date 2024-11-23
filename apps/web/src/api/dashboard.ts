import axiosInstance from '@/api/axios';

export interface GetDashboardTicleListParams {
  isSpeaker: boolean;
  page: number;
  pageSize: number;
  status: 'open' | 'close';
}

const getDashboardTicleList = async (params: GetDashboardTicleListParams) => {
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

export { getDashboardTicleList, startTicle, joinTicle, getApplicantsTicle };
