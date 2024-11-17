import { clsx, ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'label1',
            'head1',
            'head2',
            'head3',
            'title1',
            'title2',
            'body1',
            'body2',
            'body3',
            'body4',
          ],
        },
      ],
    },
  },
});

const cn = (...classNames: ClassValue[]) => {
  return customTwMerge(clsx(classNames));
};

export default cn;
