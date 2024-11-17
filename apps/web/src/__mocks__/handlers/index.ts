import { http } from 'msw';

import { logIn, signUp } from '@/__mocks__/handlers/auth';
import { getAppliedTicleList } from '@/__mocks__/handlers/dashboard';
import { applyTicle, createTicle, getTicle, getTicleList } from '@/__mocks__/handlers/ticle';
import { ENV } from '@/constants/env';

const API_URL = ENV.API_URL;

export const handlers = [
  // ticle handlers
  http.get(`${API_URL}/ticle/list`, getTicleList),
  http.get(`${API_URL}/ticle/:ticleId`, getTicle),
  http.post(`${API_URL}/ticle`, createTicle),
  http.post(`${API_URL}/ticle/:ticleId/apply`, applyTicle),

  // dashboard handlers
  http.get(`${API_URL}/dashboard`, getAppliedTicleList),
  http.post(`${API_URL}/dashboard/start`, getAppliedTicleList),
  http.post(`${API_URL}/dashboard/join`, getAppliedTicleList),
  http.get(`${API_URL}/dashboard/:ticleId/applicants`, getAppliedTicleList),

  // auth handlers
  http.get(`${API_URL}/auth/google/login`, logIn),
  http.get(`${API_URL}/auth/github/login`, logIn),
  http.post(`${API_URL}/auth/signup`, signUp),
  http.post(`${API_URL}/auth/login`, logIn),
];
