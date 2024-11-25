import { useMatch, useNavigate } from '@tanstack/react-router';

import Tab, { TabData } from '../common/Tab';

const DASHBOARD_TAB = {
  APPLIED: '신청한 티클 관리',
  OPENED: '개설한 티클 관리',
} as const;

const DASHBOARD_ROUTES = {
  APPLIED: '/dashboard/apply',
  OPENED: '/dashboard/open',
} as const;

function DashboardTab() {
  const navigate = useNavigate();
  const isOpenedMatch = useMatch({ from: '/dashboard/open', shouldThrow: false });
  const selectedTab = isOpenedMatch ? 'OPENED' : 'APPLIED';

  const DASHBOARD_TAB_DATA: TabData<keyof typeof DASHBOARD_TAB>[] = [
    {
      value: 'APPLIED',
      label: DASHBOARD_TAB.APPLIED,
      onClick: () => {
        navigate({ to: DASHBOARD_ROUTES.APPLIED });
      },
    },
    {
      value: 'OPENED',
      label: DASHBOARD_TAB.OPENED,
      onClick: () => {
        navigate({ to: DASHBOARD_ROUTES.OPENED });
      },
    },
  ];

  return <Tab tabItems={DASHBOARD_TAB_DATA} selectedTab={selectedTab} />;
}

export default DashboardTab;
