import { forwardRef, useId, Ref, useState, ChangeEvent, KeyboardEvent } from 'react';
import { Control, useController } from 'react-hook-form';

import CloseCircleIc from '@/assets/icons/close-circle.svg?react';
import ExclamationIc from '@/assets/icons/exclamation.svg?react';
import Badge from '@/components/common/Badge';

import { OpenFormInputs } from '../../../../../../packages/types/src/formSchema';

interface HashtagInputProps {
  label?: string;
  required?: boolean;
  control: Control<OpenFormInputs>;
  maxLength?: number;
}

function HashtagInput({ label, required, control }: HashtagInputProps, ref: Ref<HTMLInputElement>) {
  const ariaId = useId();
  const [inputValue, setInputValue] = useState('');

  const {
    field: { value: hashtags = [], onChange },
    fieldState: { error },
  } = useController({
    name: 'hashtag',
    control,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    e.preventDefault();

    const newHashag = inputValue.trim();
    if (!newHashag) return;

    onChange([...hashtags, newHashag]);
    setInputValue('');
  };

  const handleDelete = (indexToRemove: number) => {
    const newTags = hashtags.filter((_, idx) => idx !== indexToRemove);
    onChange(newTags);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={ariaId} className="text-title2 text-main">
          {label}
          {required && (
            <span className="text-error" aria-label="필수 입력">
              {' *'}
            </span>
          )}
        </label>
      )}
      <div className="flex w-full gap-2 rounded-base border bg-white px-3.5 py-2.5 text-body1 text-main placeholder:text-weak">
        {hashtags.map((tag, idx) => (
          <Badge key={`${tag}-${idx}`} className="flex flex-shrink-0 gap-1">
            {tag}
            <button type="button" onClick={() => handleDelete(idx)}>
              <CloseCircleIc width={12} height={12} className="fill-primary" />
            </button>
          </Badge>
        ))}
        <input
          value={inputValue}
          type="text"
          ref={ref}
          id={ariaId}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full"
          placeholder="작성 후 Enter 키를 눌러 추가해 주세요."
        />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-label1 text-error" id={`${ariaId}-error`}>
          <ExclamationIc className="fill-error" width={9} height={9} aria-hidden />
          {error.message}
        </p>
      )}
    </div>
  );
}

export default forwardRef<HTMLInputElement, HashtagInputProps>(HashtagInput);
