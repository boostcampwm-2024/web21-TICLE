import { HTMLAttributes } from 'react';

import personImage from '@/assets/images/person.png';
import cn from '@/utils/cn';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size: number;
}

function Avatar(props: AvatarProps) {
  const { src = personImage, alt = 'avatar', size, className, ...rest } = props;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-full bg-alt',
        className
      )}
      {...rest}
    >
      <img src={src} alt={alt} className="object-cover" />
    </div>
  );
}

export default Avatar;
