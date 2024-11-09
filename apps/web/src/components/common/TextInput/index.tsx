import { forwardRef, InputHTMLAttributes, Ref } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
}

function TextInput(
  { label, description, errorMessage, required, type = 'text', ...props }: TextInputProps,
  ref: Ref<HTMLInputElement>
) {
  return (
    <div>
      {label && (
        <label>
          {label}
          {required && '*'}
        </label>
      )}
      {description && <p>{description}</p>}
      <div>
        <input {...props} type={type} ref={ref} required={required} />
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    </div>
  );
}

export default forwardRef<HTMLInputElement, TextInputProps>(TextInput);
