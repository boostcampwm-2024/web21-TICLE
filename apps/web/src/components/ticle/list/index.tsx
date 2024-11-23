import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import Loading from '@/components/common/Loading/Loading';
import Select, { Option } from '@/components/common/Select';
import { useTicleList } from '@/hooks/api/ticle';
import { formatDateTimeRange } from '@/utils/date';

import Banner from './Banner';
import TicleCard from './TicleCard';

const getDateString = (startTime: string, endTime: string) => {
  const { dateStr, timeRangeStr } = formatDateTimeRange(startTime, endTime);
  return [dateStr, timeRangeStr].join(' ');
};

const SORT_OPTIONS: Option[] = [
  {
    label: '최신순',
    value: 'newest',
  },
  {
    label: '오래된순',
    value: 'oldest',
  },
  {
    label: '신청자순',
    value: 'trending',
  },
];

function TicleList() {
  const [sortOption, setSortOption] = useState<Option>(SORT_OPTIONS[0] as Option);

  const handleOptionChange = (option: Option) => {
    setSortOption(option);
  };

  const { data: { ticles, meta } = { ticles: [], meta: {} }, isLoading } = useTicleList({
    sort: sortOption.value as 'newest' | 'oldest' | 'trending',
  });

  return (
    <div>
      <Banner />
      <div className="mt-14 flex w-[80rem] flex-col gap-12 justify-self-center">
        <Select options={SORT_OPTIONS} selectedOption={sortOption} onChange={handleOptionChange} />
        <main className="my-12 flex flex-wrap gap-5">
          {ticles.map((ticle) => (
            <Link key={ticle.id} to="/ticle/$ticleId" params={{ ticleId: ticle.id.toString() }}>
              <TicleCard
                title={ticle.title}
                tags={ticle.tags}
                date={getDateString(ticle.startTime, ticle.endTime)}
                speaker={ticle.speakerName}
                applicantsCount={ticle.applicantsCount}
              />
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
}

export default TicleList;
