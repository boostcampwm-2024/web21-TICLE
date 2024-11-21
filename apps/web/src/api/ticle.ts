import { CreateTicleType } from '@repo/types';

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

  return data;
};

const getTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.get(`/ticle/${ticleId}`);

  return data;
};

const createTicle = async (body: CreateTicleType) => {
  const { data } = await axiosInstance.post('/ticle', body);

  return data;
};

const applyTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.post(`/ticle/${ticleId}/apply`);

  return data;
};

export { getTitleList, getTicle, createTicle, applyTicle };
