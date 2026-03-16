export type PreviewStatus = 'running' | 'passed' | 'failed' | 'pending_review';
export type ChangeType = 'prompt' | 'model' | 'tools' | 'guardrails' | 'routing';
export type EvalResult = 'pass' | 'fail' | 'regression' | 'improvement';
export type ReviewDecision = 'approved' | 'changes_requested' | 'pending';

export interface Agent {
  id: string;
  name: string;
  department: string;
  description: string;
  status: 'active' | 'inactive';
  lastDeployedAt: string;
  pendingPreviews: number;
  model: string;
}

export interface AgentPreview {
  id: string;
  agentId: string;
  agentName: string;
  branchName: string;
  changeTypes: ChangeType[];
  status: PreviewStatus;
  author: TeamMember;
  createdAt: string;
  evalScore: { current: number; preview: number };
  evalScenariosTotal: number;
  evalScenariosPassed: number;
  metrics: MetricsComparison;
  reviewStatus: ReviewDecision;
  reviewers: Reviewer[];
  comments: Comment[];
}

export interface EvalScenario {
  id: string;
  previewId: string;
  name: string;
  category: string;
  input: string;
  expectedBehavior: string;
  currentOutput: AgentOutput;
  previewOutput: AgentOutput;
  result: EvalResult;
}

export interface AgentOutput {
  response: string;
  toolCalls: ToolCall[];
  tokensUsed: number;
  latencyMs: number;
  cost: number;
}

export interface ToolCall {
  name: string;
  input: Record<string, string>;
  output: string;
  durationMs: number;
}

export interface MetricsComparison {
  current: MetricsSnapshot;
  preview: MetricsSnapshot;
}

export interface MetricsSnapshot {
  avgTokens: number;
  avgLatencyMs: number;
  avgCost: number;
  totalEvals: number;
  passRate: number;
  guardrailTriggerRate: number;
  modelBreakdown: { model: string; percentage: number }[];
}

export interface ConfigDiff {
  previewId: string;
  sections: ConfigSection[];
}

export interface ConfigSection {
  title: string;
  type: 'text_diff' | 'json_diff';
  current: string;
  preview: string;
}

export interface TeamMember {
  name: string;
  avatar: string;
  role: string;
}

export interface Reviewer {
  member: TeamMember;
  decision: ReviewDecision;
  reviewedAt?: string;
}

export interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  createdAt: string;
  tab?: string;
}
