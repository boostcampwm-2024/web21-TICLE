import TicleCharacterBadge from '@/assets/images/ticle-character-badge.png';
import TicleLogo from '@/assets/ticle.svg?react';

function NotSupportedMobile() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-8 px-2">
      <img src={TicleCharacterBadge} alt="티클 캐릭터" width={150} height={150} />
      <TicleLogo className="fill-primary" width={190} />
      <h1 className="text-center text-2xl font-bold">모바일 환경은 지원하지 않습니다</h1>
      <p className="text-center">데스크톱 브라우저에서 접속해주세요.</p>
    </div>
  );
}

export default NotSupportedMobile;
