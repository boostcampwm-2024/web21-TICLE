/* eslint-disable react-refresh/only-export-components */
import { Link } from '@tanstack/react-router';
import { Provider } from '@repo/types';

import UserProfileOfMeDialog from '@/components/user/UserProfileOfMeDialog';
import useAuthInfo from '@/hooks/useAuthInfo';
import useModal from '@/hooks/useModal';

import Avatar from '../Avatar';
import Button from '../Button';

export const LOGIN_TYPE: Record<Provider, string> = {
  github: 'Github 로그인',
  google: 'Google 로그인',
  guest: '게스트 로그인',
  local: '티클 로그인',
};

function User() {
  const { isLoading, isAuthenticated, authInfo } = useAuthInfo();

  const { isOpen, onOpen, onClose } = useModal();

  const AuthorizedContent = () => (
    <>
      <section className="flex cursor-pointer items-center gap-2" onClick={onOpen}>
        <Avatar size="xs" src={authInfo?.profileImageUrl} />
        <span className="text-body1 text-alt">{authInfo?.nickname}</span>
      </section>
      {isOpen && authInfo && (
        <UserProfileOfMeDialog
          onClose={onClose}
          isOpen={isOpen}
          profileImageUrl={authInfo.profileImageUrl}
          nickname={authInfo.nickname}
          loginType={LOGIN_TYPE[authInfo.provider]}
        />
      )}
    </>
  );

  const UnauthorizedContent = () => (
    <Link to="/auth/oauth" search={{ redirect: location.pathname }}>
      <section className="flex items-center justify-center">
        <Button size="sm">로그인</Button>
      </section>
    </Link>
  );

  return (
    <aside className="flex gap-3">
      {isAuthenticated && !isLoading ? <AuthorizedContent /> : <UnauthorizedContent />}
    </aside>
  );
}

export default User;
