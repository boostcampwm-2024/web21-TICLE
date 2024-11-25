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
  const [selectedTab, setSelectedTab] = useState<keyof typeof DASHBOARD_TAB>('APPLIED');

  const DASHBOARD_TAB_DATA: TabData<keyof typeof DASHBOARD_TAB>[] = [
    {
      value: 'APPLIED',
      label: DASHBOARD_TAB.APPLIED,
      onClick: () => {
        navigate({ to: DASHBOARD_ROUTES.APPLIED });
        setSelectedTab('APPLIED');
      },
    },
    {
      value: 'OPENED',
      label: DASHBOARD_TAB.OPENED,
      onClick: () => {
        navigate({ to: DASHBOARD_ROUTES.OPENED });
        setSelectedTab('OPENED');
      },
    },
  ];

  return <Tab tabItems={DASHBOARD_TAB_DATA} selectedTab={selectedTab} />;
}

export default DashboardTab;
