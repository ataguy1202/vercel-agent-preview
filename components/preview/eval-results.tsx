'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn, getResultLabel, formatTokens, formatLatency, formatCost } from '@/lib/utils';
import type { EvalScenario, ToolCall } from '@/lib/types';

function useTypingAnimation(text: string, speed = 20, trigger = false) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;
    setDisplayed('');
    setIsComplete(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, trigger]);

  return { displayed, isComplete };
}

function ToolCallTimeline({ toolCalls, show }: { toolCalls: ToolCall[]; show: boolean }) {
  return (
    <AnimatePresence>
      {show && toolCalls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-3 border-t border-border-subtle space-y-2"
        >
          <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-medium">Tool Calls</span>
          {toolCalls.map((tc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-2.5 text-xs py-0.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0" />
              <span className="font-mono text-accent-blue-light">{tc.name}</span>
              <span className="text-text-tertiary">({tc.durationMs}ms)</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AgentOutputPanel({
  label,
  output,
  animate,
  isPreview,
}: {
  label: string;
  output: { response: string; toolCalls: ToolCall[]; tokensUsed: number; latencyMs: number; cost: number };
  animate: boolean;
  isPreview: boolean;
}) {
  const { displayed, isComplete } = useTypingAnimation(output.response, 15, animate);
  const showText = animate ? displayed : output.response;
  const showTools = animate ? isComplete : true;

  return (
    <div className={cn(
      'flex-1 p-4 rounded-lg',
      isPreview ? 'bg-accent-blue/5 border border-accent-blue/20' : 'bg-bg-200 border border-border-subtle'
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          'text-[10px] uppercase tracking-wider font-medium',
          isPreview ? 'text-accent-blue-light' : 'text-text-tertiary'
        )}>
          {label}
        </span>
        <div className="flex gap-4 text-[10px] text-text-tertiary">
          <span>{formatTokens(output.tokensUsed)} tok</span>
          <span>{formatLatency(output.latencyMs)}</span>
          <span>{formatCost(output.cost)}</span>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
        {showText}
        {animate && !isComplete && <span className="typing-cursor" />}
      </p>
      <ToolCallTimeline toolCalls={output.toolCalls} show={showTools} />
    </div>
  );
}

function EvalRow({ scenario, index }: { scenario: EvalScenario; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);

  const handleToggle = () => {
    if (!expanded && !hasExpanded) setHasExpanded(true);
    setExpanded(!expanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-border-subtle last:border-0"
    >
      <button
        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-bg-200 transition-colors text-left cursor-pointer"
        onClick={handleToggle}
      >
        {/* Result icon */}
        <span className={cn('text-sm', scenario.result === 'pass' || scenario.result === 'improvement' ? 'text-green-400' : 'text-semantic-error')}>
          {scenario.result === 'pass' || scenario.result === 'improvement' ? '✓' : '✗'}
        </span>

        {/* Name */}
        <span className="flex-1 text-sm font-medium text-text-primary">{scenario.name}</span>

        {/* Category */}
        <Badge variant="outline" className="text-[10px]">{scenario.category}</Badge>

        {/* Result badge */}
        <Badge variant={scenario.result === 'pass' ? 'success' : scenario.result === 'improvement' ? 'success' : 'error'} className="text-[10px]">
          {getResultLabel(scenario.result)}
        </Badge>

        {/* Expand icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={cn('text-text-tertiary transition-transform duration-200 shrink-0', expanded && 'rotate-180')}
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Input */}
              <div className="bg-bg-300 rounded-lg p-4">
                <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-medium block mb-2">Input</span>
                <p className="text-sm text-text-secondary leading-relaxed">{scenario.input}</p>
              </div>

              {/* Expected */}
              <div className="px-1">
                <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-medium block mb-1.5">Expected Behavior</span>
                <p className="text-xs text-text-tertiary leading-relaxed">{scenario.expectedBehavior}</p>
              </div>

              {/* Side by side outputs */}
              <div className="flex gap-4">
                <AgentOutputPanel
                  label="Current (Production)"
                  output={scenario.currentOutput}
                  animate={false}
                  isPreview={false}
                />
                <AgentOutputPanel
                  label="Preview"
                  output={scenario.previewOutput}
                  animate={hasExpanded}
                  isPreview={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function EvalResults({ scenarios }: { scenarios: EvalScenario[] }) {
  const passed = scenarios.filter(s => s.result === 'pass').length;
  const failed = scenarios.filter(s => s.result === 'fail').length;
  const regressions = scenarios.filter(s => s.result === 'regression').length;
  const improvements = scenarios.filter(s => s.result === 'improvement').length;

  const summaryItems = [
    { label: 'Total', value: scenarios.length, color: 'text-text-primary' },
    { label: 'Passed', value: passed, color: 'text-accent-blue-light' },
    { label: 'Improvements', value: improvements, color: 'text-green-400' },
    { label: 'Regressions', value: regressions, color: 'text-semantic-error' },
    { label: 'Failed', value: failed, color: 'text-semantic-error' },
  ];

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="flex gap-4">
        {summaryItems.map((item) => (
          <Card key={item.label} className="flex-1 text-center !py-4 !px-3">
            <div className={cn('text-xl font-semibold mb-1', item.color)}>{item.value}</div>
            <div className="text-[10px] text-text-tertiary uppercase tracking-wider">{item.label}</div>
          </Card>
        ))}
      </div>

      {/* Scenario list */}
      <div className="border border-border-default rounded-lg overflow-hidden bg-bg-100">
        {scenarios.map((scenario, i) => (
          <EvalRow key={scenario.id} scenario={scenario} index={i} />
        ))}
      </div>
    </div>
  );
}
