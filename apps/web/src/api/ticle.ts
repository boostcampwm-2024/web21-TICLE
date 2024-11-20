import axiosInstance from '@/api/axios';

type SortType = 'newest' | 'oldest' | 'trending';

interface GetTicleListParams {
  page?: number;
  pageSize?: number;
  isOpen?: boolean;
  sort?: SortType;
}

const getTitleList = async (params: GetTicleListParams = {}) => {
  const { data } = await axiosInstance.get('/ticle/list', { params });

  return { data };
};

const getTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.get(`/ticle/${ticleId}`);

  return { data };
};

const createTicle = async (data: Record<string, unknown>) => {};

const applyTicle = async () => {};

export { getTitleList, getTicle, createTicle, applyTicle };
