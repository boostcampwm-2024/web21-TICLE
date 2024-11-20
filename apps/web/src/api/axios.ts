import axios from 'axios';

import { ENV } from '@/constants/env';

const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 5000,
});
export default axiosInstance;
