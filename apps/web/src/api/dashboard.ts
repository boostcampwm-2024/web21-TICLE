import {
  DashboardAiSummaryResponse,
  DashboardAiSummaryResponseSchema,
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

const getAiSummary = async (ticleId: string) => {
  return request<DashboardAiSummaryResponse>({
    method: 'GET',
    url: `/stream/summary/${ticleId}`,
    schema: DashboardAiSummaryResponseSchema,
  });
};

const startTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.post(`/dashboard/${ticleId}/start`);

  return data;
};

const joinTicle = async (ticleId: string) => {
  const { data } = await axiosInstance.post('/dashboard/join', { ticleId });

  return data;
};

export { getDashboardTicleList, startTicle, joinTicle, getApplicantsTicle, getAiSummary };
