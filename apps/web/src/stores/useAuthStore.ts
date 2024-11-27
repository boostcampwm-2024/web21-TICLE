import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Provider } from '@repo/types';

interface AuthInfo {
  nickname: string;
  profileImageUrl: string;
  provider: Provider;
}

interface AuthState {
  isAuthenticated: boolean;
  authInfo: AuthInfo | null;
  setAuthInfo: (authInfo: AuthInfo) => void;
  clearAuthState: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      authInfo: null,

      setAuthInfo: (authInfo) =>
        set({
          isAuthenticated: true,
          authInfo,
        }),

      clearAuthState: () =>
        set({
          isAuthenticated: false,
          authInfo: null,
        }),
    }),
    {
      name: 'auth-info',
    }
  )
);

export default useAuthStore;
