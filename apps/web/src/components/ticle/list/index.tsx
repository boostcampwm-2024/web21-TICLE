import { Link } from '@tanstack/react-router';

import Loading from '@/components/common/Loading/Loading';
import { useTicleList } from '@/hooks/api/ticle';
import { formatDateTimeRange } from '@/utils/date';

import Banner from './Banner';
import TicleCard from './TicleCard';

const getDateString = (startTime: string, endTime: string) => {
  const { dateStr, timeRangeStr } = formatDateTimeRange(startTime, endTime);
  return [dateStr, timeRangeStr].join(' ');
};

function TicleList() {
  const { data: { ticles, meta } = { ticles: [], meta: {} }, isLoading } = useTicleList();

  return (
    <>
      <Banner />
      <main className="my-12 flex flex-wrap justify-center gap-5">
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
    </>
  );
}

export default TicleList;
