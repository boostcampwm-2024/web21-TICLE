import { Link } from '@tanstack/react-router';
import axios from 'axios';
import { Provider } from '@repo/types';

import UserProfileOfMeDialog from '@/components/user/UserProfileOfMeDialog';
import { useUserProfileOfMe } from '@/hooks/api/user';
import useModal from '@/hooks/useModal';

import Avatar from '../Avatar';
import Button from '../Button';

const LOGIN_TYPE: Record<Provider, string> = {
  github: 'Github 로그인',
  google: 'Google 로그인',
  guest: '게스트 로그인',
  local: '티클 로그인',
};

function UserInfo() {
  const { data, error, isLoading } = useUserProfileOfMe();
  const { isOpen, onOpen, onClose } = useModal();

  const isUnauthorized = axios.isAxiosError(error) && error.response?.status === 401;

  const loginType = data?.provider && LOGIN_TYPE[data.provider];

  const AuthorizedContent = () => (
    <>
      <section className="flex cursor-pointer items-center gap-2" onClick={onOpen}>
        <Avatar size="xs" src={data?.profileImageUrl} />
        <span className="text-body1 text-alt">{data?.nickname}</span>
      </section>
      {isOpen && data && loginType && (
        <UserProfileOfMeDialog
          onClose={onClose}
          isOpen={isOpen}
          profileImageUrl={data.profileImageUrl}
          nickname={data.nickname}
          loginType={loginType}
        />
      )}
    </>
  );

  const UnauthorizedContent = () => (
    <Link to="/auth/oauth">
      <section className="flex items-center justify-center">
        <Button size="sm">로그인</Button>
      </section>
    </Link>
  );

  return (
    <aside className="flex gap-3">
      {isUnauthorized || isLoading ? <UnauthorizedContent /> : <AuthorizedContent />}
    </aside>
  );
}

export default UserInfo;
