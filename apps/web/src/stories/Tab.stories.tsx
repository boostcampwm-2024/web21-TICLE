/* eslint-disable no-console */
import { action } from '@storybook/addon-actions';
import { useState } from 'react';

import Tab from '@/components/common/Tab';

import type { TabData } from '@/components/common/Tab';
import type { Meta, StoryObj } from '@storybook/react';

type TabValues = '전체' | '진행중' | '종료';

const meta: Meta<typeof Tab> = {
  title: 'common/Tab',
  component: Tab,
  tags: ['autodocs'],
  argTypes: {
    tabItems: {
      description: '탭 아이템들의 배열입니다.',
      table: {
        type: { summary: 'TabData<T>[]' },
      },
    },
    selectedTab: {
      description: '현재 선택된 탭의 value입니다.',
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
const [selectedTab, setSelectedTab] = useState<'tab1' | 'tab2'>('tab1');
const tabItems = [
  {
    value: 'tab1',
    label: 'Tab 1',
    onClick: () => setSelectedTab('tab1'),
  },
  {
    value: 'tab2',
    label: 'Tab 2',
    onClick: () => setSelectedTab('tab2'),
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
  initialSelectedTab?: TabValues;
  items?: TabData<TabValues>[];
}

const defaultTabItems: TabData<TabValues>[] = [
  {
    value: '전체',
    label: '전체',
    onClick: () => action('onClick')('전체'),
  },
  {
    value: '진행중',
    label: '진행중',
    onClick: () => action('onClick')('진행중'),
  },
  {
    value: '종료',
    label: '종료',
    onClick: () => action('onClick')('종료'),
  },
];

const TabWithHooks = ({
  initialSelectedTab = '전체',
  items = defaultTabItems,
}: TabWithHooksProps) => {
  const [selectedTab, setSelectedTab] = useState<TabValues>(initialSelectedTab);

  const tabItems = items.map((item) => ({
    ...item,
    onClick: () => {
      setSelectedTab(item.value);
      action('onClick')(item.value);
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
