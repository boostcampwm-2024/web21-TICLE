import { ReactNode } from 'react';

export type ToastContent = ReactNode;

export type ToastId = number | string;

export interface ToastCommonOptions {
  limit?: number;
  autoClose?: number;
  closeOnClick?: boolean;
}

export interface ToastOptions extends ToastCommonOptions {
  toastId?: ToastId;
}

export interface ToastProps extends ToastOptions {
  isIn: boolean;
  toastId: ToastId;
  key: ToastId;
  closeToast: () => void;
  deleteToast: () => void;
  children?: ToastContent;
}

export interface NotValidatedToastProps extends Partial<ToastProps> {
  toastId: ToastId;
}

export interface Toast {
  content: ToastContent;
  props: ToastProps;
}
export type ToastEvent = 'show' | 'willUnmount';

export type OnShowCallback = (content: ToastContent, options: NotValidatedToastProps) => void;
export type OnWillUnmountCallback = () => void;

export type ToastCallback = OnShowCallback | OnWillUnmountCallback;
