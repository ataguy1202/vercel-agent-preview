'use client';

import { cn, computeWordDiff } from '@/lib/utils';

export function WordDiff({
  current,
  preview,
  className,
}: {
  current: string;
  preview: string;
  className?: string;
}) {
  const diff = computeWordDiff(current, preview);

  return (
    <div className={cn('font-mono text-sm leading-relaxed', className)}>
      {diff.map((part, i) => (
        <span
          key={i}
          className={cn(
            part.type === 'removed' && 'bg-semantic-error/20 text-semantic-error line-through',
            part.type === 'added' && 'bg-green-500/20 text-green-400',
            part.type === 'same' && 'text-text-secondary'
          )}
        >
          {part.text}
        </span>
      ))}
    </div>
  );
}

export function CodeDiff({
  current,
  preview,
  className,
}: {
  current: string;
  preview: string;
  className?: string;
}) {
  const currentLines = current.split('\n');
  const previewLines = preview.split('\n');

  // Simple line-by-line diff
  const maxLen = Math.max(currentLines.length, previewLines.length);
  const lines: { type: 'same' | 'removed' | 'added'; text: string; lineNum: number }[] = [];

  // Find common prefix
  let commonPrefix = 0;
  while (commonPrefix < currentLines.length && commonPrefix < previewLines.length &&
    currentLines[commonPrefix] === previewLines[commonPrefix]) {
    lines.push({ type: 'same', text: currentLines[commonPrefix], lineNum: commonPrefix + 1 });
    commonPrefix++;
  }

  // Add removed lines (from current that aren't in preview)
  for (let i = commonPrefix; i < currentLines.length; i++) {
    if (!previewLines.includes(currentLines[i])) {
      lines.push({ type: 'removed', text: currentLines[i], lineNum: i + 1 });
    }
  }

  // Add added lines (from preview that aren't in current)
  for (let i = commonPrefix; i < previewLines.length; i++) {
    if (!currentLines.includes(previewLines[i])) {
      lines.push({ type: 'added', text: previewLines[i], lineNum: i + 1 });
    }
  }

  // Find common suffix
  let ci = currentLines.length - 1;
  let pi = previewLines.length - 1;
  const suffix: { type: 'same'; text: string; lineNum: number }[] = [];
  while (ci > commonPrefix && pi > commonPrefix && currentLines[ci] === previewLines[pi]) {
    suffix.unshift({ type: 'same', text: currentLines[ci], lineNum: Math.max(ci, pi) + 1 });
    ci--; pi--;
  }
  lines.push(...suffix);

  // Deduplicate — just show a clean diff representation
  // Actually let's do a simpler approach: show removed then added with context
  const diffLines: { type: 'same' | 'removed' | 'added'; text: string; num: string }[] = [];
  let cIdx = 0, pIdx = 0;

  while (cIdx < currentLines.length || pIdx < previewLines.length) {
    if (cIdx < currentLines.length && pIdx < previewLines.length && currentLines[cIdx] === previewLines[pIdx]) {
      diffLines.push({ type: 'same', text: currentLines[cIdx], num: `${pIdx + 1}` });
      cIdx++; pIdx++;
    } else {
      // Output removed lines until we find a match
      while (cIdx < currentLines.length && (pIdx >= previewLines.length || currentLines[cIdx] !== previewLines[pIdx])) {
        const matchInPreview = previewLines.indexOf(currentLines[cIdx], pIdx);
        if (matchInPreview !== -1 && matchInPreview - pIdx < 5) {
          // There are added lines before the match
          while (pIdx < matchInPreview) {
            diffLines.push({ type: 'added', text: previewLines[pIdx], num: '+' });
            pIdx++;
          }
          break;
        }
        diffLines.push({ type: 'removed', text: currentLines[cIdx], num: '-' });
        cIdx++;
      }
      // Output added lines
      if (pIdx < previewLines.length && (cIdx >= currentLines.length || currentLines[cIdx] !== previewLines[pIdx])) {
        diffLines.push({ type: 'added', text: previewLines[pIdx], num: '+' });
        pIdx++;
      }
    }
    // Safety valve
    if (diffLines.length > maxLen * 3) break;
  }

  return (
    <div className={cn('font-mono text-xs overflow-x-auto rounded-md border border-border-default', className)}>
      {diffLines.map((line, i) => (
        <div
          key={i}
          className={cn(
            'flex',
            line.type === 'removed' && 'bg-semantic-error/10',
            line.type === 'added' && 'bg-green-500/10',
          )}
        >
          <span className={cn(
            'w-10 shrink-0 text-right pr-2 py-0.5 select-none border-r border-border-subtle',
            line.type === 'same' && 'text-text-tertiary',
            line.type === 'removed' && 'text-semantic-error/60',
            line.type === 'added' && 'text-green-500/60',
          )}>
            {line.num}
          </span>
          <span className={cn(
            'px-3 py-0.5 whitespace-pre flex-1',
            line.type === 'same' && 'text-text-secondary',
            line.type === 'removed' && 'text-semantic-error',
            line.type === 'added' && 'text-green-400',
          )}>
            {line.type === 'removed' && '- '}{line.type === 'added' && '+ '}{line.text}
          </span>
        </div>
      ))}
    </div>
  );
}
