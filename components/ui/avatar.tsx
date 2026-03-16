'use client';

import { cn, getAvatarColor } from '@/lib/utils';

export function Avatar({
  name,
  initials,
  size = 'md',
  className,
}: {
  name: string;
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium text-white shrink-0',
        getAvatarColor(name),
        sizeClasses[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}
