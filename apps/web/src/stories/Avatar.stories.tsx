import Avatar from '@/components/common/Avatar';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Avatar> = {
  title: 'common/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
      description: '아바타의 크기를 지정합니다.',
      table: {
        type: { summary: 'xs | sm | md | lg' },
      },
    },
    src: {
      control: 'text',
      description: '이미지의 URL입니다. 값이 없으면 기본 아이콘이 표시됩니다.',
    },
    alt: {
      control: 'text',
      description: '이미지의 대체 텍스트입니다.',
      defaultValue: 'avatar',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
<h3>Usage</h3>

\`\`\`jsx
import Avatar from '@/components/common/Avatar';

// Basic usage with default icon
<Avatar size="md" />

// With image
<Avatar
  size="md"
  src="https://example.com/avatar.jpg"
  alt="User avatar"
/>

// Different sizes
<Avatar size="xs" />
<Avatar size="sm" />
<Avatar size="md" />
<Avatar size="lg" />
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const WithImage: Story = {
  args: {
    size: 'md',
    src: 'https://i.pinimg.com/736x/b3/1d/a4/b31da43778a488de959eef0695f9e161.jpg',
    alt: 'Sample avatar',
  },
};

export const Size: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg'] as const;
    return (
      <div className="flex items-center gap-4">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar size={size} />
            <span className="text-sm">{size} size</span>
          </div>
        ))}
      </div>
    );
  },
};

export const WithAndWithoutImage: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg'] as const;
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Avatar size={size} />
              <span className="text-sm">No image ({size})</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Avatar
                size={size}
                src="https://i.pinimg.com/736x/b3/1d/a4/b31da43778a488de959eef0695f9e161.jpg"
                alt="Sample avatar"
              />
              <span className="text-sm">With image ({size})</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
