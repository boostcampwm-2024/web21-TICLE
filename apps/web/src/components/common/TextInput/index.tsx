import { cva } from 'class-variance-authority';
import { ChangeEvent, forwardRef, InputHTMLAttributes, Ref, useRef } from 'react';

import ExclamationIc from '@/assets/icons/exclamation.svg?react';
import cn from '@/utils/cn';

const VALIDATION_STATE = {
  default: 'default',
  error: 'error',
} as const;

const inputVariants = cva(
  'w-full rounded-base border bg-white px-3.5 py-2.5 text-body1 text-main placeholder:text-weak',
  {
    variants: {
      validation: {
        [VALIDATION_STATE.default]: 'border-main focus:border-primary',
        [VALIDATION_STATE.error]: 'focus:border-error',
      },
    },
    defaultVariants: {
      validation: 'default',
    },
  }
);

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  maxLength?: number;
  width?: number;
  type?: 'text' | 'email' | 'password' | 'number';
}

function TextInput(
  {
    label,
    description,
    errorMessage,
    required,
    maxLength,
    type = 'text',
    width,
    className,
    onChange,
    ...props
  }: TextInputProps,
  ref: Ref<HTMLInputElement>
) {
  const inputValidation = errorMessage ? VALIDATION_STATE.error : VALIDATION_STATE.default;
  const counterRef = useRef<HTMLParagraphElement>(null);

  const handleCounter = (e: ChangeEvent<HTMLInputElement>) => {
    if (maxLength && counterRef.current) {
      counterRef.current.textContent = `${e.target.value.length}/${maxLength}`;
    }
    onChange?.(e);
  };

  return (
    <div className={cn('flex flex-col gap-1.5', width && `w-${width}`)}>
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
      {description && (
        <p className="text-body2 text-alt" id={`${label}-description`}>
          {description}
        </p>
      )}
      <input
        id={label}
        type={type}
        ref={ref}
        required={required}
        onChange={handleCounter}
        className={cn(inputVariants({ validation: inputValidation }), className)}
        aria-invalid={!!errorMessage}
        aria-describedby={
          errorMessage ? `${label}-error` : description ? `${label}-description` : undefined
        }
        {...props}
      />
      <div className="relative">
        {errorMessage && (
          <p className="flex items-center gap-1 text-label1 text-error" id={`${label}-error`}>
            <ExclamationIc className="fill-error" width={9} />
            {errorMessage}
          </p>
        )}
        {maxLength && (
          <p
            ref={counterRef}
            className="absolute right-0 top-0 text-body4 text-weak"
          >{`${props.defaultValue?.toString().length ?? 0}/${maxLength}`}</p>
        )}
      </div>
    </div>
  );
}

export default forwardRef<HTMLInputElement, TextInputProps>(TextInput);
