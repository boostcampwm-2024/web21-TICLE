import { useState } from 'react';

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

  return (
    <div>
      <label onClick={handleSelectOpen}>{selectedOption || placeholder}</label>
      {isOpen && (
        <ul>
          {options.map((option) => (
            <li key={option} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
