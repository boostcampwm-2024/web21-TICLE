import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import Select, { Option } from '@/components/common/Select';
import Tab, { TabData } from '@/components/common/Tab';
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

const TICLE_LIST_TAB = {
  OPENED: '진행 예정 티클',
  CLOSED: '종료된 티클',
} as const;

function TicleList() {
  const [sortOption, setSortOption] = useState<Option>(SORT_OPTIONS[0] as Option);

  const [selectedTab, setSelectedTab] = useState<keyof typeof TICLE_LIST_TAB>('OPENED');

  const TICLE_LIST_TAB_DATA: TabData<keyof typeof TICLE_LIST_TAB>[] = [
    {
      value: 'OPENED',
      label: TICLE_LIST_TAB.OPENED,
      onClick: () => setSelectedTab('OPENED'),
    },
    {
      value: 'CLOSED',
      label: TICLE_LIST_TAB.CLOSED,
      onClick: () => setSelectedTab('CLOSED'),
    },
  ];

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
        <div className="flex w-full justify-between">
          <Tab tabItems={TICLE_LIST_TAB_DATA} selectedTab={selectedTab} />
          <Select
            options={SORT_OPTIONS}
            selectedOption={sortOption}
            onChange={handleOptionChange}
          />
        </div>
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
