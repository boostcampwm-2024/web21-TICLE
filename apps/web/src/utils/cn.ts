import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...classNames: ClassValue[]) => {
  return twMerge(clsx(classNames));
};

export default cn;
