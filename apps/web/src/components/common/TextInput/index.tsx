import { cva } from 'class-variance-authority';
import { forwardRef, InputHTMLAttributes, Ref } from 'react';

import cn from '@/utils/cn';

const inputVariants = cva(
  'w-full rounded-base border bg-white px-3.5 py-2.5 text-body1 text-main placeholder:text-weak',
  {
    variants: {
      state: {
        default: 'border-main focus:border-primary',
        error: 'focus:border-error',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  maxLength?: number;
  type?: 'text' | 'email' | 'password' | 'number';
}

function TextInput(
  {
    value,
    label,
    description,
    errorMessage,
    required,
    maxLength,
    type = 'text',
    className,
    ...props
  }: TextInputProps,
  ref: Ref<HTMLInputElement>
) {
  const inputState = errorMessage ? 'error' : 'default';
  return (
    <div className="flex w-min flex-col gap-1.5">
      {label && (
        <label htmlFor={label} className="text-title2 text-main">
          {label}
          {required && (
            <span className="text-error" aria-hidden>
              {' *'}
            </span>
          )}
        </label>
      )}
      {description && <p className="text-body2 text-alt">{description}</p>}
      <input
        value={value}
        type={type}
        ref={ref}
        required={required}
        className={cn(inputVariants({ state: inputState }), className)}
        aria-invalid={!!errorMessage}
        aria-describedby={
          errorMessage ? `${label}-error` : description ? `${label}-description` : undefined
        }
        {...props}
      />
      <div className="relative">
        {errorMessage && (
          <p className="text-label1 text-error" id={`${label}-error`}>
            {errorMessage}
          </p>
        )}
        {maxLength && (
          <p className="w-100 absolute right-0 top-0 text-body4 text-weak">{`${value?.length ?? 0}/${maxLength}`}</p>
        )}
      </div>
    </div>
  );
}

export default forwardRef<HTMLInputElement, TextInputProps>(TextInput);
