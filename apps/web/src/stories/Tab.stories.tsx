/* eslint-disable no-console */
import { action } from '@storybook/addon-actions';
import { useState } from 'react';

import Tab from '@/components/common/Tab';

import type { TabData } from '@/components/common/Tab';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tab> = {
  title: 'common/Tab',
  component: Tab,
  tags: ['autodocs'],
  argTypes: {
    tabItems: {
      description: '탭 아이템들의 배열입니다.',
      table: {
        type: { summary: 'TabData[]' },
      },
    },
    selectedTab: {
      description: '현재 선택된 탭의 이름입니다.',
      control: 'text',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
<h3>Usage</h3>

\`\`\`jsx
import Tab from '@/components/common/Tab';

// Basic usage
const [selectedTab, setSelectedTab] = useState('Tab 1');
const tabItems = [
  {
    name: 'Tab 1',
    onClick: () => setSelectedTab('Tab 1'),
  },
  {
    name: 'Tab 2',
    onClick: () => setSelectedTab('Tab 2'),
  },
];

<Tab
  tabItems={tabItems}
  selectedTab={selectedTab}
/>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tab>;

interface TabWithHooksProps {
  initialSelectedTab?: string;
  items?: TabData[];
}

const defaultTabItems: TabData[] = [
  {
    name: '전체',
    onClick: () => action('onClick')('전체'),
  },
  {
    name: '진행중',
    onClick: () => action('onClick')('진행중'),
  },
  {
    name: '종료',
    onClick: () => action('onClick')('종료'),
  },
];

const TabWithHooks = ({
  initialSelectedTab = '전체',
  items = defaultTabItems,
}: TabWithHooksProps) => {
  const [selectedTab, setSelectedTab] = useState(initialSelectedTab);

  const tabItems = items.map((item) => ({
    ...item,
    onClick: () => {
      setSelectedTab(item.name);
      action('onClick')(item.name);
    },
  }));

  return <Tab tabItems={tabItems} selectedTab={selectedTab} />;
};

export const Default: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => <TabWithHooks />,
};
