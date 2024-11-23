import Loading from '@/components/common/Loading/Loading';
import { useTicleList } from '@/hooks/api/ticle';
import { formatDateTimeRange } from '@/utils/date';

import TicleCard from './TicleCard';

const getDateString = (startTime: string, endTime: string) => {
  const { dateStr, timeRangeStr } = formatDateTimeRange(startTime, endTime);
  return [dateStr, timeRangeStr].join(' ');
};

function TicleList() {
  const { data: { ticles, meta } = { ticles: [], meta: {} }, isLoading } = useTicleList();

  return (
    <main className="flex flex-wrap justify-center gap-5">
      {ticles.map((ticle) => (
        <TicleCard
          key={ticle.id}
          title={ticle.title}
          tags={ticle.tags}
          date={getDateString(ticle.startTime, ticle.endTime)}
          speaker={ticle.speakerName}
          applicantsCount={ticle.applicantsCount}
        />
      ))}
    </main>
  );
}

export default TicleList;
