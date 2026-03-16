'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { CodeDiff } from '@/components/ui/diff-viewer';
import { cn } from '@/lib/utils';
import type { ConfigDiff, ConfigSection } from '@/lib/types';

function ConfigSectionView({ section, index }: { section: ConfigSection; index: number }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-border-default rounded-lg overflow-hidden"
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-bg-200 hover:bg-bg-300 transition-colors cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={cn('text-text-tertiary transition-transform duration-200', !collapsed && 'rotate-90')}
          >
            <path d="M4.5 2.5l3.5 3.5-3.5 3.5" />
          </svg>
          <span className="text-sm font-medium text-text-primary">{section.title}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-text-tertiary">
          {section.type === 'text_diff' ? 'text' : 'json'}
        </span>
      </button>

      {!collapsed && (
        <div className="p-4 bg-bg-100">
          <CodeDiff current={section.current} preview={section.preview} />
        </div>
      )}
    </motion.div>
  );
}

export function ConfigDiffView({ configDiff }: { configDiff: ConfigDiff }) {
  return (
    <div className="space-y-4">
      {configDiff.sections.map((section, i) => (
        <ConfigSectionView key={section.title} section={section} index={i} />
      ))}
    </div>
  );
}
