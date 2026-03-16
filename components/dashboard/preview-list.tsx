'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { StatusDot } from '@/components/ui/status-dot';
import { getStatusLabel, getChangeTypeLabel, formatRelativeTime, cn } from '@/lib/utils';
import type { AgentPreview } from '@/lib/types';

export function PreviewList({ previews }: { previews: AgentPreview[] }) {
  return (
    <div className="space-y-3">
      {previews.map((preview, index) => (
        <motion.div
          key={preview.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <Link href={`/preview/${preview.id}`}>
            <div className="bg-bg-100 border border-border-default rounded-lg p-5 hover:border-border-strong hover:bg-bg-200 transition-all duration-150 cursor-pointer">
              {/* Top row: agent name, badges, status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <StatusDot status={preview.status} />
                  <span className="font-medium text-sm text-text-primary">
                    {preview.agentName}
                  </span>
                  <div className="flex gap-1.5 ml-1">
                    {preview.changeTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-[10px]">
                        {getChangeTypeLabel(type)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge variant={
                  preview.status === 'passed' ? 'success'
                    : preview.status === 'failed' ? 'error'
                      : preview.status === 'running' ? 'blue'
                        : 'warning'
                }>
                  {getStatusLabel(preview.status)}
                </Badge>
              </div>

              {/* Bottom row: branch, score, author */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-text-tertiary">
                  {preview.branchName}
                </span>

                <div className="flex items-center gap-6">
                  {/* Eval score */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">Eval:</span>
                    <span className="text-sm text-text-secondary font-mono">{preview.evalScore.current}%</span>
                    {preview.status !== 'running' ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                          className={cn(
                            preview.evalScore.preview > preview.evalScore.current ? 'text-green-400'
                              : preview.evalScore.preview < preview.evalScore.current ? 'text-semantic-error'
                                : 'text-text-tertiary'
                          )}
                        >
                          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        <span className={cn(
                          'font-mono font-medium text-sm',
                          preview.evalScore.preview > preview.evalScore.current ? 'text-green-400'
                            : preview.evalScore.preview < preview.evalScore.current ? 'text-semantic-error'
                              : 'text-text-primary'
                        )}>
                          {preview.evalScore.preview}%
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-text-tertiary">running...</span>
                    )}
                    <span className="text-[10px] text-text-tertiary ml-1">
                      ({preview.evalScenariosPassed}/{preview.evalScenariosTotal})
                    </span>
                  </div>

                  {/* Separator */}
                  <span className="text-border-default">|</span>

                  {/* Author & time */}
                  <div className="flex items-center gap-2">
                    <Avatar name={preview.author.name} initials={preview.author.avatar} size="sm" />
                    <span className="text-xs text-text-tertiary">
                      {formatRelativeTime(preview.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
