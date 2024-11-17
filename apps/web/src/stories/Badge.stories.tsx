import Badge from '@/components/common/Badge';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Badge> = {
  title: 'common/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '뱃지 내부에 들어갈 컨텐츠입니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
<h3>Usage</h3>

\`\`\`jsx
import Badge from '@/components/common/Badge';

// Basic usage
<Badge>New</Badge>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};
