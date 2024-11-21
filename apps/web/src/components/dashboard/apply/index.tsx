import { useState } from 'react';

import Select from '@/components/common/Select';

import TicleInfoCard from './TicleInfoCard';

const FILTER_OPTIONS = ['전체', '진행 예정', '종료']; // TODO: label과 value분리

interface TicleInfo {
  id: number;
  ticleOwner: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'completed';
}

const TICLE_INFO: TicleInfo[] = [
  {
    id: 1,
    ticleOwner: '김티클',
    title: '야, 너도 부캠할 수 있어',
    startTime: '2024-11-05T10:00:00Z',
    endTime: '2024-11-05T13:00:00Z',
    status: 'pending',
  },
  {
    id: 2,
    ticleOwner: '김티클',
    title: '야, 너도 부캠할 수 있어',
    startTime: '2024-11-05T10:00:00Z',
    endTime: '2024-11-05T13:00:00Z',
    status: 'pending',
  },
];

function Apply() {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(FILTER_OPTIONS[0]);
  const onOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <main className="mt-14 flex w-full flex-col gap-12">
      <Select options={FILTER_OPTIONS} selectedOption={selectedOption} onChange={onOptionChange} />
      {TICLE_INFO.map((ticle) => (
        <TicleInfoCard
          key={ticle.id}
          ticleId={ticle.id}
          ticleTitle={ticle.title}
          ticleOwner={ticle.ticleOwner}
          startTime={ticle.startTime}
          endTime={ticle.endTime}
          status={ticle.status}
        />
      ))}
    </main>
  );
}

export default Apply;
