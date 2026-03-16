'use client';

import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { ComparisonBar } from '@/components/ui/chart';
import { cn, formatCost, formatLatency, formatTokens, formatPercentage } from '@/lib/utils';
import type { MetricsComparison } from '@/lib/types';

export function MetricsCompare({ metrics }: { metrics: MetricsComparison }) {
  const { current, preview } = metrics;
  const costSavingsPerInteraction = current.avgCost - preview.avgCost;
  const dailyVolume = 15000;
  const monthlySavings = costSavingsPerInteraction * dailyVolume * 30;

  return (
    <div className="space-y-6">
      {/* Metric comparison bars */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <ComparisonBar
              label="Cost per Interaction"
              currentValue={current.avgCost}
              previewValue={preview.avgCost}
              formatValue={formatCost}
              lowerIsBetter
            />
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <ComparisonBar
              label="Average Latency"
              currentValue={current.avgLatencyMs}
              previewValue={preview.avgLatencyMs}
              formatValue={formatLatency}
              lowerIsBetter
            />
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <ComparisonBar
              label="Token Usage (avg)"
              currentValue={current.avgTokens}
              previewValue={preview.avgTokens}
              formatValue={(v) => formatTokens(v)}
              lowerIsBetter
            />
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <ComparisonBar
              label="Guardrail Trigger Rate"
              currentValue={current.guardrailTriggerRate}
              previewValue={preview.guardrailTriggerRate}
              formatValue={(v) => `${v.toFixed(1)}%`}
              lowerIsBetter
            />
          </Card>
        </motion.div>
      </div>

      {/* Model breakdown */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <h3 className="text-sm font-medium text-text-primary mb-3">Model Usage Breakdown</h3>
          <div className="space-y-3">
            {/* Collect all unique models */}
            {getAllModels(current, preview).map(model => {
              const currentPct = current.modelBreakdown.find(m => m.model === model)?.percentage ?? 0;
              const previewPct = preview.modelBreakdown.find(m => m.model === model)?.percentage ?? 0;
              return (
                <div key={model} className="flex items-center gap-4">
                  <span className="text-xs font-mono text-text-secondary w-36 shrink-0">{model}</span>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-4 bg-bg-200 rounded overflow-hidden relative">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-text-tertiary/30 rounded"
                        initial={{ width: 0 }}
                        animate={{ width: `${currentPct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                      <motion.div
                        className="absolute top-0 left-0 h-2 mt-1 ml-px bg-accent-blue rounded"
                        initial={{ width: 0 }}
                        animate={{ width: `${previewPct}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      />
                    </div>
                    <div className="flex gap-3 text-xs w-28 shrink-0">
                      <span className="text-text-tertiary">{currentPct}%</span>
                      <span className="text-text-tertiary">→</span>
                      <span className={cn(
                        previewPct > currentPct ? 'text-accent-blue-light' : previewPct < currentPct ? 'text-text-tertiary' : 'text-text-secondary'
                      )}>
                        {previewPct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Cost projection */}
      {costSavingsPerInteraction > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="!border-accent-blue/20 !bg-accent-blue/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-blue/15 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-blue-light">
                  <path d="M9 1v16M5 4h6a2 2 0 0 1 0 4H4M6 8h5a2 2 0 0 1 0 4H4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">
                  Estimated monthly savings: <span className="text-green-400">${Math.round(monthlySavings).toLocaleString()}/mo</span>
                </div>
                <div className="text-xs text-text-tertiary">
                  Based on current volume of {dailyVolume.toLocaleString()} interactions/day
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function getAllModels(current: { modelBreakdown: { model: string }[] }, preview: { modelBreakdown: { model: string }[] }): string[] {
  const set = new Set<string>();
  current.modelBreakdown.forEach(m => set.add(m.model));
  preview.modelBreakdown.forEach(m => set.add(m.model));
  return Array.from(set);
}
