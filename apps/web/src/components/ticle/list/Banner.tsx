import { Link } from '@tanstack/react-router';

import ChevronRightIc from '@/assets/icons/chevron-right.svg?react';
import BannerIllustration from '@/assets/images/banner-illustration.png';
import TicleCharacter from '@/assets/images/ticle-character.png';
import Button from '@/components/common/Button';

function Banner() {
  return (
    <aside className="gap-18 flex w-full items-center justify-center bg-teritary py-20">
      <img src={BannerIllustration} alt="컴퓨터 활용 일러스트레이션" className="floating w-96" />
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col gap-6">
          <h1 className="text-center text-head1 text-main">
            작은 지식이 모여 큰 성장이 되는 곳, 티클
          </h1>
          <p className="text-center text-body1 text-main">
            당신의 지식이 누군가의 영감이 되는 순간,
            <br />
            실시간으로 이어지는 특별한 성장
          </p>
        </div>
        <Link to="/ticle/open">
          <Button size="lg">
            <span className="mr-1">티클 개설하기</span>
            <ChevronRightIc width={9} height={16} />
          </Button>
        </Link>
      </div>
      <div className="flex w-96 justify-center">
        <img src={TicleCharacter} alt="티클이 캐릭터" className="floating w-56" />
      </div>
    </aside>
  );
}

export default Banner;
