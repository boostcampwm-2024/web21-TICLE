import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { logIn, signUp } from '@/api/auth';

export const useLogIn = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logIn,
    onSuccess: () => {
      navigate({ to: '/' });
    },
  });
};

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate({ to: '/auth/login' });
    },
  });
};

