import { cva } from 'class-variance-authority';
import { HTMLAttributes } from 'react';

import PersonIc from '@/assets/icons/person.svg?react';
import cn from '@/utils/cn';

const AVATAR_SIZE = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

const avatarVariants = cva('flex items-center justify-center overflow-hidden rounded-full bg-alt', {
  variants: {
    size: {
      [AVATAR_SIZE.sm]: 'h-[50px] w-[50px]',
      [AVATAR_SIZE.md]: 'h-[84px] w-[84px]',
      [AVATAR_SIZE.lg]: 'h-[100px] w-[100px]',
    },
  },
  defaultVariants: {
    size: AVATAR_SIZE.sm,
  },
});

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size: (typeof AVATAR_SIZE)[keyof typeof AVATAR_SIZE];
}

function Avatar({ alt = 'avatar', src, size, className, ...rest }: AvatarProps) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={cn(avatarVariants({ size }), className)}
      {...rest}
    >
      {src && <img src={src} alt={alt} className="h-full w-full object-cover" />}
      {!src && <PersonIc className="h-full w-full fill-weak text-weak" />}
    </div>
  );
}

export default Avatar;
