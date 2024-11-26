import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { Dialog } from '../common/Dialog';

interface UserProfileOfMeProps {
  isOpen: boolean;
  onClose: () => void;
  profileImageUrl: string;
  nickname: string;
  loginType: string;
}

function UserProfileOfMeDialog({
  isOpen,
  onClose,
  profileImageUrl,
  nickname,
  loginType,
}: UserProfileOfMeProps) {
  const handleLogout = () => {
    // TODO: 로그아웃 처리
    alert('로그아웃 기능은 준비 중입니다!');
  };

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose} className="w-96">
      <Dialog.Title align="center">내 프로필</Dialog.Title>
      <Dialog.Close onClose={onClose} />
      <Dialog.Content className="w-96">
        <div className="flex items-center gap-6">
          <Avatar size="md" src={profileImageUrl} />
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2.5">
              <span className="text-title2 text-main">이름</span>
              <span className="text-body3 text-main">{nickname}</span>
            </div>
            <div className="flex gap-2.5">
              <span className="text-title2 text-main">로그인 방식</span>
              <span className="text-body3 text-main">{loginType}</span>
            </div>
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Footer variant="single">
        <Button size="full" onClick={handleLogout}>
          로그아웃
        </Button>
      </Dialog.Footer>
    </Dialog.Root>
  );
}

export default UserProfileOfMeDialog;
