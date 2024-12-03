import Alert from '@/components/common/Alert';

export const renderError = (message: string) => {
  return <Alert type="error">{message}</Alert>;
};

export const renderSuccess = (message: string) => {
  return <Alert>{message}</Alert>;
};
