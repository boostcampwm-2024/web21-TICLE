import { cva } from 'class-variance-authority';
import { FunctionComponent, HTMLAttributes, SVGProps, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const BUTTON_TYPE = {
  default: 'default',
  exit: 'exit',
} as const;

const buttonVariants = cva('flex h-10 w-10 items-center justify-center rounded-lg', {
  variants: {
    type: {
      [BUTTON_TYPE.default]: 'bg-primary',
      [BUTTON_TYPE.exit]: 'bg-error',
    },
    active: {
      false: 'bg-darkAlt',
      true: 'bg-primary',
    },
  },
  compoundVariants: [
    {
      type: BUTTON_TYPE.exit,
      active: false,
      class: 'bg-error',
    },
    {
      type: BUTTON_TYPE.exit,
      active: true,
      class: 'bg-error',
    },
  ],
  defaultVariants: {
    type: BUTTON_TYPE.default,
    active: false,
  },
});

interface ToggleButtonProps extends HTMLAttributes<HTMLButtonElement> {
  ActiveIcon: FunctionComponent<SVGProps<SVGSVGElement>>;
  InactiveIcon: FunctionComponent<SVGProps<SVGSVGElement>>;
  defaultActive?: boolean;
  type?: keyof typeof BUTTON_TYPE;
  onToggle: (isActivated: boolean) => void;
}

const ToggleButton = ({
  ActiveIcon,
  InactiveIcon,
  className,
  type = 'default',
  defaultActive = false,
  onToggle,
  ...props
}: ToggleButtonProps) => {
  const [isActivated, setIsActivated] = useState(defaultActive);

  const handleClick = () => {
    setIsActivated((prev) => !prev);
    onToggle(!isActivated);
  };

  return (
    <button
      className={twMerge(buttonVariants({ active: isActivated, type }), className)}
      onClick={handleClick}
      {...props}
    >
      {isActivated ? (
        <ActiveIcon className="fill-white text-white" />
      ) : (
        <InactiveIcon className="fill-white text-white" />
      )}
    </button>
  );
};

export default ToggleButton;
