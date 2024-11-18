/* eslint-disable no-console */
import { action } from '@storybook/addon-actions';
import { useState } from 'react';

import SearchInput from '@/components/common/SearchInput';
import { SIZE_VARIANTS } from '@/components/common/TextInput';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchInput> = {
  title: 'common/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'full'],
      description: '검색 입력창의 크기를 지정합니다.',
      table: {
        type: { summary: 'sm | md | full' },
      },
    },
    value: {
      control: 'text',
      description: '검색 입력창의 현재 값입니다.',
    },
    placeholder: {
      control: 'text',
      description: '검색 입력창의 placeholder 텍스트입니다.',
    },
    onChange: {
      description: '입력값이 변경될 때 호출되는 함수입니다.',
    },
    onClear: {
      description: '검색어 삭제 버튼을 클릭할 때 호출되는 함수입니다.',
    },
    onSearch: {
      description: 'Enter 키를 눌렀을 때 호출되는 함수입니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
<h3>Usage</h3>

\`\`\`jsx
import SearchInput from '@/components/common/SearchInput';

// Basic usage
const [value, setValue] = useState('');

<SearchInput
  value={value}
  onChange={setValue}
  onClear={() => setValue('')}
  onSearch={(value) => console.log('Search:', value)}
  placeholder="검색어를 입력하세요"
/>

// With different sizes
<SearchInput
  size="sm"
  value={value}
  onChange={setValue}
  onClear={() => setValue('')}
  onSearch={(value) => console.log('Search:', value)}
/>

<SearchInput
  size="md"
  value={value}
  onChange={setValue}
  onClear={() => setValue('')}
  onSearch={(value) => console.log('Search:', value)}
/>

<SearchInput
  size="sm"
  value={value}
  onChange={setValue}
  onClear={() => setValue('')}
  onSearch={(value) => console.log('Search:', value)}
/>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

interface SearchInputWithHooksProps {
  size?: keyof typeof SIZE_VARIANTS;
  initialValue?: string;
  placeholder?: string;
}

const SearchInputWithHooks = ({
  size = 'md',
  initialValue = '',
  placeholder = '검색어를 입력하세요',
}: SearchInputWithHooksProps) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    action('onChange')(newValue);
  };

  const handleClear = () => {
    setValue('');
    action('onClear')();
  };

  const handleSearch = (searchValue: string) => {
    action('onSearch')(searchValue);
  };

  return (
    <SearchInput
      value={value}
      onChange={handleChange}
      onClear={handleClear}
      onSearch={handleSearch}
      size={size}
      placeholder={placeholder}
    />
  );
};

export const Default: Story = {
  args: {
    size: 'md',
  },
  parameters: {
    controls: {
      include: ['size'],
    },
  },
  render: (args) => <SearchInputWithHooks size={args.size} />,
};

export const WithValue: Story = {
  args: {
    size: 'md',
  },
  parameters: {
    controls: {
      include: ['size'],
    },
  },
  render: (args) => <SearchInputWithHooks initialValue="검색어" size={args.size} />,
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
          <SearchInputWithHooks key={size} size={size} placeholder={`${size} size`} />
        ))}
      </div>
    );
  },
};
