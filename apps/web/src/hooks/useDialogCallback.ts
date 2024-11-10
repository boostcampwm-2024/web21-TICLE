import useDialog from './useDialog';

const useDialogPrompt = <T = void>() => {
  const { isOpen, onOpen, onClose } = useDialog();

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

export default useDialogPrompt;
