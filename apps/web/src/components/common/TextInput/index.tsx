import { forwardRef, InputHTMLAttributes, Ref } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
}

function TextInput(
  {
    label,
    description,
    errorMessage,
    required,
    type = 'text',
    className,
    ...props
  }: TextInputProps,
  ref: Ref<HTMLInputElement>
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-title2 text-main">
          {label}
          {required && <span className="text-error">{' *'}</span>}
        </label>
      )}
      {description && <p className="text-body3 text-alt">{description}</p>}
      <input
        {...props}
        type={type}
        ref={ref}
        required={required}
        className={`${className} ${errorMessage && 'focus:border-error'} boder-main h-11 w-full rounded border border-main bg-white px-3.5 py-2.5 text-body1 text-main placeholder:text-weak focus:border-primary focus:outline-none`}
      />
      {errorMessage && <span className="text-label1 text-error">{errorMessage}</span>}
    </div>
  );
}

export default forwardRef<HTMLInputElement, TextInputProps>(TextInput);
