import { cva } from 'class-variance-authority';
import { useRef, useState } from 'react';

import ChevronDownIc from '@/assets/icons/chevron-down.svg?react';
import ChevronUpIc from '@/assets/icons/chevron-up.svg?react';
import useOutsideClick from '@/hooks/useOutsideClick';

interface Select {
  options: string[];
  placeholder: string;
  selectedOption?: string;
  onChange?: (value: string) => void;
}

function Select({ options, placeholder, selectedOption, onChange }: Select) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOptionChange = (option: string) => {
    onChange?.(option);
    setIsOpen(false);
  };

  const handleSelectClose = () => {
    setIsOpen(false);
  };

  const handleSelectToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const selectRef = useRef<HTMLDivElement>(null);
  useOutsideClick(selectRef, handleSelectClose);

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
    <div ref={selectRef} className="relative max-w-32">
      <label className={selectVariants({ isOpen: isOpen })} onClick={handleSelectToggle}>
        {selectedOption || placeholder}
        {isOpen ? <ChevronUpIc /> : <ChevronDownIc />}
      </label>
      {isOpen && (
        <ul className="absolute right-0 mt-2 flex w-full flex-col items-center gap-1.5 rounded-base border border-main bg-white p-2">
          {options.map((option) => (
            <li
              className="cursor-pointer rounded-base px-6 py-2.5 hover:bg-teritary"
              key={option}
              onClick={() => handleOptionChange(option)}
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
