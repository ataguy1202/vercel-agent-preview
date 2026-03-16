'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getPreviewById, getEvalScenarios, getConfigDiff } from '@/lib/mock-data';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { StatusDot } from '@/components/ui/status-dot';
import { EvalResults } from '@/components/preview/eval-results';
import { BehaviorDiff } from '@/components/preview/behavior-diff';
import { MetricsCompare } from '@/components/preview/metrics-compare';
import { ConfigDiffView } from '@/components/preview/config-diff';
import { ReviewPanel } from '@/components/preview/review-panel';
import { getStatusLabel, getChangeTypeLabel, formatRelativeTime, cn } from '@/lib/utils';

const tabDefs = [
  { id: 'eval', label: 'Eval Results' },
  { id: 'diff', label: 'Behavior Diff' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'config', label: 'Config' },
];

export function PreviewDetail({ id }: { id: string }) {
  const preview = getPreviewById(id);
  const [activeTab, setActiveTab] = useState('eval');

  if (!preview) {
    return (
      <div className="p-8 text-center text-text-tertiary">
        Preview not found. <Link href="/" className="text-accent-blue hover:underline">Back to previews</Link>
      </div>
    );
  }

  const scenarios = getEvalScenarios(id);
  const configDiff = getConfigDiff(id);

  const scoreChange = preview.status !== 'running'
    ? preview.evalScore.preview - preview.evalScore.current
    : null;

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8.5 3L4.5 7l4 4" />
          </svg>
          Back to Previews
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Agent name + author row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary mb-3">{preview.agentName}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <code className="text-xs font-mono text-text-tertiary bg-bg-200 px-2.5 py-1 rounded">
                  {preview.branchName}
                </code>
                <StatusDot status={preview.status} />
                <Badge variant={
                  preview.status === 'passed' ? 'success'
                    : preview.status === 'failed' ? 'error'
                      : preview.status === 'running' ? 'blue'
                        : 'warning'
                }>
                  {getStatusLabel(preview.status)}
                </Badge>
                {preview.changeTypes.map(type => (
                  <Badge key={type} variant="outline">{getChangeTypeLabel(type)}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary shrink-0 ml-6">
              <Avatar name={preview.author.name} initials={preview.author.avatar} size="sm" />
              <span>{preview.author.name}</span>
              <span className="text-text-tertiary">·</span>
              <span className="text-text-tertiary">{formatRelativeTime(preview.createdAt)}</span>
            </div>
          </div>

          {/* Score bar */}
          <div className="bg-bg-100 border border-border-default rounded-lg px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="text-sm text-text-secondary font-medium">Eval Score</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold font-mono text-text-secondary">
                  {preview.evalScore.current}%
                </span>
                {preview.status !== 'running' ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-tertiary">
                      <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className={cn(
                      'text-2xl font-semibold font-mono',
                      preview.evalScore.preview > preview.evalScore.current ? 'text-green-400' :
                        preview.evalScore.preview < preview.evalScore.current ? 'text-semantic-error' : 'text-text-primary'
                    )}>
                      {preview.evalScore.preview}%
                    </span>
                    {scoreChange !== null && (
                      <span className={cn(
                        'text-sm font-mono ml-1',
                        scoreChange > 0 ? 'text-green-400' : scoreChange < 0 ? 'text-semantic-error' : 'text-text-tertiary'
                      )}>
                        ({scoreChange > 0 ? '+' : ''}{scoreChange}%)
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-tertiary">
                      <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className="text-lg text-text-tertiary animate-pulse-dot">running...</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-sm text-text-tertiary">
              {preview.evalScenariosPassed}/{preview.evalScenariosTotal} scenarios passed
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs
          tabs={tabDefs.map(t => ({
            ...t,
            count: t.id === 'eval' ? scenarios.length : undefined,
          }))}
          defaultTab="eval"
          onChange={setActiveTab}
        />

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="py-6"
        >
          {activeTab === 'eval' && <EvalResults scenarios={scenarios} />}
          {activeTab === 'diff' && <BehaviorDiff scenarios={scenarios} />}
          {activeTab === 'metrics' && <MetricsCompare metrics={preview.metrics} />}
          {activeTab === 'config' && configDiff && <ConfigDiffView configDiff={configDiff} />}
          {activeTab === 'config' && !configDiff && (
            <div className="text-center py-16 text-text-tertiary text-sm">No config changes in this preview.</div>
          )}
        </motion.div>
      </div>

      {/* Review sidebar */}
      <div className="w-[320px] border-l border-border-default bg-bg-000 p-6 overflow-y-auto shrink-0">
        <ReviewPanel preview={preview} />
      </div>
    </div>
  );
}
