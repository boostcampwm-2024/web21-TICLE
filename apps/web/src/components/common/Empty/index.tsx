import TicleCharacter from '@/assets/images/ticle-character.png';
import cn from '@/utils/cn';

interface EmptyProps {
  title?: string;
  className?: string;
}

function Empty({ title = '항목이 비어있어요!', className }: EmptyProps) {
  return (
    <div
      className={cn(
        'custom-dashed flex h-96 w-full flex-col items-center justify-center gap-8',
        className
      )}
    >
      <img
        src={TicleCharacter}
        alt="흑백 티클 캐릭터"
        className="grayscale"
        width={180}
        height={180}
      />
      <h1 className="text-head2 text-weak">{title}</h1>
    </div>
  );
}

export default Empty;
