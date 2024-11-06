import { Link } from '@tanstack/react-router';

/**@desc router 테스트를 위해 임시 구현한 Header입니다. */
function Header() {
  return (
    <div className="p-5 flex gap-2 border border-main">
      <Link to="/" className="[&.active]:font-bold">
        티클
      </Link>
    </div>
  );
}

export default Header;
