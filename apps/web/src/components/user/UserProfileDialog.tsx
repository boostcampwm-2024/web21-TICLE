import { Link, useNavigate } from '@tanstack/react-router';

import { useUserProfile } from '@/hooks/api/user';

import UserInfo from './UserInfo';
import { Dialog } from '../common/Dialog';
import { LOGIN_TYPE } from '../common/Header/User';

interface UserProfileOfMeProps {
  isOpen: boolean;
  onClose: () => void;
  speakerId: number;
  nickname: string;
}

function UserProfileDialog({ isOpen, onClose, speakerId, nickname }: UserProfileOfMeProps) {
  const { data } = useUserProfile(speakerId);
  const navigate = useNavigate({ from: '/ticle/$ticleId' });

  if (!data) return;

  const handleTicleClick = (ticleId: number) => {
    navigate({ to: `/ticle/${ticleId}` });
    onClose();
  };

  const loginType = data?.provider && LOGIN_TYPE[data.provider];
  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose} className="w-96">
      <Dialog.Title align="center">{nickname}님의 프로필</Dialog.Title>
      <Dialog.Close onClose={onClose} />
      <Dialog.Content className="w-full">
        <div className="flex flex-col gap-6">
          <UserInfo {...data} loginType={loginType} />
          <div className="flex flex-col gap-2.5">
            <h3 className="text-title2 text-main">개설한 티클 목록</h3>
            <div className="custom-scrollbar flex h-28 flex-col gap-2 overflow-y-scroll">
              {data.ticleInfo.map((info) => (
                <button
                  type="button"
                  key={info.ticleId}
                  onClick={() => handleTicleClick(info.ticleId)}
                  className="w-full rounded-md bg-teritary px-2.5 py-2 text-left text-label1 text-main"
                >
                  {info.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default UserProfileDialog;
