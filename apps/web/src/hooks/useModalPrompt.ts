import useModal from './useModal';

const useModalPrompt = <T = void>() => {
  const { isOpen, onOpen, onClose } = useModal();

  const prompt = () =>
    new Promise<T>((resolve, reject) => {
      const handleConfirm = (value: T) => {
        onClose();
        resolve(value);
      };

      const handleCancel = () => {
        onClose();
        reject();
      };

      onOpen();

      return {
        isOpen,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
      };
    });

  return {
    isOpen,
    prompt,
  };
};

export default useModalPrompt;
