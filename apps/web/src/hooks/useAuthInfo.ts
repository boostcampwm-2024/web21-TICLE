import { useEffect } from 'react';

import useAuthStore, { AuthInfo } from '@/stores/useAuthStore';

import { useUserProfileOfMe } from './api/user';

interface AuthInfoReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  authInfo: AuthInfo | null;
}

const useAuthInfo = (): AuthInfoReturn => {
  const { data: user, isError } = useUserProfileOfMe();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authInfo = useAuthStore((state) => state.authInfo);
  const setAuthInfo = useAuthStore((state) => state.setAuthInfo);
  const clearAuthState = useAuthStore((state) => state.clearAuthState);

  useEffect(() => {
    if (!user) {
      clearAuthState();
      return;
    }

    setAuthInfo({
      userId: user.id.toString(),
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl,
      provider: user.provider,
    });
  }, [user, isError, setAuthInfo, clearAuthState]);

  return {
    isLoading: !user && !isError,
    isAuthenticated,
    authInfo,
  };
};

export default useAuthInfo;
