import { cva } from 'class-variance-authority';
import { useRef, useState, KeyboardEvent, useLayoutEffect } from 'react';

import ChevronDownIc from '@/assets/icons/chevron-down.svg?react';
import ChevronUpIc from '@/assets/icons/chevron-up.svg?react';
import useOutsideClick from '@/hooks/useOutsideClick';

import Portal from '../Portal';

const selectVariants = cva(
  'flex w-full cursor-pointer items-center justify-between gap-3.5 rounded-base bg-white px-3.5 py-2.5 text-body1 text-main',
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

export interface Option {
  label: string;
  value: string;
}

interface Position {
  top: number;
  left: number;
  width: number;
}
interface Select {
  options: Option[];
  placeholder?: string;
  selectedOption?: Option;
  onChange?: (value: Option) => void;
}

function Select({ options, placeholder, selectedOption, onChange }: Select) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    width: 0,
  });

  const selectRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!selectRef.current) return;

    const selectRect = selectRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    setPosition({
      top: selectRect.bottom + scrollTop,
      left: selectRect.left + scrollLeft,
      width: selectRect.width,
    });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const handleOptionChange = (option: Option) => {
    onChange?.(option);
    setIsOpen(false);
  };

  const handleSelectClose = () => {
    setIsOpen(false);
  };

  const handleSelectToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionKeyDown = (e: KeyboardEvent, option: Option) => {
    if (e.key !== 'Enter') {
      return;
    }
    e.preventDefault();
    handleOptionChange(option);
  };

  useOutsideClick(selectRef, handleSelectClose);

  return (
    <div ref={selectRef} className="relative w-32">
      <button
        className={selectVariants({ isOpen: isOpen })}
        onClick={handleSelectToggle}
        aria-expanded={isOpen}
      >
        <span>{selectedOption?.label || placeholder}</span>
        {isOpen ? <ChevronUpIc aria-hidden="true" /> : <ChevronDownIc aria-hidden="true" />}
      </button>
      {isOpen && (
        <Portal portalId="select">
          <ul
            role="listbox"
            className="absolute right-0 mt-2 flex w-full flex-col items-center gap-1.5 rounded-base border border-main bg-white p-2 shadow-normal"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
            }}
          >
            {options.map((option) => (
              <li
                className="w-full cursor-pointer rounded-base px-6 py-2.5 text-center hover:bg-teritary"
                key={option.value}
                role="option"
                aria-selected={option === selectedOption}
                tabIndex={0}
                onClick={() => handleOptionChange(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </Portal>
      )}
    </div>
  );
}

export default Select;
