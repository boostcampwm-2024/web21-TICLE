import { useUserProfileOfMe } from '@/hooks/api/user';

import Avatar from '../Avatar';

function UserInfo() {
  const { data } = useUserProfileOfMe();

  return (
    <aside className="flex items-center gap-2">
      <Avatar size="xs" />
      <span className="text-body1 text-alt">{data?.nickname}</span>
    </aside>
  );
}

export default UserInfo;
