import { Link } from '@tanstack/react-router';

import TicleCharacterBadge from '@/assets/images/ticle-character-badge.png';
import TicleLogo from '@/assets/ticle.svg?react';
import Button from '@/components/common/Button';

function NotFound() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-8 px-2">
      <img src={TicleCharacterBadge} alt="티클 캐릭터" width={150} height={150} />
      <TicleLogo className="fill-primary" width={190} />
      <h1 className="text-center text-2xl font-bold">페이지가 존재하지 않습니다</h1>
      <Link to="/">
        <Button>홈으로 돌아가기</Button>
      </Link>
    </div>
  );
}

export default NotFound;
