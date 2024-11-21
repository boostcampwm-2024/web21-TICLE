interface DescribedBy {
  ariaId: string;
  description?: string;
  errorMessage?: string;
  maxLength?: number;
}

/**
 *
 * @desc aria-describedby 속성값으로 사용할 ID 문자열들을 조건부로 생성하여 반환하는 함수입니다.
 */
export const getDescribedByIds = ({ ariaId, description, errorMessage, maxLength }: DescribedBy) =>
  [
    description && `${ariaId}-description`,
    errorMessage && `${ariaId}-error`,
    maxLength && `${ariaId}-counter`,
  ]
    .filter(Boolean)
    .join(' ');
