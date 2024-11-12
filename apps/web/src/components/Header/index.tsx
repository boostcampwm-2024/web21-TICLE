import { Link } from '@tanstack/react-router';

import TicleLogo from '@/assets/ticle.svg?react';
import Button from '@/components/common/Button';

const NAV_STYLE = 'hover:text-hover text-title1 text-alt transition [&.active]:text-primary';

function Header() {
  return (
    <header className="flex items-center justify-between border border-main bg-white px-[50px] py-4">
      <nav className="flex items-center justify-center gap-x-9">
        <Link to="/">
          <TicleLogo className="h-6 fill-primary text-primary" />
        </Link>
        {/* TODO: 주소 연결 */}
        <Link to="/ticle/open" className={NAV_STYLE}>
          티클
        </Link>
        <Link to="/dashboard" className={NAV_STYLE}>
          대시보드
        </Link>
      </nav>
      {/* TODO: User 로그인시 핸들링 */}
      <section className="flex items-center justify-center">
        <Button size="sm">
          <Link to="/auth/oauth">로그인</Link>
        </Button>
      </section>
    </header>
  );
}

export default Header;
