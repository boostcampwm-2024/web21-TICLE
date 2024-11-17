import ChevronDownIc from '@/assets/icons/chevron-down.svg?react';
import Button from '@/components/common/Button';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'common/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'full'],
      description: '버튼의 크기를 지정합니다.',
      table: {
        type: { summary: `'sm' | 'md' | 'lg' | 'full'` },
      },
    },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      description: '버튼의 스타일을 지정합니다.',
      table: {
        type: { summary: `'primary' | 'secondary'` },
      },
    },
    disabled: {
      control: 'boolean',
      description: '버튼의 비활성화 상태를 지정합니다.',
      table: {
        type: { summary: 'boolean' },
      },
    },
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
import Button from '@/components/common/Button';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>

// With sizes
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button>
<Button size="lg">Large Button</Button>
<Button size="full">Full Width Button</Button>

// Disabled state
<Button disabled>Disabled Button</Button>
\`\`\`

        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Variant: Story = {
  args: {
    size: 'md',
  },
  parameters: {
    controls: {
      include: ['size'],
    },
  },
  render: (args) => {
    const variants = ['primary', 'secondary'] as const;
    return (
      <div className="flex gap-2">
        {variants.map((variant) => (
          <Button variant={variant} size={args.size} key={variant}>
            {variant}
          </Button>
        ))}
      </div>
    );
  },
};

export const Size: Story = {
  args: {
    variant: 'primary',
    disabled: false,
  },
  parameters: {
    controls: {
      include: ['variant', 'disabled'],
    },
  },
  render: (args) => {
    const sizes = ['sm', 'md', 'lg', 'full'] as const;
    return (
      <div className="flex gap-2">
        {sizes.map((size) => (
          <Button variant={args.variant} size={size} key={size} disabled={args.disabled}>
            {size}
          </Button>
        ))}
      </div>
    );
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
  parameters: {
    controls: {
      include: ['variant', 'size', 'disabled'],
    },
  },
  render: (args) => (
    <Button variant={args.variant} size={args.size} disabled={args.disabled}>
      <div className="flex items-center gap-1">
        Button
        <ChevronDownIc />
      </div>
    </Button>
  ),
};
