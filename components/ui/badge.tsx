'use client';

import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'outline' | 'blue';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-bg-300 text-text-secondary',
  success: 'bg-accent-blue/15 text-accent-blue-light',
  error: 'bg-semantic-error/15 text-semantic-error',
  warning: 'bg-semantic-warning/15 text-semantic-warning',
  outline: 'border border-border-default text-text-secondary',
  blue: 'bg-accent-blue/15 text-accent-blue-light',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
