import { action } from '@storybook/addon-actions';
import { useState } from 'react';

import TextArea from '@/components/common/TextArea';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TextArea> = {
  title: 'common/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'TextArea의 크기를 지정합니다.',
      table: {
        type: { summary: 'sm | md | lg' },
      },
    },
    label: {
      control: 'text',
      description: 'TextArea의 레이블입니다.',
    },
    description: {
      control: 'text',
      description: 'TextArea에 대한 설명문구입니다.',
    },
    placeholder: {
      control: 'text',
      description: 'TextArea의 placeholder 텍스트입니다.',
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
  },
  parameters: {
    docs: {
      description: {
        component: `
<h3>Usage</h3>

\`\`\`jsx
import TextArea from '@/components/common/TextArea';

// Basic usage
<TextArea
  label="Label"
  size="md"
  placeholder="내용을 입력해주세요."
/>

// With description and required
<TextArea
  label="Label"
  description="Description text"
  required
  size="md"
  placeholder="내용을 입력해주세요."
/>

// With maxLength
<TextArea
  label="Label"
  maxLength={200}
  size="md"
  placeholder="내용을 입력해주세요."
/>

// With error
<TextArea
  label="Label"
  errorMessage="Error message"
  size="md"
  placeholder="내용을 입력해주세요."
/>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

interface TextAreaWithHooksProps {
  size: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  errorMessage?: string;
  defaultValue?: string;
}

const TextAreaWithHooks = ({
  size,
  label = 'Label',
  description,
  placeholder = '내용을 입력해주세요.',
  required,
  maxLength,
  errorMessage,
  defaultValue,
}: TextAreaWithHooksProps) => {
  const [value, setValue] = useState(defaultValue ?? '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    action('onChange')(e.target.value);
  };

  return (
    <TextArea
      size={size}
      label={label}
      description={description}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      errorMessage={errorMessage}
      value={value}
      onChange={handleChange}
    />
  );
};

export const Default: Story = {
  args: {
    size: 'md',
    label: 'Label',
    placeholder: '내용을 입력해주세요.',
  },
  parameters: {
    controls: {
      include: ['size', 'label', 'placeholder'],
    },
  },
  render: (args) => <TextAreaWithHooks {...args} />,
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
  render: (args) => <TextAreaWithHooks {...args} />,
};

export const WithCounter: Story = {
  args: {
    size: 'md',
    label: 'Label',
    maxLength: 200,
    placeholder: '내용을 입력해주세요.',
  },
  parameters: {
    controls: {
      include: ['size', 'maxLength'],
    },
  },
  render: (args) => <TextAreaWithHooks {...args} />,
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
  render: (args) => <TextAreaWithHooks {...args} />,
};

export const Size: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    return (
      <div className="flex flex-col gap-4">
        {sizes.map((size) => (
          <TextAreaWithHooks
            key={size}
            size={size}
            label={`${size} size`}
            placeholder={`${size} size textarea`}
          />
        ))}
      </div>
    );
  },
};
