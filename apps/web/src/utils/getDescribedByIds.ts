interface DescribedBy {
  ariaId: string;
  description?: string;
  errorMessage?: string;
  maxLength?: number;
}

const getDescribedByIds = ({ ariaId, description, errorMessage, maxLength }: DescribedBy) =>
  [
    description && `${ariaId}-description`,
    errorMessage && `${ariaId}-error`,
    maxLength && `${ariaId}-counter`,
  ]
    .filter(Boolean)
    .join(' ');

export default getDescribedByIds;
