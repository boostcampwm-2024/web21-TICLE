import { isValidElement } from 'react';

import { ToastContent } from '@/core/toast/type';

export const isNum = (v: unknown): v is number => typeof v === 'number' && !isNaN(v);

export const isStr = (v: unknown): v is string => typeof v === 'string';

export const isFn = (v: unknown): v is (...args: any) => void => typeof v === 'function';

export const canBeRendered = (content: ToastContent) => {
  return isValidElement(content) || isStr(content) || isFn(content) || isNum(content);
};
