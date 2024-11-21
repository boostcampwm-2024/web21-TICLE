import axiosInstance from '@/api/axios';

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

const oauthLogin = async (provider: 'google' | 'github') => {
  await axiosInstance.get(`/auth/${provider}/login`);
};

export { logIn, signUp, oauthLogin, signOut };
