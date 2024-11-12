import { cva } from 'class-variance-authority';
import { useState } from 'react';

import ChevronDownIc from '@/assets/icons/chevron-down.svg?react';
import ChevronUpIc from '@/assets/icons/chevron-up.svg?react';

interface Select {
  options: string[];
  placeholder: string;
}

function Select({ options, placeholder }: Select) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleSelectOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const selectVariants = cva(
    'text-body1 cursor-pointer text-main px-3.5 py-2.5 flex gap-3.5 justify-between items-center rounded-base',
    {
      variants: {
        isOpen: {
          true: 'border border-primary',
          false: 'border border-main',
        },
      },
      defaultVariants: {
        isOpen: true,
      },
    }
  );

  return (
    <div className="min-w-28 max-w-fit">
      <label className={selectVariants({ isOpen: isOpen })} onClick={handleSelectOpen}>
        {selectedOption || placeholder}
        {isOpen ? <ChevronUpIc /> : <ChevronDownIc />}
      </label>
      {isOpen && (
        <ul className="flex flex-col items-center gap-1.5 rounded-base border border-main p-2">
          {options.map((option) => (
            <li
              className="cursor-pointer rounded-base px-6 py-2.5 hover:bg-teritary"
              key={option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
