import { Fragment, useState } from 'react';

import Empty from '@/components/common/Empty';
import Loading from '@/components/common/Loading';
import Select, { Option } from '@/components/common/Select';
import { useDashboardTicleList } from '@/hooks/api/dashboard';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

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

function Apply() {
  const [selectedOption, setSelectedOption] = useState<Option>(FILTER_OPTIONS[0] as Option);
  const onOptionChange = (option: Option) => {
    setSelectedOption(option);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useDashboardTicleList(
    {
      isSpeaker: false,
      page: 1,
      pageSize: 10,
      ...(selectedOption.value && { status: selectedOption.value as 'open' | 'closed' }),
    }
  );

  const { ref: intersectionRef } = useIntersectionObserver({
    hasNextPage,
    fetchNextPage,
  });

  return (
    <main className="mt-14 flex w-full flex-col gap-12">
      <Select options={FILTER_OPTIONS} selectedOption={selectedOption} onChange={onOptionChange} />
      <div className="flex flex-col gap-6">
        {isLoading || !data ? (
          <div className="flex h-80 w-full items-center justify-center">
            <Loading color="primary" />
          </div>
        ) : !data.pages[0]?.ticles?.length ? (
          <Empty />
        ) : (
          <div className="flex flex-col gap-6">
            {data?.pages.map((page) => (
              <Fragment key={page.meta.page}>
                {page.ticles.map((ticle) => (
                  <TicleInfoCard
                    key={ticle.id}
                    ticleId={ticle.id}
                    ticleTitle={ticle.title}
                    speakerName={ticle.speakerName as string}
                    startTime={ticle.startTime}
                    endTime={ticle.endTime}
                    status={ticle.ticleStatus}
                  />
                ))}
              </Fragment>
            ))}
            <div ref={intersectionRef} className="h-10 w-full" aria-hidden />
            {isFetchingNextPage && (
              <div className="flex w-full justify-center">
                <Loading color="primary" />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Apply;
