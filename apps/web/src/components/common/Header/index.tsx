import { Link } from '@tanstack/react-router';

import TicleLogo from '@/assets/ticle.svg?react';

import User from './User';

const NAV_STYLE = 'hover:text-hover text-title1 text-alt transition [&.active]:text-primary';

function Header() {
  return (
    <header className="flex h-[70px] items-center justify-between border border-main bg-white px-[50px] py-4">
      <nav className="flex items-center justify-center gap-x-9">
        <Link to="/">
          <TicleLogo className="h-6 fill-primary text-primary" />
        </Link>
        <Link to="/" className={NAV_STYLE}>
          티클
        </Link>
        <Link to="/dashboard" className={NAV_STYLE}>
          대시보드
        </Link>
      </nav>
      <User />
    </header>
  );
}

export default Header;
