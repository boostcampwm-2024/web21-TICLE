import { cva } from 'class-variance-authority';
import { ButtonHTMLAttributes } from 'react';

import cn from '@/utils/cn';

const BUTTON_SIZE = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  full: 'full',
} as const;

const BUTTON_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
} as const;

const buttonVariants = cva('flex h-fit w-fit items-center justify-center rounded-lg py-2', {
  variants: {
    variant: {
      [BUTTON_VARIANTS.primary]: 'bg-primary',
      [BUTTON_VARIANTS.secondary]: 'bg-secondary',
    },
    size: {
      [BUTTON_SIZE.sm]: 'px-3',
      [BUTTON_SIZE.md]: 'px-4',
      [BUTTON_SIZE.lg]: 'px-4',
      [BUTTON_SIZE.full]: 'w-full px-4',
    },
    disabled: {
      true: 'bg-alt',
      false: '',
    },
  },
  defaultVariants: {
    variant: BUTTON_VARIANTS.primary,
    size: BUTTON_SIZE.lg,
    disabled: false,
  },
});

const buttonTextVariants = cva('flex w-full items-center justify-center', {
  variants: {
    variant: {
      [BUTTON_VARIANTS.primary]: 'text-white',
      [BUTTON_VARIANTS.secondary]: 'text-primary',
    },
    size: {
      [BUTTON_SIZE.sm]: 'text-title2',
      [BUTTON_SIZE.md]: 'text-title1',
      [BUTTON_SIZE.lg]: 'text-head3',
      [BUTTON_SIZE.full]: 'text-head3',
    },
    disabled: {
      true: 'text-weak',
      false: '',
    },
  },
  defaultVariants: {
    variant: BUTTON_VARIANTS.primary,
    size: BUTTON_SIZE.lg,
    disabled: false,
  },
});

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];
  variant?: (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];
}

function Button({
  size = BUTTON_SIZE.lg,
  variant = BUTTON_VARIANTS.primary,
  disabled = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ size, variant, disabled }), className)}
      disabled={disabled}
      {...rest}
    >
      <span className={buttonTextVariants({ size, variant, disabled })}>{children}</span>
    </button>
  );
}

export default Button;
