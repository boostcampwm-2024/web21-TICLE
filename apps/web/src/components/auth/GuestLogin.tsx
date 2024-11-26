/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { guestLogin } from '@/api/auth';
import ChevronRight from '@/assets/icons/chevron-right.svg?react';

function GuestLogin() {
  const handleGuestLogin = () => {
    guestLogin();
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
