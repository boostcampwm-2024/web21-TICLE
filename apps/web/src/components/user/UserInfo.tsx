import Avatar from '../common/Avatar';

interface UserInfoProps {
  profileImageUrl: string;
  nickname: string;
  loginType: string;
}

function UserInfo({ profileImageUrl, nickname, loginType }: UserInfoProps) {
  return (
    <div className="flex items-center gap-6">
      <Avatar size="md" src={profileImageUrl} />
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2.5">
          <span className="text-title2 text-main">아이디</span>
          <span className="text-body3 text-main">{nickname}</span>
        </div>
        <div className="flex gap-2.5">
          <span className="text-title2 text-main">로그인 방식</span>
          <span className="text-body3 text-main">{loginType}</span>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
