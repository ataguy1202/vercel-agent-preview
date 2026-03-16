'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function Tabs({
  tabs,
  defaultTab,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="flex gap-1 border-b border-border-default">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            'relative px-4 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer',
            active === tab.id ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
          )}
          onClick={() => {
            setActive(tab.id);
            onChange?.(tab.id);
          }}
        >
          <span className="flex items-center gap-2">
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-xs bg-bg-300 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </span>
          {active === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
