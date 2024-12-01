import ChevronRight from '@/assets/icons/chevron-right.svg?react';
import { ENV } from '@/constants/env';
import { Route } from '@/routes/auth/oauth';

function GuestLogin() {
  const { redirect } = Route.useSearch();
  const loginUrl = `${ENV.API_URL}/auth/guest/login?redirect=${redirect || ''}`;
  const handleGuestLogin = () => {
    window.location.href = loginUrl;
  };

  return (
    <span
      className="mt-3 flex cursor-pointer items-center gap-1.5 text-title2 text-main"
      onClick={handleGuestLogin}
    >
      게스트 로그인
      <ChevronRight className="w-2 fill-black" />
    </span>
  );
}

export default GuestLogin;
