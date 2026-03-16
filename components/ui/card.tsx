'use client';

import { cn } from '@/lib/utils';

export function Card({
  children,
  className,
  interactive,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        'bg-bg-100 border border-border-default rounded-lg p-4',
        'transition-colors duration-150',
        interactive && 'cursor-pointer hover:border-border-strong hover:bg-bg-200',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
