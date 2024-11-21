import { clsx, ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../tailwind.config';

const fontSizeKeys = Object.keys(resolveConfig(tailwindConfig).theme.fontSize);

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: fontSizeKeys }],
    },
  },
});

const cn = (...classNames: ClassValue[]) => {
  return customTwMerge(clsx(classNames));
};

export default cn;
