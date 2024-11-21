import { useState } from 'react';

import Select from '@/components/common/Select';

const FILTER_OPTIONS = ['전체', '진행 예정', '종료']; // TODO: label과 value분리

function Apply() {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(FILTER_OPTIONS[0]);
  const onOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <main className="mt-14 flex w-full flex-col gap-12">
      <Select options={FILTER_OPTIONS} selectedOption={selectedOption} onChange={onOptionChange} />
    </main>
  );
}

export default Apply;
