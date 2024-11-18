import { action } from '@storybook/addon-actions';

import TextInput, { SIZE_VARIANTS } from '@/components/common/TextInput';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TextInput> = {
  title: 'common/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'full'],
      description: '입력창의 크기를 지정합니다.',
      table: {
        type: { summary: 'sm | md | full' },
      },
    },
    type: {
      control: 'inline-radio',
      options: ['text', 'email', 'password', 'number'],
      description: '입력창의 타입을 지정합니다.',
      table: {
        type: { summary: 'text | email | password | number' },
      },
    },
    label: {
      control: 'text',
      description: '입력창의 레이블입니다.',
    },
    description: {
      control: 'text',
      description: '입력창에 대한 설명문구입니다.',
    },
    placeholder: {
      control: 'text',
      description: '입력창의 placeholder 텍스트입니다.',
    },
    required: {
      control: 'boolean',
      description: '필수 입력 여부를 지정합니다.',
    },
    maxLength: {
      control: 'number',
      description: '입력 가능한 최대 글자 수를 지정합니다.',
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지를 표시합니다.',
    },
    defaultValue: {
      control: 'text',
      description: '입력창의 초기값을 지정합니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
<h3>Usage</h3>

\`\`\`jsx
import TextInput from '@/components/common/TextInput';

// Basic usage
<TextInput
  label="Label"
  size="md"
  placeholder="내용을 입력해주세요."
/>

// With description and required
<TextInput
  label="Label"
  description="Description text"
  required
  size="md"
  placeholder="내용을 입력해주세요."
/>

// With maxLength
<TextInput
  label="Label"
  maxLength={50}
  size="md"
  placeholder="내용을 입력해주세요."
/>

// With error
<TextInput
  label="Label"
  errorMessage="Error message"
  size="md"
  placeholder="내용을 입력해주세요."
/>

// Different types
<TextInput type="email" />
<TextInput type="password" />
<TextInput type="number" />
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

interface TextInputProps {
  size?: keyof typeof SIZE_VARIANTS;
  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  errorMessage?: string;
  defaultValue?: string | number | readonly string[];
}

const TextInputComponent = ({
  size = 'md',
  type = 'text',
  label = 'Label',
  description,
  placeholder = '내용을 입력해주세요.',
  required,
  maxLength,
  errorMessage,
  defaultValue,
}: TextInputProps) => {
  return (
    <TextInput
      size={size}
      type={type}
      label={label}
      description={description}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      errorMessage={errorMessage}
      defaultValue={defaultValue}
      onChange={(e) => action('onChange')(e.target.value)}
    />
  );
};

export const Default: Story = {
  args: {
    size: 'md',
    type: 'text',
    label: 'Label',
    placeholder: '내용을 입력해주세요.',
  },
  render: (args) => <TextInputComponent {...args} />,
};

export const WithDescription: Story = {
  args: {
    size: 'md',
    label: 'Label',
    description: 'Description text',
    placeholder: '내용을 입력해주세요.',
    required: true,
  },
  parameters: {
    controls: {
      include: ['size', 'label', 'description', 'required'],
    },
  },
  render: (args) => <TextInputComponent {...args} />,
};

export const WithCounter: Story = {
  args: {
    size: 'md',
    label: 'Label',
    maxLength: 50,
    placeholder: '내용을 입력해주세요.',
  },
  parameters: {
    controls: {
      include: ['size', 'maxLength'],
    },
  },
  render: (args) => <TextInputComponent {...args} />,
};

export const WithError: Story = {
  args: {
    size: 'md',
    label: 'Label',
    errorMessage: 'Error message',
    placeholder: '내용을 입력해주세요.',
  },
  parameters: {
    controls: {
      include: ['size', 'errorMessage'],
    },
  },
  render: (args) => <TextInputComponent {...args} />,
};

export const WithDefaultValue: Story = {
  args: {
    size: 'md',
    label: 'Label',
    defaultValue: '기본값',
    placeholder: '내용을 입력해주세요.',
  },
  parameters: {
    controls: {
      include: ['size', 'defaultValue'],
    },
  },
  render: (args) => <TextInputComponent {...args} />,
};

export const Types: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const types = ['text', 'email', 'password', 'number'] as const;
    return (
      <div className="flex flex-col gap-4">
        {types.map((type) => (
          <TextInputComponent
            key={type}
            type={type}
            label={`${type} type`}
            placeholder={`Enter ${type}...`}
          />
        ))}
      </div>
    );
  },
};

export const Size: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const sizes = ['sm', 'md', 'full'] as const;
    return (
      <div className="flex flex-col gap-4">
        {sizes.map((size) => (
          <TextInputComponent
            key={size}
            size={size}
            label={`${size} size`}
            placeholder={`${size} size input`}
          />
        ))}
      </div>
    );
  },
};
