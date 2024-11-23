import {
  DashboardApplicantsResponse,
  DashboardApplicantsResponseSchema,
  DashboardListResponse,
  DashboardListResponseSchema,
  GetDashboardListQueryType,
} from '@repo/types';

import axiosInstance from '@/api/axios';
import request from '@/hooks/api/request';

const getDashboardTicleList = async (params: GetDashboardListQueryType) => {
  return request<DashboardListResponse>({
    method: 'GET',
    url: '/dashboard',
    params,
    schema: DashboardListResponseSchema,
  });
};

const getApplicantsTicle = async (ticleId: string) => {
  return request<DashboardApplicantsResponse>({
    method: 'GET',
    url: `/dashboard/${ticleId}/applicants`,
    schema: DashboardApplicantsResponseSchema,
  });
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
