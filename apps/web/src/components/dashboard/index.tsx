import { Link } from '@tanstack/react-router';

/**@desc router 테스트를 위해 임시 구현한 DashboardTab입니다. */
function DashboardTab() {
  return (
    <nav className="flex gap-2 p-5">
      <Link to="/dashboard/apply" className="[&.active]:font-bold">
        신청한 티클 관리
      </Link>
      <Link to="/dashboard/open" className="[&.active]:font-bold">
        개설한 티클 관리
      </Link>
    </nav>
  );
}

export default DashboardTab;
