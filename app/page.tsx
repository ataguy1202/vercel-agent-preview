'use client';

import { useState } from 'react';
import { getAllPreviews } from '@/lib/mock-data';
import { PreviewList } from '@/components/dashboard/preview-list';
import { cn } from '@/lib/utils';
import type { PreviewStatus } from '@/lib/types';

const filters: { label: string; value: PreviewStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Running', value: 'running' },
  { label: 'Passed', value: 'passed' },
  { label: 'Failed', value: 'failed' },
];

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<PreviewStatus | 'all'>('all');
  const allPreviews = getAllPreviews();
  const filtered = activeFilter === 'all'
    ? allPreviews
    : allPreviews.filter(p => p.status === activeFilter);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-text-primary">Agent Previews</h1>
          <span className="text-xs bg-bg-300 text-text-secondary px-2 py-0.5 rounded-full">
            {allPreviews.length}
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          Review and approve agent behavior changes before production.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-6">
        {filters.map((filter) => {
          const count = filter.value === 'all'
            ? allPreviews.length
            : allPreviews.filter(p => p.status === filter.value).length;
          return (
            <button
              key={filter.value}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer',
                activeFilter === filter.value
                  ? 'bg-text-primary text-bg-000'
                  : 'bg-bg-200 text-text-secondary hover:text-text-primary hover:bg-bg-300'
              )}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
              {count > 0 && (
                <span className={cn(
                  'ml-1.5',
                  activeFilter === filter.value ? 'text-bg-000/60' : 'text-text-tertiary'
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Preview list */}
      <PreviewList previews={filtered} />

      {filtered.length === 0 && (
        <div className="text-center py-16 text-text-tertiary text-sm">
          No previews match this filter.
        </div>
      )}
    </div>
  );
}
