import axiosInstance from '@/api/axios';
import { ENV } from '@/constants/env';

type SignUpDto = {
  username: string;
  password: string;
  email: string;
  nickname?: string;
  introduce?: string;
  profileImageUrl?: string;
};

const logIn = async () => {
  await axiosInstance.post('/auth/login');
};

const signUp = async (body: SignUpDto) => {
  const { data } = await axiosInstance.post('/auth/signup', body);

  return data;
};

const signOut = async () => {
  await axiosInstance.post('/auth/logout');
};

const guestLogin = () => {
  window.location.href = `${ENV.API_URL}/auth/guest/login`;
};

const oauthLogin = (provider: 'google' | 'github') => {
  window.location.href = `${ENV.API_URL}/auth/${provider}/login`;
};

export { logIn, signUp, oauthLogin, guestLogin, signOut };
