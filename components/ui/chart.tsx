'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function ComparisonBar({
  label,
  currentValue,
  previewValue,
  formatValue,
  lowerIsBetter = false,
  className,
}: {
  label: string;
  currentValue: number;
  previewValue: number;
  formatValue: (v: number) => string;
  lowerIsBetter?: boolean;
  className?: string;
}) {
  const maxVal = Math.max(currentValue, previewValue);
  const currentPct = (currentValue / maxVal) * 100;
  const previewPct = (previewValue / maxVal) * 100;
  const change = ((previewValue - currentValue) / currentValue) * 100;
  const isImproved = lowerIsBetter ? change < 0 : change > 0;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className={cn(
          'text-xs font-mono',
          isImproved ? 'text-green-400' : 'text-semantic-error'
        )}>
          {change > 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-text-tertiary w-16 shrink-0">Current</span>
          <div className="flex-1 h-5 bg-bg-200 rounded overflow-hidden">
            <motion.div
              className="h-full bg-text-tertiary/40 rounded"
              initial={{ width: 0 }}
              animate={{ width: `${currentPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-mono text-text-secondary w-20 text-right">
            {formatValue(currentValue)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-text-tertiary w-16 shrink-0">Preview</span>
          <div className="flex-1 h-5 bg-bg-200 rounded overflow-hidden">
            <motion.div
              className="h-full bg-accent-blue rounded"
              initial={{ width: 0 }}
              animate={{ width: `${previewPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
          <span className="text-xs font-mono text-text-primary w-20 text-right">
            {formatValue(previewValue)}
          </span>
        </div>
      </div>
    </div>
  );
}
