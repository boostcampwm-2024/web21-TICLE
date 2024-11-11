import { useState } from 'react';

const useModal = (defaultOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return { isOpen, onOpen, onClose };
};

export default useModal;
