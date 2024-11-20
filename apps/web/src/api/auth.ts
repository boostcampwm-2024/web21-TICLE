import axiosInstance from '@/api/axios';

interface SignUpBody {
  username: string;
  password: string;
  email: string;
  nickname?: string;
  introduce?: string;
  profileImageUrl?: string;
}

const logIn = async () => {
  await axiosInstance.post('/auth/login');
};

const signUp = async (body: SignUpBody) => {
  const { data } = await axiosInstance.post('/auth/signup', body);

  return data;
};

const oauthLogin = async (provider: 'google' | 'github') => {
  await axiosInstance.get(`/auth/${provider}/login`);
};

export { logIn, signUp, oauthLogin };
