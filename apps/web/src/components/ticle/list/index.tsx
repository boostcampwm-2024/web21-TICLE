import { Link } from '@tanstack/react-router';
import { Fragment, useState } from 'react';

import Empty from '@/components/common/Empty';
import Loading from '@/components/common/Loading';
import Select, { Option } from '@/components/common/Select';
import Tab, { TabData } from '@/components/common/Tab';
import { useTicleList } from '@/hooks/api/ticle';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { formatDateTimeRange } from '@/utils/date';

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTicleList({
    pageSize: 12,
    isOpen: selectedTab === 'OPENED',
    sort: sortOption.value as 'newest' | 'oldest' | 'trending',
  });

  const { ref: intersectionRef } = useIntersectionObserver({
    hasNextPage,
    fetchNextPage,
  });

  return (
    <div className="mt-20 flex w-[80rem] flex-col gap-12 justify-self-center">
      <div className="flex w-full justify-between">
        <Tab tabItems={TICLE_LIST_TAB_DATA} selectedTab={selectedTab} />
        <Select options={SORT_OPTIONS} selectedOption={sortOption} onChange={handleOptionChange} />
      </div>
      <main className="mb-16 mt-5 flex flex-wrap gap-5">
        {isLoading || !data?.pages[0] ? (
          <div className="flex h-80 w-full items-center justify-center">
            <Loading color="primary" />
          </div>
        ) : data?.pages[0].ticles.length === 0 ? (
          <Empty />
        ) : (
          data?.pages.map((page) => (
            <Fragment key={page.meta.page}>
              {page.ticles.map((ticle) => (
                <Link key={ticle.id} to="/ticle/$ticleId" params={{ ticleId: ticle.id.toString() }}>
                  <TicleCard
                    title={ticle.title}
                    tags={ticle.tags}
                    date={getDateString(ticle.startTime, ticle.endTime)}
                    speaker={ticle.speakerName}
                    applicantsCount={ticle.applicantsCount}
                    speakerProfileImg={ticle.speakerProfileImageUrl}
                  />
                </Link>
              ))}
            </Fragment>
          ))
        )}

        <div ref={intersectionRef} className="h-10 w-full" aria-hidden />
        {isFetchingNextPage && (
          <div className="flex w-full justify-center">
            <Loading color="primary" />
          </div>
        )}
      </main>
    </div>
  );
}

export default TicleList;
