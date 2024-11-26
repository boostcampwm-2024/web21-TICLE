import Loading from '@/components/common/Loading';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Loading> = {
  title: 'common/Loading',
  component: Loading,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['white', 'primary'],
      description: '로딩 애니메이션의 색상을 설정합니다.',
      table: {
        type: { summary: "'white' | 'primary'" },
        defaultValue: { summary: 'white' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
<h3>Usage</h3>

\`\`\`jsx
import Loading from '@/components/common/Loading';

// Basic usage
<Loading />

// With primary color
<Loading color="primary" />
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  args: {
    color: 'white',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
  },
  parameters: {
    backgrounds: {
      default: 'white',
    },
  },
};
