import TicleCharacterBadge from '@/assets/images/ticle-character-badge.png';
import TicleLogo from '@/assets/ticle.svg?react';

import OAuthLogin from './OAuthLogin';

function Auth() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-16">
      <div className="flex flex-col items-center gap-6">
        <img src={TicleCharacterBadge} alt="티클 캐릭터" width={150} height={150} />
        <TicleLogo className="fill-primary" width={190} />
        <span className="text-head3 text-alt">작은 지식이 모여 큰 성장이 되는 곳</span>
      </div>
      <main className="flex flex-col gap-4">
        <OAuthLogin type="github" />
        <OAuthLogin type="google" />
      </main>
    </div>
  );
}

export default Auth;
