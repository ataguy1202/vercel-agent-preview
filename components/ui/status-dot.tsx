'use client';

import { cn } from '@/lib/utils';
import type { PreviewStatus } from '@/lib/types';

const colorMap: Record<PreviewStatus, string> = {
  running: 'bg-accent-blue',
  passed: 'bg-accent-blue',
  failed: 'bg-semantic-error',
  pending_review: 'bg-semantic-warning',
};

export function StatusDot({
  status,
  className,
}: {
  status: PreviewStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block w-2 h-2 rounded-full shrink-0',
        colorMap[status],
        status === 'running' && 'animate-pulse-dot',
        className
      )}
    />
  );
}
