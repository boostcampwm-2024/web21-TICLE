import { action } from '@storybook/addon-actions';

import Select, { Option } from '@/components/common/Select';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Select> = {
  title: 'common/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: '선택 가능한 옵션들의 배열입니다.',
    },
    placeholder: {
      control: 'text',
      description: '아무것도 선택되지 않았을 때 표시될 텍스트입니다.',
    },
    selectedOption: {
      control: 'text',
      description: '현재 선택된 옵션입니다.',
    },
    onChange: {
      description: '옵션 선택 시 호출되는 함수입니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
<h3>Usage</h3>

\`\`\`jsx
import Select from '@/components/common/Select';

// Basic usage
const options = ['Option 1', 'Option 2', 'Option 3'];

<Select
  options={options}
  placeholder="선택해주세요"
  selectedOption="Option 1"
  onChange={(value) => console.log('Selected:', value)}
/>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const SAMPLE_OPTIONS: Option[] = [
  {
    label: 'React',
    value: '0',
  },
  {
    label: 'Svlete',
    value: '1',
  },
  {
    label: 'Vue',
    value: '2',
  },
];

export const Default: Story = {
  args: {
    options: SAMPLE_OPTIONS,
    placeholder: '기술 스택',
    onChange: action('onChange'),
  },
};

export const WithSelectedOption: Story = {
  args: {
    options: SAMPLE_OPTIONS,
    placeholder: '기술 스택',
    selectedOption: SAMPLE_OPTIONS[0],
    onChange: action('onChange'),
  },
};
