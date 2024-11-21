import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

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
  const [selectedTab, setSelectedTab] = useState<string>(DASHBOARD_TAB.APPLIED);

  const DASHBOARD_TAB_DATA: TabData[] = [
    {
      name: DASHBOARD_TAB.APPLIED,
      onClick: () => {
        navigate({ to: DASHBOARD_ROUTES.APPLIED });
        setSelectedTab(DASHBOARD_TAB.APPLIED);
      },
    },
    {
      name: DASHBOARD_TAB.OPENED,
      onClick: () => {
        navigate({ to: DASHBOARD_ROUTES.OPENED });
        setSelectedTab(DASHBOARD_TAB.OPENED);
      },
    },
  ];

  return <Tab tabItems={DASHBOARD_TAB_DATA} selectedTab={selectedTab} />;
}

export default DashboardTab;
