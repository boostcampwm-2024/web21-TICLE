import UserInfo from './UserInfo';
import Button from '../common/Button';
import { Dialog } from '../common/Dialog';

interface UserProfileOfMeProps {
  isOpen: boolean;
  onClose: () => void;
  profileImageUrl: string;
  nickname: string;
  loginType: string;
}

function UserProfileOfMeDialog({ isOpen, onClose, ...userInfo }: UserProfileOfMeProps) {
  const handleLogout = () => {
    // TODO: 로그아웃 처리
    alert('로그아웃 기능은 준비 중입니다!');
  };

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose} className="w-96">
      <Dialog.Title align="center">내 프로필</Dialog.Title>
      <Dialog.Close onClose={onClose} />
      <Dialog.Content className="w-96">
        <UserInfo {...userInfo} />
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
