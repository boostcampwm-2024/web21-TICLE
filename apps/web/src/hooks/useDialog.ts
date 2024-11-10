import { useState } from 'react';

const useDialog = (defaultOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return { isOpen, onOpen, onClose };
};

export default useDialog;
