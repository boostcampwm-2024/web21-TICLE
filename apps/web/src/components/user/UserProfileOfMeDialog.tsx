import { useState, memo } from 'react';

import { logOut } from '@/api/auth';

import UserInfo from './UserInfo';
import Button from '../common/Button';
import { Dialog } from '../common/Dialog';
import Loading from '../common/Loading';

interface UserProfileOfMeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileImageUrl: string;
  nickname: string;
  loginType: string;
}

function UserProfileOfMeDialog({ isOpen, onClose, ...userInfo }: UserProfileOfMeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = () => {
    setIsLoading(true);
    logOut();
  };

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose} className="w-96">
      <Dialog.Title align="center">내 프로필</Dialog.Title>
      <Dialog.Close onClose={onClose} />
      <Dialog.Content className="w-full">
        <UserInfo {...userInfo} />
      </Dialog.Content>
      <Dialog.Footer variant="single">
        <Button size="full" onClick={handleLogout}>
          {isLoading ? (
            <span className="flex h-8 items-center">
              <Loading color="primary" />
            </span>
          ) : (
            '로그아웃'
          )}
        </Button>
      </Dialog.Footer>
    </Dialog.Root>
  );
}

export default memo(UserProfileOfMeDialog);
