import { HttpResponse, HttpResponseResolver } from 'msw';

import applicantUserData from '@/__mocks__/data/dashboards/applicants-user.json';
import ticleData from '@/__mocks__/data/dashboards/dashboard.json';

export const getAppliedTicleList: HttpResponseResolver<{ ticleId: string }> = async () => {
  return HttpResponse.json({ status: 'success', data: ticleData });
};

export const getApplicants = async () => {
  // TODO: 맞는 유저 데이터를 가져오도록 수정
  return HttpResponse.json({ status: 'success', data: applicantUserData });
};

export const startTicle = async () => {};

export const joinTicle = async () => {};
