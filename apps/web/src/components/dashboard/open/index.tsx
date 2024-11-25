import { useState } from 'react';

import Select, { Option } from '@/components/common/Select';
import { useDashboardTicleList } from '@/hooks/api/dashboard';

import TicleInfoCard from './TicleInfoCard';

const FILTER_OPTIONS: Option[] = [
  {
    label: '전체',
    value: '',
  },
  {
    label: '진행 중',
    value: 'open',
  },
  {
    label: '종료',
    value: 'closed',
  },
];

function Open() {
  const [selectedOption, setSelectedOption] = useState<Option>(FILTER_OPTIONS[0] as Option);
  const onOptionChange = (option: Option) => {
    setSelectedOption(option);
  };

  const { data: { ticles, meta } = { ticles: [], meta: {} }, isLoading } = useDashboardTicleList({
    isSpeaker: true,
    page: 1,
    pageSize: 10,
    ...(selectedOption.value && { status: selectedOption.value as 'open' | 'closed' }),
  });

  return (
    <main className="mt-14 flex w-full flex-col gap-12">
      <Select options={FILTER_OPTIONS} selectedOption={selectedOption} onChange={onOptionChange} />
      <div className="flex flex-col gap-6">
        {ticles.map((ticle) => (
          <TicleInfoCard
            key={ticle.id}
            ticleId={ticle.id}
            ticleTitle={ticle.title}
            startTime={ticle.startTime}
            endTime={ticle.endTime}
            status={ticle.ticleStatus}
          />
        ))}
      </div>
    </main>
  );
}

export default Open;
