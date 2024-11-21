import { forwardRef, useId, Ref, KeyboardEvent } from 'react';
import { Control, useController } from 'react-hook-form';
import { CreateTicleFormType } from '@repo/types';

import CloseCircleIc from '@/assets/icons/close-circle.svg?react';
import ExclamationIc from '@/assets/icons/exclamation.svg?react';
import Badge from '@/components/common/Badge';

interface HashtagInputProps {
  required?: boolean;
  control: Control<CreateTicleFormType>;
  maxLength?: number;
}

function HashtagInput({ required, control }: HashtagInputProps, ref: Ref<HTMLInputElement>) {
  const ariaId = useId();

  const {
    field: { value: tags = [], onChange: onTagsChange },
    fieldState: { error: tagsError },
  } = useController({
    name: 'tags',
    control,
  });

  const {
    field: { value: input = '', onChange: onInputChange },
    fieldState: { error: inputError },
  } = useController({
    name: 'hashtagInput',
    control,
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    handleAddHashtag(e);
    handleDeleteTag(e);
  };

  const handleAddHashtag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    e.preventDefault();

    const newHashag = input.trim();
    if (!newHashag || newHashag.length > 7) return;

    onTagsChange([...tags, newHashag]);
    onInputChange('');
  };

  const handleDeleteTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Backspace' || input !== '') return;

    const newTags = tags.slice(0, tags.length - 1);
    onTagsChange(newTags);
  };

  const handleDeleteBtnClick = (indexToRemove: number) => {
    const newTags = tags.filter((_, idx) => idx !== indexToRemove);
    onTagsChange(newTags);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={ariaId} className="text-title2 text-main">
        해시태그
        {required && (
          <span className="text-error" aria-label="필수 입력">
            {' *'}
          </span>
        )}
      </label>
      <div className="flex w-full items-center gap-2 rounded-base border bg-white px-3.5 py-2.5 text-body1 text-main placeholder:text-weak">
        {tags.map((tag, idx) => (
          <Badge key={`${tag}-${idx}`} className="flex flex-shrink-0 gap-1">
            {tag}
            <button type="button" onClick={() => handleDeleteBtnClick(idx)}>
              <CloseCircleIc width={12} height={12} className="fill-primary" />
            </button>
          </Badge>
        ))}
        <input
          value={input}
          type="text"
          ref={ref}
          id={ariaId}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          className="h-10 w-full"
          placeholder="작성 후 Enter 키를 눌러 추가해 주세요."
        />
      </div>
      {(inputError || tagsError) && (
        <p className="flex items-center gap-1 text-label1 text-error" id={`${ariaId}-error`}>
          <ExclamationIc className="fill-error" width={9} height={9} aria-hidden />
          {inputError?.message || tagsError?.message}
        </p>
      )}
    </div>
  );
}

export default forwardRef<HTMLInputElement, HashtagInputProps>(HashtagInput);
