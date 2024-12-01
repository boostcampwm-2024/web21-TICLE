import CalendarIc from '@/assets/icons/calendar.svg?react';
import PersonIc from '@/assets/icons/person-line.svg?react';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';

interface TicleCardProps {
  title: string;
  tags: string[];
  date: string;
  applicantsCount: number;
  speaker: string;
  speakerProfileImg?: string;
}

const TicleCard = ({
  title,
  tags,
  date,
  applicantsCount,
  speaker,
  speakerProfileImg,
}: TicleCardProps) => {
  return (
    <article className="flex h-full w-[19rem] cursor-pointer flex-col justify-between gap-14 rounded-lg border border-main bg-white px-6 py-8 shadow-normal transition-transform duration-500 ease-in-out hover:-translate-y-3 hover:border-primary hover:shadow-up">
      <div className="flex h-52 flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-head3 text-main">{title}</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-1.5">
            <CalendarIc className="fill-main" />
            <span className="text-body1 text-alt">{date}</span>
          </div>
          <div className="flex gap-1.5">
            <PersonIc className="fill-main" />
            <span className="flex">
              <span className="text-body1 text-primary">{applicantsCount}</span>
              <span className="text-body1 text-alt">명 신청</span>
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Avatar src={speakerProfileImg} size="sm" />
        <span className="text-body1 text-alt">{speaker}</span>
      </div>
    </article>
  );
};

export default TicleCard;
