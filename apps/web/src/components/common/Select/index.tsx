import { cva } from 'class-variance-authority';
import { useRef, useState, KeyboardEvent } from 'react';

import ChevronDownIc from '@/assets/icons/chevron-down.svg?react';
import ChevronUpIc from '@/assets/icons/chevron-up.svg?react';
import useOutsideClick from '@/hooks/useOutsideClick';

const selectVariants = cva(
  'flex w-full cursor-pointer items-center justify-between gap-3.5 rounded-base px-3.5 py-2.5 text-body1 text-main',
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

  const handleOptionKeyDown = (e: KeyboardEvent, option: string) => {
    if (e.key !== 'Enter') {
      return;
    }
    e.preventDefault();
    handleOptionChange(option);
  };

  const selectRef = useRef<HTMLDivElement>(null);
  useOutsideClick(selectRef, handleSelectClose);

  return (
    <div ref={selectRef} className="relative w-32">
      <button
        className={selectVariants({ isOpen: isOpen })}
        onClick={handleSelectToggle}
        aria-expanded={isOpen}
      >
        <span>{selectedOption || placeholder}</span>
        {isOpen ? <ChevronUpIc aria-hidden="true" /> : <ChevronDownIc aria-hidden="true" />}
      </button>
      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 flex w-full flex-col items-center gap-1.5 rounded-base border border-main bg-white p-2"
        >
          {options.map((option) => (
            <li
              className="w-full cursor-pointer rounded-base px-6 py-2.5 text-center hover:bg-teritary"
              key={option}
              role="option"
              aria-selected={option === selectedOption}
              tabIndex={0}
              onClick={() => handleOptionChange(option)}
              onKeyDown={(e) => handleOptionKeyDown(e, option)}
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
