import type { PreviewStatus, ChangeType, EvalResult } from './types';

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function formatCost(cost: number): string {
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

export function formatLatency(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function formatPercentage(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function getStatusColor(status: PreviewStatus): string {
  switch (status) {
    case 'running': return 'text-accent-blue';
    case 'passed': return 'text-semantic-success';
    case 'failed': return 'text-semantic-error';
    case 'pending_review': return 'text-semantic-warning';
  }
}

export function getStatusBg(status: PreviewStatus): string {
  switch (status) {
    case 'running': return 'bg-accent-blue/15 text-accent-blue-light';
    case 'passed': return 'bg-accent-blue/15 text-accent-blue-light';
    case 'failed': return 'bg-semantic-error/15 text-semantic-error';
    case 'pending_review': return 'bg-semantic-warning/15 text-semantic-warning';
  }
}

export function getStatusLabel(status: PreviewStatus): string {
  switch (status) {
    case 'running': return 'Running';
    case 'passed': return 'Passed';
    case 'failed': return 'Failed';
    case 'pending_review': return 'Pending Review';
  }
}

export function getChangeTypeLabel(type: ChangeType): string {
  switch (type) {
    case 'prompt': return 'Prompt';
    case 'model': return 'Model';
    case 'tools': return 'Tools';
    case 'guardrails': return 'Guardrails';
    case 'routing': return 'Routing';
  }
}

export function getResultColor(result: EvalResult): string {
  switch (result) {
    case 'pass': return 'text-accent-blue-light';
    case 'fail': return 'text-semantic-error';
    case 'regression': return 'text-semantic-error';
    case 'improvement': return 'text-green-400';
  }
}

export function getResultBg(result: EvalResult): string {
  switch (result) {
    case 'pass': return 'bg-accent-blue/15 text-accent-blue-light';
    case 'fail': return 'bg-semantic-error/15 text-semantic-error';
    case 'regression': return 'bg-semantic-error/15 text-semantic-error';
    case 'improvement': return 'bg-green-500/15 text-green-400';
  }
}

export function getResultLabel(result: EvalResult): string {
  switch (result) {
    case 'pass': return 'Pass';
    case 'fail': return 'Fail';
    case 'regression': return 'Regression';
    case 'improvement': return 'Improvement';
  }
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-600', 'bg-purple-600', 'bg-pink-600',
    'bg-orange-600', 'bg-teal-600', 'bg-indigo-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function computeWordDiff(current: string, preview: string): { type: 'same' | 'removed' | 'added'; text: string }[] {
  const currentWords = current.split(/(\s+)/);
  const previewWords = preview.split(/(\s+)/);
  const result: { type: 'same' | 'removed' | 'added'; text: string }[] = [];

  // Simple LCS-based word diff
  const m = currentWords.length;
  const n = previewWords.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (currentWords[i - 1] === previewWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack
  const lcs: { ci: number; pi: number }[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (currentWords[i - 1] === previewWords[j - 1]) {
      lcs.unshift({ ci: i - 1, pi: j - 1 });
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  let ci = 0, pi = 0;
  for (const match of lcs) {
    while (ci < match.ci) {
      result.push({ type: 'removed', text: currentWords[ci] });
      ci++;
    }
    while (pi < match.pi) {
      result.push({ type: 'added', text: previewWords[pi] });
      pi++;
    }
    result.push({ type: 'same', text: currentWords[ci] });
    ci++; pi++;
  }
  while (ci < m) {
    result.push({ type: 'removed', text: currentWords[ci] });
    ci++;
  }
  while (pi < n) {
    result.push({ type: 'added', text: previewWords[pi] });
    pi++;
  }

  return result;
}
