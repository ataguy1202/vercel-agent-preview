'use client';

import { motion } from 'motion/react';
import { WordDiff } from '@/components/ui/diff-viewer';
import type { EvalScenario } from '@/lib/types';

export function BehaviorDiff({ scenarios }: { scenarios: EvalScenario[] }) {
  const displayScenarios = scenarios.filter(s => s.currentOutput.response !== s.previewOutput.response).slice(0, 4);

  return (
    <div className="space-y-6">
      {displayScenarios.map((scenario, i) => (
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="border border-border-default rounded-lg overflow-hidden"
        >
          {/* Scenario header */}
          <div className="bg-bg-200 px-5 py-3 border-b border-border-default flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">{scenario.name}</span>
            <span className="text-xs text-text-tertiary">{scenario.category}</span>
          </div>

          {/* Split view */}
          <div className="flex min-h-[200px]">
            {/* Current */}
            <div className="flex-1 border-r border-border-default flex flex-col">
              <div className="bg-bg-100 px-5 py-2.5 border-b border-border-subtle">
                <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-medium">
                  Current (Production)
                </span>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {scenario.currentOutput.response}
                </p>
                {scenario.currentOutput.toolCalls.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-medium">Tool Calls</span>
                    <div className="mt-2 space-y-1.5">
                      {scenario.currentOutput.toolCalls.map((tc, j) => (
                        <div key={j} className="flex items-center gap-2.5 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary shrink-0" />
                          <span className="font-mono text-text-secondary">{tc.name}</span>
                          <span className="text-text-tertiary">{tc.durationMs}ms</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 flex flex-col">
              <div className="bg-accent-blue/5 px-5 py-2.5 border-b border-accent-blue/10">
                <span className="text-[10px] uppercase tracking-wider text-accent-blue-light font-medium">
                  Preview
                </span>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {scenario.previewOutput.response}
                </p>
                {scenario.previewOutput.toolCalls.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-medium">Tool Calls</span>
                    <div className="mt-2 space-y-1.5">
                      {scenario.previewOutput.toolCalls.map((tc, j) => (
                        <div key={j} className="flex items-center gap-2.5 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0" />
                          <span className="font-mono text-accent-blue-light">{tc.name}</span>
                          <span className="text-text-tertiary">{tc.durationMs}ms</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Word diff */}
          <div className="bg-bg-200 px-5 py-4 border-t border-border-default">
            <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-medium block mb-3">Word-Level Diff</span>
            <WordDiff current={scenario.currentOutput.response} preview={scenario.previewOutput.response} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
