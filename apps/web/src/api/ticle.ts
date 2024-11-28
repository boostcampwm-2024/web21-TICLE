import {
  CreateTicleType,
  TicleListResponse,
  TicleListResponseSchema,
  TicleDetailResponse,
  TicleDetailResponseSchema,
} from '@repo/types';

import axiosInstance from '@/api/axios';
import request from '@/hooks/api/request';

type SortType = 'newest' | 'oldest' | 'trending';

interface GetTicleListParams {
  page?: number;
  pageSize?: number;
  isOpen?: boolean;
  sort?: SortType;
}

const getTitleList = async (params: GetTicleListParams = {}) => {
  return request<TicleListResponse>({
    method: 'GET',
    url: '/ticle/list',
    params,
    schema: TicleListResponseSchema,
  });
};

const getTicle = async (ticleId: string) => {
  return request<TicleDetailResponse>({
    method: 'GET',
    url: `/ticle/${ticleId}`,
    schema: TicleDetailResponseSchema,
  });
};

const createTicle = async (body: CreateTicleType) => {
  const { data } = await axiosInstance.post('/ticle', body);

  return data;
};

const applyTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.post(`/ticle/${ticleId}/apply`);

  return data;
};

const deleteTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.delete(`/ticle/${ticleId}`);

  return data;
};

export { getTitleList, getTicle, createTicle, applyTicle, deleteTicle };
