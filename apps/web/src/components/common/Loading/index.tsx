import { cva } from 'class-variance-authority';

const dotVariants = cva('h-4 w-4 rounded-full', {
  variants: {
    variant: {
      white: ['animate-[flashWhite_1.5s_ease-out_infinite_alternate] bg-altWeak'],
      primary: ['animate-[flashPrimary_1.5s_ease-out_infinite_alternate] bg-secondary'],
    },
    position: {
      first: '',
      second: '[animation-delay:0.5s]',
      third: '[animation-delay:1s]',
    },
  },
  defaultVariants: {
    variant: 'white',
  },
});

type LoadingProps = {
  color?: 'white' | 'primary';
};

const Loading = ({ color = 'white' }: LoadingProps) => (
  <div className="flex gap-5">
    <div className={dotVariants({ variant: color, position: 'first' })} />
    <div className={dotVariants({ variant: color, position: 'second' })} />
    <div className={dotVariants({ variant: color, position: 'third' })} />
  </div>
);

export default Loading;
