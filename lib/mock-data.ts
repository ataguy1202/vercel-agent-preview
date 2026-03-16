import type {
  Agent, AgentPreview, EvalScenario, ConfigDiff, TeamMember, Comment,
} from './types';

// ── Team Members ──────────────────────────────────────────────────────────────

const TEAM: Record<string, TeamMember> = {
  sarah:  { name: 'Sarah Chen',       avatar: 'SC', role: 'ML Engineer' },
  marcus: { name: 'Marcus Johnson',   avatar: 'MJ', role: 'Product Lead' },
  elena:  { name: 'Elena Rodriguez',  avatar: 'ER', role: 'AI Safety' },
  james:  { name: 'James Kim',        avatar: 'JK', role: 'Engineering Manager' },
  priya:  { name: 'Priya Patel',      avatar: 'PP', role: 'Data Scientist' },
};

// ── Agents ────────────────────────────────────────────────────────────────────

const AGENTS: Agent[] = [
  {
    id: 'agent-sales',
    name: 'Sales Qualification Agent',
    department: 'Revenue',
    description: 'Qualifies inbound leads via structured BANT conversation',
    status: 'active',
    lastDeployedAt: '2026-03-12T14:30:00Z',
    pendingPreviews: 1,
    model: 'gpt-4o',
  },
  {
    id: 'agent-hr',
    name: 'HR Onboarding Agent',
    department: 'People Ops',
    description: 'Guides new hires through onboarding checklists and policy questions',
    status: 'active',
    lastDeployedAt: '2026-03-10T09:15:00Z',
    pendingPreviews: 0,
    model: 'claude-3.5-sonnet',
  },
  {
    id: 'agent-support',
    name: 'Customer Support Agent',
    department: 'Support',
    description: 'Handles tier-1 support tickets with PII-safe responses',
    status: 'active',
    lastDeployedAt: '2026-03-13T11:00:00Z',
    pendingPreviews: 1,
    model: 'gpt-4o-mini',
  },
  {
    id: 'agent-codereview',
    name: 'Code Review Agent',
    department: 'Engineering',
    description: 'Reviews pull requests for security vulnerabilities and code quality',
    status: 'active',
    lastDeployedAt: '2026-03-11T16:45:00Z',
    pendingPreviews: 1,
    model: 'claude-3.5-sonnet',
  },
  {
    id: 'agent-datapipeline',
    name: 'Data Pipeline Agent',
    department: 'Data',
    description: 'Orchestrates ETL pipeline jobs with cost-optimized model routing',
    status: 'active',
    lastDeployedAt: '2026-03-09T08:00:00Z',
    pendingPreviews: 0,
    model: 'mixtral-8x7b',
  },
];

// ── Previews ──────────────────────────────────────────────────────────────────

const PREVIEWS: AgentPreview[] = [
  {
    id: 'preview-sales-1',
    agentId: 'agent-sales',
    agentName: 'Sales Qualification Agent',
    branchName: 'sales-agent/update-prompt-v3',
    changeTypes: ['prompt'],
    status: 'pending_review',
    author: TEAM.sarah,
    createdAt: '2026-03-15T10:30:00Z',
    evalScore: { current: 87, preview: 94 },
    evalScenariosTotal: 10,
    evalScenariosPassed: 9,
    metrics: {
      current: {
        avgTokens: 1847, avgLatencyMs: 1240, avgCost: 0.0034,
        totalEvals: 10, passRate: 87, guardrailTriggerRate: 2.1,
        modelBreakdown: [{ model: 'gpt-4o', percentage: 100 }],
      },
      preview: {
        avgTokens: 1523, avgLatencyMs: 980, avgCost: 0.0028,
        totalEvals: 10, passRate: 94, guardrailTriggerRate: 1.8,
        modelBreakdown: [{ model: 'gpt-4o', percentage: 100 }],
      },
    },
    reviewStatus: 'pending',
    reviewers: [
      { member: TEAM.marcus, decision: 'approved', reviewedAt: '2026-03-15T11:15:00Z' },
      { member: TEAM.elena, decision: 'pending' },
    ],
    comments: [
      {
        id: 'c1', author: TEAM.marcus, createdAt: '2026-03-15T11:15:00Z',
        content: 'The qualification scoring looks much tighter. I like how it exits early on budget disqualification. Approve from product side.',
        tab: 'eval',
      },
      {
        id: 'c2', author: TEAM.sarah, createdAt: '2026-03-15T11:30:00Z',
        content: '@elena can you review the tone on scenario 7? Want to make sure we\'re not being too aggressive with SMB leads.',
        tab: 'eval',
      },
      {
        id: 'c3', author: TEAM.elena, createdAt: '2026-03-15T12:00:00Z',
        content: 'Looking at this now. The BANT scoring is solid but I want to check the guardrail trigger rates before approving.',
      },
    ],
  },
  {
    id: 'preview-hr-1',
    agentId: 'agent-hr',
    agentName: 'HR Onboarding Agent',
    branchName: 'hr-agent/add-hris-tool',
    changeTypes: ['tools', 'model'],
    status: 'passed',
    author: TEAM.james,
    createdAt: '2026-03-14T15:00:00Z',
    evalScore: { current: 91, preview: 96 },
    evalScenariosTotal: 12,
    evalScenariosPassed: 12,
    metrics: {
      current: {
        avgTokens: 2100, avgLatencyMs: 1800, avgCost: 0.0042,
        totalEvals: 12, passRate: 91, guardrailTriggerRate: 0.5,
        modelBreakdown: [{ model: 'gpt-4o', percentage: 100 }],
      },
      preview: {
        avgTokens: 1680, avgLatencyMs: 1200, avgCost: 0.0025,
        totalEvals: 12, passRate: 96, guardrailTriggerRate: 0.3,
        modelBreakdown: [{ model: 'claude-3.5-sonnet', percentage: 100 }],
      },
    },
    reviewStatus: 'approved',
    reviewers: [
      { member: TEAM.marcus, decision: 'approved', reviewedAt: '2026-03-14T16:00:00Z' },
      { member: TEAM.priya, decision: 'approved', reviewedAt: '2026-03-14T16:30:00Z' },
    ],
    comments: [
      {
        id: 'c4', author: TEAM.marcus, createdAt: '2026-03-14T16:00:00Z',
        content: 'BambooHR integration looks clean. The model switch to Claude cut latency by 33% — nice win.',
      },
      {
        id: 'c5', author: TEAM.priya, createdAt: '2026-03-14T16:30:00Z',
        content: 'All 12 scenarios passing. Cost per interaction dropped 40%. Ship it.',
      },
    ],
  },
  {
    id: 'preview-support-1',
    agentId: 'agent-support',
    agentName: 'Customer Support Agent',
    branchName: 'support-agent/pii-guardrails-v2',
    changeTypes: ['guardrails'],
    status: 'failed',
    author: TEAM.elena,
    createdAt: '2026-03-15T08:00:00Z',
    evalScore: { current: 95, preview: 88 },
    evalScenariosTotal: 10,
    evalScenariosPassed: 7,
    metrics: {
      current: {
        avgTokens: 1200, avgLatencyMs: 650, avgCost: 0.0008,
        totalEvals: 10, passRate: 95, guardrailTriggerRate: 3.2,
        modelBreakdown: [{ model: 'gpt-4o-mini', percentage: 100 }],
      },
      preview: {
        avgTokens: 1350, avgLatencyMs: 720, avgCost: 0.0009,
        totalEvals: 10, passRate: 88, guardrailTriggerRate: 12.5,
        modelBreakdown: [{ model: 'gpt-4o-mini', percentage: 100 }],
      },
    },
    reviewStatus: 'changes_requested',
    reviewers: [
      { member: TEAM.james, decision: 'changes_requested', reviewedAt: '2026-03-15T09:30:00Z' },
    ],
    comments: [
      {
        id: 'c6', author: TEAM.james, createdAt: '2026-03-15T09:30:00Z',
        content: 'The PII redaction is too aggressive — it\'s redacting product names that look like email addresses (e.g., "connect@pro"). 3 regressions. Needs refinement before deploy.',
        tab: 'eval',
      },
      {
        id: 'c7', author: TEAM.elena, createdAt: '2026-03-15T10:00:00Z',
        content: 'Good catch. I\'ll update the regex patterns to whitelist our product names. Will push a v3.',
      },
    ],
  },
  {
    id: 'preview-codereview-1',
    agentId: 'agent-codereview',
    agentName: 'Code Review Agent',
    branchName: 'code-review/security-prompt',
    changeTypes: ['prompt'],
    status: 'running',
    author: TEAM.priya,
    createdAt: '2026-03-15T13:00:00Z',
    evalScore: { current: 92, preview: 0 },
    evalScenariosTotal: 8,
    evalScenariosPassed: 5,
    metrics: {
      current: {
        avgTokens: 3200, avgLatencyMs: 2100, avgCost: 0.0064,
        totalEvals: 8, passRate: 92, guardrailTriggerRate: 0.8,
        modelBreakdown: [{ model: 'claude-3.5-sonnet', percentage: 100 }],
      },
      preview: {
        avgTokens: 3500, avgLatencyMs: 2300, avgCost: 0.0070,
        totalEvals: 5, passRate: 100, guardrailTriggerRate: 0.5,
        modelBreakdown: [{ model: 'claude-3.5-sonnet', percentage: 100 }],
      },
    },
    reviewStatus: 'pending',
    reviewers: [
      { member: TEAM.james, decision: 'pending' },
    ],
    comments: [
      {
        id: 'c8', author: TEAM.priya, createdAt: '2026-03-15T13:05:00Z',
        content: 'Running evals now. Added specific SQL injection and XSS detection patterns to the system prompt. 5/8 complete so far — all passing.',
      },
    ],
  },
  {
    id: 'preview-datapipeline-1',
    agentId: 'agent-datapipeline',
    agentName: 'Data Pipeline Agent',
    branchName: 'data-pipeline/cost-opt-routing',
    changeTypes: ['routing'],
    status: 'passed',
    author: TEAM.priya,
    createdAt: '2026-03-13T10:00:00Z',
    evalScore: { current: 89, preview: 91 },
    evalScenariosTotal: 10,
    evalScenariosPassed: 9,
    metrics: {
      current: {
        avgTokens: 2800, avgLatencyMs: 1500, avgCost: 0.0056,
        totalEvals: 10, passRate: 89, guardrailTriggerRate: 1.0,
        modelBreakdown: [{ model: 'gpt-4o', percentage: 100 }],
      },
      preview: {
        avgTokens: 2200, avgLatencyMs: 900, avgCost: 0.0019,
        totalEvals: 10, passRate: 91, guardrailTriggerRate: 0.8,
        modelBreakdown: [
          { model: 'mixtral-8x7b', percentage: 65 },
          { model: 'gpt-4o', percentage: 35 },
        ],
      },
    },
    reviewStatus: 'approved',
    reviewers: [
      { member: TEAM.james, decision: 'approved', reviewedAt: '2026-03-13T12:00:00Z' },
      { member: TEAM.sarah, decision: 'approved', reviewedAt: '2026-03-13T12:30:00Z' },
    ],
    comments: [
      {
        id: 'c9', author: TEAM.james, createdAt: '2026-03-13T12:00:00Z',
        content: 'Routing simple classification tasks to Mixtral cuts cost by 66%. Quality maintained across all scenarios. Great optimization.',
      },
      {
        id: 'c10', author: TEAM.sarah, createdAt: '2026-03-13T12:30:00Z',
        content: 'Confirmed — the complex ETL orchestration tasks still route to GPT-4o. Mixtral handles schema validation and basic transforms well. Approved.',
      },
    ],
  },
];

// ── Eval Scenarios ────────────────────────────────────────────────────────────

const EVAL_SCENARIOS: EvalScenario[] = [
  // ── Sales Agent Scenarios ──
  {
    id: 'eval-s1', previewId: 'preview-sales-1', name: 'Enterprise lead with budget authority',
    category: 'Qualification',
    input: 'Hi, I\'m VP of Engineering at Acme Corp (2,000 employees). We\'re looking to modernize our deployment pipeline. We have budget allocated for Q2 and need a solution by June.',
    expectedBehavior: 'Agent should identify BANT signals (Budget: allocated, Authority: VP, Need: deployment pipeline, Timeline: June) and score as high-priority.',
    currentOutput: {
      response: 'Thanks for reaching out! I\'d love to learn more about your deployment needs. Can you tell me a bit about your current setup? What tools are you using today, and what challenges are you facing?',
      toolCalls: [
        { name: 'lookup_company', input: { domain: 'acme.com' }, output: '{"employees": 2000, "industry": "Technology", "revenue": "$500M"}', durationMs: 120 },
      ],
      tokensUsed: 1650, latencyMs: 1100, cost: 0.0031,
    },
    previewOutput: {
      response: 'Welcome! I can see Acme Corp is a great fit for our enterprise tier. Since you have budget allocated for Q2 and need deployment by June, let me fast-track this. I\'ve pulled up your company profile — with 2,000 engineers, you\'d benefit most from our Enterprise plan with custom deployment pipelines. Can I schedule a technical deep-dive with your team this week?',
      toolCalls: [
        { name: 'lookup_company', input: { domain: 'acme.com' }, output: '{"employees": 2000, "industry": "Technology", "revenue": "$500M"}', durationMs: 115 },
        { name: 'check_crm', input: { company: 'Acme Corp' }, output: '{"existing_contact": false, "territory": "West"}', durationMs: 89 },
        { name: 'score_lead', input: { budget: 'yes', authority: 'vp', need: 'high', timeline: 'q2' }, output: '{"score": 92, "priority": "high"}', durationMs: 45 },
      ],
      tokensUsed: 1420, latencyMs: 950, cost: 0.0027,
    },
    result: 'improvement',
  },
  {
    id: 'eval-s2', previewId: 'preview-sales-1', name: 'Small startup without budget',
    category: 'Disqualification',
    input: 'Hey, I\'m a solo founder building a side project. Just exploring options. Don\'t really have budget right now but maybe in 6 months.',
    expectedBehavior: 'Agent should efficiently disqualify while maintaining positive relationship. Should not spend multiple turns qualifying.',
    currentOutput: {
      response: 'Great to meet you! Tell me more about your project. What are you building, and what stage are you at? We have options for teams of all sizes.',
      toolCalls: [],
      tokensUsed: 1890, latencyMs: 1350, cost: 0.0036,
    },
    previewOutput: {
      response: 'Welcome! For a side project without immediate budget, I\'d recommend starting with our free Hobby tier — it\'s perfect for solo developers. You get automatic deployments, preview URLs, and generous bandwidth. When you\'re ready to scale, our Pro plan starts at $20/mo. Here\'s a quick-start guide: vercel.com/docs/getting-started. Anything specific I can help with?',
      toolCalls: [
        { name: 'score_lead', input: { budget: 'no', authority: 'founder', need: 'low', timeline: 'none' }, output: '{"score": 15, "priority": "low", "recommendation": "self-serve"}', durationMs: 42 },
      ],
      tokensUsed: 1100, latencyMs: 780, cost: 0.0021,
    },
    result: 'improvement',
  },
  {
    id: 'eval-s3', previewId: 'preview-sales-1', name: 'Competitor mention handling',
    category: 'Objection Handling',
    input: 'We\'re currently evaluating Netlify and AWS Amplify. What makes you different? Honestly Netlify seems cheaper.',
    expectedBehavior: 'Agent should acknowledge competitors respectfully, differentiate on value (not price), and pivot to specific pain points.',
    currentOutput: {
      response: 'Great question! We offer a comprehensive platform that goes beyond just hosting. Our edge network is one of the fastest, and we have deep integrations with Next.js, React, and other modern frameworks. Would you like to see a comparison?',
      toolCalls: [],
      tokensUsed: 1700, latencyMs: 1200, cost: 0.0032,
    },
    previewOutput: {
      response: 'Fair comparison — both are solid platforms. Where Vercel differentiates: our Edge Network serves from 18+ regions with automatic ISR, our Preview Deployments give every PR a live URL your team can review, and our AI-native infrastructure (AI SDK, AI Gateway) is purpose-built for the workloads most teams are investing in now. For enterprise teams, the DX improvements typically save 20% on deploy cycles. What\'s the primary workload you\'re deploying?',
      toolCalls: [
        { name: 'lookup_company', input: { domain: 'unknown' }, output: '{"employees": null, "industry": null}', durationMs: 110 },
      ],
      tokensUsed: 1580, latencyMs: 1050, cost: 0.0030,
    },
    result: 'improvement',
  },
  {
    id: 'eval-s4', previewId: 'preview-sales-1', name: 'Technical decision maker',
    category: 'Qualification',
    input: 'I\'m the CTO at FinanceFlow. We process 10M API requests/day and need SOC2 compliance. Currently on AWS but our frontend team wants better DX. Budget isn\'t an issue.',
    expectedBehavior: 'Agent should identify as top-priority enterprise lead and fast-track to demo.',
    currentOutput: {
      response: 'That sounds like an interesting use case! SOC2 compliance is definitely something we support. Can you tell me more about your current architecture? What frameworks is your frontend team using?',
      toolCalls: [
        { name: 'lookup_company', input: { domain: 'financeflow.com' }, output: '{"employees": 500, "industry": "Fintech", "revenue": "$120M"}', durationMs: 130 },
      ],
      tokensUsed: 2100, latencyMs: 1400, cost: 0.0040,
    },
    previewOutput: {
      response: 'FinanceFlow — great to connect. With 10M daily requests and SOC2 requirements, you\'re exactly who our Enterprise tier is built for. Quick BANT summary: ✓ Budget confirmed, ✓ CTO authority, ✓ Clear need (DX + compliance), ✓ Active evaluation. I\'m flagging this as priority. Our Enterprise plan includes SOC2 compliance, dedicated support, 99.99% SLA, and managed WAF. I\'d like to get you a 30-min technical deep-dive with our Solutions Engineering team this week. What works for your calendar?',
      toolCalls: [
        { name: 'lookup_company', input: { domain: 'financeflow.com' }, output: '{"employees": 500, "industry": "Fintech", "revenue": "$120M"}', durationMs: 125 },
        { name: 'check_crm', input: { company: 'FinanceFlow' }, output: '{"existing_contact": false, "territory": "East"}', durationMs: 92 },
        { name: 'score_lead', input: { budget: 'yes', authority: 'cto', need: 'high', timeline: 'active' }, output: '{"score": 98, "priority": "critical"}', durationMs: 38 },
        { name: 'schedule_demo', input: { priority: 'critical', type: 'enterprise' }, output: '{"available_slots": ["Tue 2pm", "Wed 10am", "Thu 3pm"]}', durationMs: 67 },
      ],
      tokensUsed: 1380, latencyMs: 920, cost: 0.0026,
    },
    result: 'improvement',
  },
  {
    id: 'eval-s5', previewId: 'preview-sales-1', name: 'Vague inquiry with no signals',
    category: 'Discovery',
    input: 'Just looking around. What do you guys do?',
    expectedBehavior: 'Agent should provide concise value prop and ask 1-2 discovery questions to qualify.',
    currentOutput: {
      response: 'Welcome! Vercel is a cloud platform for frontend development. We help teams build, deploy, and scale web applications. We support frameworks like Next.js, React, Svelte, and more. What kind of project are you working on?',
      toolCalls: [],
      tokensUsed: 1500, latencyMs: 1100, cost: 0.0029,
    },
    previewOutput: {
      response: 'Vercel is the platform behind Next.js — we help teams ship web applications faster with instant deployments, preview URLs, and AI-native infrastructure. Quick question: are you evaluating for a team or personal project? That\'ll help me point you to the right resources.',
      toolCalls: [],
      tokensUsed: 1200, latencyMs: 850, cost: 0.0023,
    },
    result: 'improvement',
  },
  {
    id: 'eval-s6', previewId: 'preview-sales-1', name: 'Pricing pushback',
    category: 'Objection Handling',
    input: 'Your Enterprise plan seems expensive. $3,000/month is a lot. We\'re a 50-person startup.',
    expectedBehavior: 'Agent should validate concern, explore actual needs, and potentially recommend Pro plan instead.',
    currentOutput: {
      response: 'I understand the concern about pricing. Our Enterprise plan includes many features that larger organizations need. Let me walk you through what\'s included and we can find the right fit for your team.',
      toolCalls: [],
      tokensUsed: 1800, latencyMs: 1300, cost: 0.0034,
    },
    previewOutput: {
      response: 'Totally valid concern for a 50-person team. Honestly, you may not need Enterprise yet. Our Pro plan at $20/user/mo gives you most of what growing teams need — preview deployments, analytics, and priority support. Enterprise makes sense when you need SSO, audit logs, and SLAs. What specific capabilities are driving your evaluation?',
      toolCalls: [
        { name: 'score_lead', input: { budget: 'constrained', authority: 'unknown', need: 'medium', timeline: 'unknown' }, output: '{"score": 45, "priority": "medium", "recommendation": "pro_plan"}', durationMs: 41 },
      ],
      tokensUsed: 1300, latencyMs: 900, cost: 0.0025,
    },
    result: 'improvement',
  },
  {
    id: 'eval-s7', previewId: 'preview-sales-1', name: 'Aggressive tone check',
    category: 'Tone',
    input: 'I manage a small agency. We build sites for clients. Maybe 5-10 projects at a time. Looking for something easy.',
    expectedBehavior: 'Agent should be helpful and consultative, not pushy. Should recommend appropriate tier.',
    currentOutput: {
      response: 'Agencies are a great fit for Vercel! We have many agencies using our platform to manage multiple client projects. Tell me more about your tech stack — are you using React or Next.js?',
      toolCalls: [],
      tokensUsed: 1600, latencyMs: 1150, cost: 0.0030,
    },
    previewOutput: {
      response: 'Agencies love Vercel — the project-based structure maps well to client work. For 5-10 concurrent projects, our Pro plan with team seats would be ideal. Each client project gets its own deployment, preview URLs for client review, and you can transfer projects when you hand off. Want me to set up a trial workspace for your team?',
      toolCalls: [
        { name: 'score_lead', input: { budget: 'unknown', authority: 'manager', need: 'medium', timeline: 'unknown' }, output: '{"score": 55, "priority": "medium"}', durationMs: 40 },
      ],
      tokensUsed: 1250, latencyMs: 870, cost: 0.0024,
    },
    result: 'pass',
  },
  {
    id: 'eval-s8', previewId: 'preview-sales-1', name: 'Non-English speaker',
    category: 'Edge Case',
    input: 'Hola, estoy buscando una plataforma para mi equipo de desarrollo. Somos 200 personas.',
    expectedBehavior: 'Agent should respond in the user\'s language and qualify appropriately.',
    currentOutput: {
      response: 'Hello! I can help you find the right solution for your team. Could you tell me more about what you\'re looking for? I\'m happy to assist in English.',
      toolCalls: [],
      tokensUsed: 1900, latencyMs: 1400, cost: 0.0036,
    },
    previewOutput: {
      response: '¡Hola! Con un equipo de 200 desarrolladores, Vercel Enterprise sería una excelente opción. Incluye SSO, control de acceso por equipos, y soporte dedicado. ¿Le gustaría programar una demostración con nuestro equipo de soluciones? Tenemos representantes que hablan español.',
      toolCalls: [
        { name: 'score_lead', input: { budget: 'unknown', authority: 'unknown', need: 'high', timeline: 'unknown' }, output: '{"score": 70, "priority": "high"}', durationMs: 43 },
      ],
      tokensUsed: 1350, latencyMs: 950, cost: 0.0026,
    },
    result: 'improvement',
  },
  {
    id: 'eval-s9', previewId: 'preview-sales-1', name: 'Already a customer',
    category: 'Upsell',
    input: 'We\'re on the Pro plan already. 30 developers. Thinking about upgrading to Enterprise for the SSO integration.',
    expectedBehavior: 'Agent should recognize upsell opportunity and connect to account team.',
    currentOutput: {
      response: 'Great to hear you\'re already on Pro! Enterprise does include SSO along with many other features. I can help connect you with our sales team to discuss the upgrade. Would you like me to do that?',
      toolCalls: [],
      tokensUsed: 1700, latencyMs: 1250, cost: 0.0032,
    },
    previewOutput: {
      response: 'Excellent — upgrading from Pro to Enterprise with 30 developers is a common move. Beyond SSO, you\'d also get audit logs, advanced RBAC, and a dedicated CSM. Based on your Pro usage, I\'m estimating the upgrade at roughly $2,100/mo additional. Want me to connect you directly with your account manager for a custom quote?',
      toolCalls: [
        { name: 'check_crm', input: { company: 'current_customer' }, output: '{"plan": "pro", "seats": 30, "mrr": "$600", "account_manager": "Lisa Wong"}', durationMs: 85 },
        { name: 'score_lead', input: { budget: 'likely', authority: 'unknown', need: 'specific', timeline: 'active' }, output: '{"score": 82, "priority": "high", "type": "upsell"}', durationMs: 39 },
      ],
      tokensUsed: 1280, latencyMs: 890, cost: 0.0024,
    },
    result: 'improvement',
  },
  {
    id: 'eval-s10', previewId: 'preview-sales-1', name: 'Security-focused inquiry',
    category: 'Compliance',
    input: 'We\'re in healthcare. Need HIPAA compliance. Is that possible with Vercel?',
    expectedBehavior: 'Agent should accurately represent HIPAA capabilities and not overstate compliance.',
    currentOutput: {
      response: 'Yes, we do support HIPAA compliance on our Enterprise plan. This includes a BAA (Business Associate Agreement) and the necessary security controls. Would you like to discuss the specific requirements for your use case?',
      toolCalls: [],
      tokensUsed: 1800, latencyMs: 1300, cost: 0.0034,
    },
    previewOutput: {
      response: 'Yes — Vercel Enterprise supports HIPAA compliance with a signed BAA. Important caveats: the BAA covers our infrastructure and deployment platform, but you\'re responsible for ensuring your application code handles PHI correctly. We provide Enterprise-grade controls: SOC2 Type II, data encryption at rest and in transit, audit logs, and IP allowlisting. For healthcare specifically, I\'d recommend a compliance review with our Solutions team. Can I set that up?',
      toolCalls: [
        { name: 'score_lead', input: { budget: 'likely', authority: 'unknown', need: 'high', timeline: 'unknown' }, output: '{"score": 75, "priority": "high"}', durationMs: 44 },
      ],
      tokensUsed: 1450, latencyMs: 980, cost: 0.0028,
    },
    result: 'pass',
  },
  // ── HR Agent Scenarios ──
  {
    id: 'eval-h1', previewId: 'preview-hr-1', name: 'First day checklist request',
    category: 'Onboarding',
    input: 'It\'s my first day! What do I need to do?',
    expectedBehavior: 'Agent should pull onboarding checklist from HRIS and provide personalized first-day guide.',
    currentOutput: {
      response: 'Welcome aboard! Here\'s your first-day checklist:\n1. Set up your email and Slack\n2. Complete your I-9 form\n3. Review the employee handbook\n4. Meet your manager for a welcome chat\n5. Set up your development environment\nLet me know if you need help with any of these!',
      toolCalls: [],
      tokensUsed: 2200, latencyMs: 1900, cost: 0.0044,
    },
    previewOutput: {
      response: 'Welcome to the team! I\'ve pulled your personalized onboarding checklist from BambooHR:\n\n✅ Email & Slack — already provisioned (check your personal email)\n⬜ I-9 verification — due by end of day (HR office, Room 204)\n⬜ Benefits enrollment — due within 30 days\n⬜ 1:1 with your manager Sarah Chen — scheduled for 2pm today\n⬜ Dev environment setup — your team uses the standard stack guide\n\nYou\'re in Engineering on the Platform team. Your buddy is James Kim — he\'ll ping you on Slack shortly. Need help with anything specific?',
      toolCalls: [
        { name: 'bamboohr_lookup', input: { query: 'new_hire_checklist', employee: 'current' }, output: '{"department": "Engineering", "team": "Platform", "manager": "Sarah Chen", "buddy": "James Kim", "start_date": "2026-03-15"}', durationMs: 180 },
        { name: 'bamboohr_tasks', input: { employee: 'current', type: 'onboarding' }, output: '{"completed": ["email_setup", "slack_setup"], "pending": ["i9", "benefits", "manager_1on1", "dev_setup"]}', durationMs: 145 },
      ],
      tokensUsed: 1650, latencyMs: 1150, cost: 0.0024,
    },
    result: 'improvement',
  },
  {
    id: 'eval-h2', previewId: 'preview-hr-1', name: 'PTO policy question',
    category: 'Policy',
    input: 'How many vacation days do I get? Can I take time off during my first month?',
    expectedBehavior: 'Agent should provide accurate PTO policy from HRIS, including probation period rules.',
    currentOutput: {
      response: 'Our PTO policy provides 20 days of paid time off per year, plus company holidays. During your first 90 days, we recommend coordinating any time off with your manager in advance. You can find the full policy in the employee handbook.',
      toolCalls: [],
      tokensUsed: 2000, latencyMs: 1700, cost: 0.0040,
    },
    previewOutput: {
      response: 'Based on your offer details:\n\n• **PTO**: 20 days/year (accrued at 1.67 days/month)\n• **First month**: You can take PTO, but it accrues from your start date — you\'ll have ~1.5 days available by end of March\n• **Holidays**: 11 company holidays (next one: Memorial Day, May 25)\n• **Sick days**: Unlimited, no accrual needed\n\nPro tip: PTO requests go through BambooHR → Time Off → Request. Your manager auto-approves requests under 3 days. Need anything else?',
      toolCalls: [
        { name: 'bamboohr_lookup', input: { query: 'pto_policy', employee: 'current' }, output: '{"annual_pto": 20, "accrual_rate": 1.67, "sick_days": "unlimited", "probation_pto": true}', durationMs: 160 },
      ],
      tokensUsed: 1500, latencyMs: 1100, cost: 0.0022,
    },
    result: 'improvement',
  },
  // ── Support Agent Scenarios ──
  {
    id: 'eval-sup1', previewId: 'preview-support-1', name: 'Normal support request',
    category: 'Tier 1',
    input: 'My deployment is failing with error code 502. Build logs show "Module not found: canvas". Help!',
    expectedBehavior: 'Agent should diagnose common deployment error and provide fix steps.',
    currentOutput: {
      response: 'The "Module not found: canvas" error typically occurs because the `canvas` package requires native binaries that aren\'t available in our serverless environment. Here\'s how to fix it:\n\n1. Add `canvas` to your `serverExternalPackages` in next.config.js\n2. Or use `@napi-rs/canvas` as a drop-in replacement designed for serverless\n3. If you only need canvas on the client side, use dynamic imports with `ssr: false`\n\nWhich approach works best for your use case?',
      toolCalls: [
        { name: 'search_docs', input: { query: 'canvas module not found 502' }, output: '{"articles": ["serverless-native-modules", "canvas-alternative"]}', durationMs: 95 },
      ],
      tokensUsed: 1100, latencyMs: 600, cost: 0.0007,
    },
    previewOutput: {
      response: 'The "Module not found: canvas" error typically occurs because the `canvas` package requires native binaries that aren\'t available in our serverless environment. Here\'s how to fix it:\n\n1. Add `canvas` to your `serverExternalPackages` in next.config.js\n2. Or use `@napi-rs/canvas` as a drop-in replacement designed for serverless\n3. If you only need canvas on the client side, use dynamic imports with `ssr: false`\n\nWhich approach works best for your use case?',
      toolCalls: [
        { name: 'search_docs', input: { query: 'canvas module not found 502' }, output: '{"articles": ["serverless-native-modules", "canvas-alternative"]}', durationMs: 98 },
      ],
      tokensUsed: 1150, latencyMs: 620, cost: 0.0008,
    },
    result: 'pass',
  },
  {
    id: 'eval-sup2', previewId: 'preview-support-1', name: 'PII in ticket - email address',
    category: 'PII Handling',
    input: 'I can\'t log in to my account. My email is john.smith@acmecorp.com and I keep getting "invalid credentials" error.',
    expectedBehavior: 'Agent should help with login issue while properly redacting email in logs but still referencing it in response.',
    currentOutput: {
      response: 'I can help with your login issue. I\'ve looked up the account associated with j***.s****@acmecorp.com. It appears your account may need a password reset. I\'ve sent a reset link to your email. Please check your inbox and spam folder.',
      toolCalls: [
        { name: 'lookup_account', input: { email: '[REDACTED]' }, output: '{"status": "active", "last_login": "2026-03-10"}', durationMs: 110 },
      ],
      tokensUsed: 1250, latencyMs: 680, cost: 0.0008,
    },
    previewOutput: {
      response: 'I can help with your login issue. I\'ve looked up the account associated with [REDACTED]. It appears [REDACTED] may need a [REDACTED]. I\'ve sent a [REDACTED] to your [REDACTED]. Please check your [REDACTED] and [REDACTED] folder.',
      toolCalls: [
        { name: 'lookup_account', input: { email: '[REDACTED]' }, output: '{"status": "active", "last_login": "[REDACTED]"}', durationMs: 125 },
      ],
      tokensUsed: 1400, latencyMs: 750, cost: 0.0009,
    },
    result: 'regression',
  },
  {
    id: 'eval-sup3', previewId: 'preview-support-1', name: 'Product name false positive',
    category: 'PII Handling',
    input: 'How do I set up connect@pro for my team\'s deployment workflow?',
    expectedBehavior: 'Agent should recognize "connect@pro" as a product name, not an email address, and NOT redact it.',
    currentOutput: {
      response: 'Connect@Pro is our team collaboration feature for deployment workflows. Here\'s how to set it up:\n\n1. Go to your Team Settings → Integrations\n2. Enable Connect@Pro\n3. Invite team members via their Vercel accounts\n4. Configure notification preferences\n\nWould you like a walkthrough of the advanced settings?',
      toolCalls: [
        { name: 'search_docs', input: { query: 'connect@pro setup' }, output: '{"articles": ["connect-pro-setup-guide"]}', durationMs: 88 },
      ],
      tokensUsed: 1100, latencyMs: 600, cost: 0.0007,
    },
    previewOutput: {
      response: '[REDACTED] is our team collaboration feature for deployment workflows. Here\'s how to set it up:\n\n1. Go to your Team Settings → Integrations\n2. Enable [REDACTED]\n3. Invite team members via their Vercel accounts\n\nWould you like a walkthrough?',
      toolCalls: [
        { name: 'search_docs', input: { query: '[REDACTED] setup' }, output: '{"articles": []}', durationMs: 92 },
      ],
      tokensUsed: 1300, latencyMs: 710, cost: 0.0009,
    },
    result: 'regression',
  },
  {
    id: 'eval-sup4', previewId: 'preview-support-1', name: 'Billing inquiry with account number',
    category: 'PII Handling',
    input: 'I was charged twice this month. Account #VCL-28491. Can you check?',
    expectedBehavior: 'Agent should handle billing query while appropriately redacting account number in logs only.',
    currentOutput: {
      response: 'I\'m sorry about the double charge. I\'ve looked up account #V**-28491 and can confirm there were two charges on March 1st and March 8th. The March 8th charge appears to be a duplicate. I\'ve initiated a refund for $20.00 — it should appear within 5-7 business days. Is there anything else I can help with?',
      toolCalls: [
        { name: 'lookup_billing', input: { account: '[REDACTED]' }, output: '{"charges": [{"date": "2026-03-01", "amount": 20}, {"date": "2026-03-08", "amount": 20, "duplicate": true}]}', durationMs: 130 },
      ],
      tokensUsed: 1300, latencyMs: 700, cost: 0.0009,
    },
    previewOutput: {
      response: 'I\'m sorry about the double charge. I\'ve looked up account #[REDACTED] and can confirm there were two charges on [REDACTED] and [REDACTED]. The second charge appears to be a duplicate. I\'ve initiated a refund — it should appear within [REDACTED] business days.',
      toolCalls: [
        { name: 'lookup_billing', input: { account: '[REDACTED]' }, output: '{"charges": "[REDACTED]"}', durationMs: 140 },
      ],
      tokensUsed: 1400, latencyMs: 760, cost: 0.0009,
    },
    result: 'regression',
  },
  // ── Code Review Agent Scenarios ──
  {
    id: 'eval-cr1', previewId: 'preview-codereview-1', name: 'SQL injection in API route',
    category: 'Security',
    input: 'Review this Next.js API route:\n```\nexport async function GET(req) {\n  const id = req.nextUrl.searchParams.get("id");\n  const result = await db.query(`SELECT * FROM users WHERE id = ${id}`);\n  return Response.json(result);\n}\n```',
    expectedBehavior: 'Agent should identify SQL injection vulnerability and suggest parameterized query.',
    currentOutput: {
      response: '**Security Issue Found**: This code is vulnerable to SQL injection.\n\nThe user-supplied `id` parameter is directly interpolated into the SQL query string without sanitization. An attacker could pass `1 OR 1=1` to dump the entire users table.\n\n**Fix**: Use parameterized queries:\n```ts\nconst result = await db.query("SELECT * FROM users WHERE id = $1", [id]);\n```',
      toolCalls: [
        { name: 'analyze_code', input: { type: 'security_scan' }, output: '{"vulnerabilities": ["sql_injection"], "severity": "critical"}', durationMs: 320 },
      ],
      tokensUsed: 3000, latencyMs: 2000, cost: 0.0060,
    },
    previewOutput: {
      response: '🔴 **CRITICAL: SQL Injection Vulnerability**\n\n**Location**: Line 3 — `db.query(\\`SELECT * FROM users WHERE id = ${id}\\`)`\n\n**Risk**: User-controlled input directly concatenated into SQL. Attacker payload `1; DROP TABLE users--` would destroy data.\n\n**Fix** (parameterized query):\n```ts\nconst result = await db.query("SELECT * FROM users WHERE id = $1", [id]);\n```\n\n**Additional recommendations**:\n1. Add input validation: `if (!id || isNaN(Number(id))) return Response.json({ error: "Invalid ID" }, { status: 400 });`\n2. Use an ORM (Prisma/Drizzle) to prevent raw SQL entirely\n3. Add rate limiting to this endpoint\n\n**OWASP Reference**: A03:2021 — Injection',
      toolCalls: [
        { name: 'analyze_code', input: { type: 'security_scan' }, output: '{"vulnerabilities": ["sql_injection"], "severity": "critical", "owasp": "A03:2021"}', durationMs: 310 },
        { name: 'check_patterns', input: { pattern: 'sql_injection' }, output: '{"remediation": "parameterized_query", "examples": 3}', durationMs: 95 },
      ],
      tokensUsed: 3400, latencyMs: 2200, cost: 0.0068,
    },
    result: 'improvement',
  },
  {
    id: 'eval-cr2', previewId: 'preview-codereview-1', name: 'XSS in React component',
    category: 'Security',
    input: 'Review this component:\n```\nexport function Comment({ html }) {\n  return <div dangerouslySetInnerHTML={{ __html: html }} />;\n}\n```',
    expectedBehavior: 'Agent should flag XSS risk with dangerouslySetInnerHTML and suggest DOMPurify.',
    currentOutput: {
      response: '**Warning**: Using `dangerouslySetInnerHTML` with unsanitized content is an XSS risk.\n\n**Fix**: Sanitize the HTML before rendering:\n```ts\nimport DOMPurify from "dompurify";\n<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />\n```',
      toolCalls: [
        { name: 'analyze_code', input: { type: 'security_scan' }, output: '{"vulnerabilities": ["xss"], "severity": "high"}', durationMs: 280 },
      ],
      tokensUsed: 2800, latencyMs: 1900, cost: 0.0056,
    },
    previewOutput: {
      response: '🟠 **HIGH: Cross-Site Scripting (XSS) Vulnerability**\n\n**Location**: `dangerouslySetInnerHTML={{ __html: html }}`\n\n**Risk**: If `html` prop contains user-generated content, attackers can inject `<script>` tags to steal sessions, redirect users, or deface the page.\n\n**Fix** (sanitize with DOMPurify):\n```ts\nimport DOMPurify from "dompurify";\n\nexport function Comment({ html }: { html: string }) {\n  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;\n}\n```\n\n**Better alternative**: If the content is Markdown, use a Markdown renderer (react-markdown) instead of raw HTML.\n\n**OWASP Reference**: A07:2021 — Cross-Site Scripting',
      toolCalls: [
        { name: 'analyze_code', input: { type: 'security_scan' }, output: '{"vulnerabilities": ["xss"], "severity": "high", "owasp": "A07:2021"}', durationMs: 275 },
        { name: 'check_patterns', input: { pattern: 'xss_prevention' }, output: '{"remediation": "dompurify", "alternatives": ["react-markdown", "sanitize-html"]}', durationMs: 88 },
      ],
      tokensUsed: 3600, latencyMs: 2400, cost: 0.0072,
    },
    result: 'improvement',
  },
  // ── Data Pipeline Scenarios ──
  {
    id: 'eval-dp1', previewId: 'preview-datapipeline-1', name: 'Simple schema validation',
    category: 'Classification',
    input: 'Validate this incoming CSV schema: columns are [id, name, email, created_at]. Expected types: [integer, string, email, timestamp]. Check if the schema matches.',
    expectedBehavior: 'Should route to Mixtral (simple task) and validate schema correctly.',
    currentOutput: {
      response: 'Schema validation complete:\n\n| Column | Expected | Status |\n|--------|----------|--------|\n| id | integer | ✅ Valid |\n| name | string | ✅ Valid |\n| email | email | ✅ Valid |\n| created_at | timestamp | ✅ Valid |\n\nAll 4 columns match expected types. Schema is valid.',
      toolCalls: [
        { name: 'validate_schema', input: { format: 'csv' }, output: '{"valid": true, "columns": 4, "mismatches": 0}', durationMs: 200 },
      ],
      tokensUsed: 2500, latencyMs: 1400, cost: 0.0050,
    },
    previewOutput: {
      response: 'Schema validation complete:\n\n| Column | Expected | Status |\n|--------|----------|--------|\n| id | integer | ✅ Valid |\n| name | string | ✅ Valid |\n| email | email | ✅ Valid |\n| created_at | timestamp | ✅ Valid |\n\nAll 4 columns match expected types. Schema is valid.',
      toolCalls: [
        { name: 'validate_schema', input: { format: 'csv' }, output: '{"valid": true, "columns": 4, "mismatches": 0}', durationMs: 180 },
      ],
      tokensUsed: 1800, latencyMs: 600, cost: 0.0008,
    },
    result: 'pass',
  },
  {
    id: 'eval-dp2', previewId: 'preview-datapipeline-1', name: 'Complex ETL orchestration',
    category: 'Orchestration',
    input: 'Design an ETL pipeline: Extract from Snowflake (3 tables with joins), transform with deduplication and PII masking, load into Redshift with incremental updates. Handle failures gracefully.',
    expectedBehavior: 'Should route to GPT-4o (complex task) and provide comprehensive pipeline design.',
    currentOutput: {
      response: 'Here\'s the ETL pipeline design:\n\n**Extract**: Use Snowflake connector with parallel extraction from all 3 tables. Apply JOIN on extraction to reduce data movement.\n\n**Transform**:\n1. Deduplication via composite key (id + timestamp)\n2. PII masking: SHA-256 hash for emails, regex redaction for SSNs\n3. Data validation: null checks, type coercion\n\n**Load**: Incremental upsert to Redshift using MERGE statement with last_modified timestamp.\n\n**Error Handling**: Retry with exponential backoff (3 attempts), dead letter queue for failed records, alerting via PagerDuty.',
      toolCalls: [
        { name: 'design_pipeline', input: { complexity: 'high' }, output: '{"stages": 3, "estimated_runtime": "45min"}', durationMs: 450 },
        { name: 'check_connectors', input: { source: 'snowflake', target: 'redshift' }, output: '{"available": true, "version": "2.1"}', durationMs: 120 },
      ],
      tokensUsed: 3200, latencyMs: 1800, cost: 0.0064,
    },
    previewOutput: {
      response: 'Here\'s the ETL pipeline design:\n\n**Extract**: Use Snowflake connector with parallel extraction from all 3 tables. Apply JOIN on extraction to reduce data movement.\n\n**Transform**:\n1. Deduplication via composite key (id + timestamp)\n2. PII masking: SHA-256 hash for emails, regex redaction for SSNs\n3. Data validation: null checks, type coercion\n\n**Load**: Incremental upsert to Redshift using MERGE statement with last_modified timestamp.\n\n**Error Handling**: Retry with exponential backoff (3 attempts), dead letter queue for failed records, alerting via PagerDuty.\n\n**Estimated runtime**: 45 minutes for full refresh, 8 minutes for incremental.',
      toolCalls: [
        { name: 'design_pipeline', input: { complexity: 'high' }, output: '{"stages": 3, "estimated_runtime": "45min"}', durationMs: 420 },
        { name: 'check_connectors', input: { source: 'snowflake', target: 'redshift' }, output: '{"available": true, "version": "2.1"}', durationMs: 115 },
      ],
      tokensUsed: 3100, latencyMs: 1700, cost: 0.0062,
    },
    result: 'pass',
  },
];

// ── Config Diffs ──────────────────────────────────────────────────────────────

const CONFIG_DIFFS: ConfigDiff[] = [
  {
    previewId: 'preview-sales-1',
    sections: [
      {
        title: 'System Prompt',
        type: 'text_diff',
        current: `You are a sales qualification assistant for Vercel.
Your role is to help qualify inbound leads by understanding their needs.
Be friendly and conversational. Ask open-ended questions to learn about
the prospect's use case, team size, and technical requirements.
Guide them toward the appropriate Vercel plan based on their needs.
Always be helpful and informative, even if they're not a good fit.`,
        preview: `You are a sales qualification assistant for Vercel.
Your role is to efficiently qualify inbound leads using the BANT framework.
For each conversation, evaluate: Budget, Authority, Need, and Timeline.

QUALIFICATION RULES:
- Score each BANT dimension 0-25 (total max 100)
- Leads scoring 75+ → fast-track to enterprise demo
- Leads scoring 40-74 → nurture with appropriate resources
- Leads scoring <40 → direct to self-serve with helpful resources

Be direct but respectful. Don't spend multiple turns on low-priority leads.
Use the score_lead tool after identifying 2+ BANT signals.
Always match your language to the prospect's language.
For existing customers, identify upsell opportunities.`,
      },
    ],
  },
  {
    previewId: 'preview-hr-1',
    sections: [
      {
        title: 'Tools',
        type: 'json_diff',
        current: `{
  "tools": [
    {
      "name": "search_handbook",
      "description": "Search the employee handbook for policy information",
      "parameters": { "query": "string" }
    },
    {
      "name": "lookup_calendar",
      "description": "Check company calendar for events and holidays",
      "parameters": { "date_range": "string" }
    }
  ]
}`,
        preview: `{
  "tools": [
    {
      "name": "search_handbook",
      "description": "Search the employee handbook for policy information",
      "parameters": { "query": "string" }
    },
    {
      "name": "lookup_calendar",
      "description": "Check company calendar for events and holidays",
      "parameters": { "date_range": "string" }
    },
    {
      "name": "bamboohr_lookup",
      "description": "Look up employee data, org chart, and HR records from BambooHR",
      "parameters": { "query": "string", "employee": "string" }
    },
    {
      "name": "bamboohr_tasks",
      "description": "Get onboarding tasks and completion status from BambooHR",
      "parameters": { "employee": "string", "type": "string" }
    }
  ]
}`,
      },
      {
        title: 'Model',
        type: 'text_diff',
        current: 'gpt-4o',
        preview: 'claude-3.5-sonnet',
      },
    ],
  },
  {
    previewId: 'preview-support-1',
    sections: [
      {
        title: 'Guardrails',
        type: 'json_diff',
        current: `{
  "pii_redaction": {
    "enabled": true,
    "mode": "partial",
    "rules": [
      { "type": "email", "action": "mask", "pattern": "show first 1 char + domain" },
      { "type": "phone", "action": "mask", "pattern": "show last 4 digits" },
      { "type": "ssn", "action": "redact", "pattern": "full redaction" },
      { "type": "credit_card", "action": "redact", "pattern": "full redaction" }
    ],
    "scope": "logs_only"
  }
}`,
        preview: `{
  "pii_redaction": {
    "enabled": true,
    "mode": "aggressive",
    "rules": [
      { "type": "email", "action": "redact", "pattern": "full redaction" },
      { "type": "phone", "action": "redact", "pattern": "full redaction" },
      { "type": "ssn", "action": "redact", "pattern": "full redaction" },
      { "type": "credit_card", "action": "redact", "pattern": "full redaction" },
      { "type": "account_id", "action": "redact", "pattern": "full redaction" },
      { "type": "name", "action": "redact", "pattern": "full redaction" },
      { "type": "date", "action": "redact", "pattern": "full redaction" }
    ],
    "scope": "logs_and_responses"
  }
}`,
      },
    ],
  },
  {
    previewId: 'preview-codereview-1',
    sections: [
      {
        title: 'System Prompt',
        type: 'text_diff',
        current: `You are a code review agent. Review pull requests for:
1. Code quality and best practices
2. Performance issues
3. Security vulnerabilities
4. Test coverage

Provide constructive feedback with specific suggestions for improvement.
Reference relevant documentation when applicable.`,
        preview: `You are a code review agent. Review pull requests for:
1. Code quality and best practices
2. Performance issues
3. Security vulnerabilities (ENHANCED - see below)
4. Test coverage

SECURITY REVIEW PROTOCOL:
For every code change, specifically check for:
- SQL Injection: Look for string concatenation in queries, unsanitized inputs
- XSS: Check for dangerouslySetInnerHTML, unsanitized user content in JSX
- SSRF: Validate URL inputs, check for unvalidated redirects
- Auth bypass: Verify middleware checks, token validation
- Path traversal: Check file system operations with user input
- Insecure dependencies: Flag known vulnerable package versions

For each vulnerability found:
1. Assign severity (CRITICAL/HIGH/MEDIUM/LOW)
2. Cite the OWASP reference
3. Provide a specific code fix, not just a description
4. Suggest additional hardening measures

Provide constructive feedback with specific suggestions for improvement.
Reference relevant documentation when applicable.`,
      },
    ],
  },
  {
    previewId: 'preview-datapipeline-1',
    sections: [
      {
        title: 'Model Routing',
        type: 'json_diff',
        current: `{
  "routing": {
    "strategy": "single",
    "default_model": "gpt-4o",
    "rules": []
  }
}`,
        preview: `{
  "routing": {
    "strategy": "task_based",
    "default_model": "mixtral-8x7b",
    "rules": [
      {
        "condition": "task.complexity == 'high' || task.type == 'orchestration'",
        "model": "gpt-4o",
        "reason": "Complex reasoning and multi-step planning"
      },
      {
        "condition": "task.type == 'validation' || task.type == 'classification'",
        "model": "mixtral-8x7b",
        "reason": "Cost-efficient for structured tasks"
      },
      {
        "condition": "task.type == 'transformation' && task.complexity == 'low'",
        "model": "mixtral-8x7b",
        "reason": "Simple data transformations"
      }
    ],
    "fallback": "gpt-4o",
    "cost_target": "$0.002/interaction"
  }
}`,
      },
    ],
  },
];

// ── Export Functions ───────────────────────────────────────────────────────────

export function getAllAgents(): Agent[] {
  return AGENTS;
}

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find(a => a.id === id);
}

export function getAllPreviews(): AgentPreview[] {
  return PREVIEWS;
}

export function getPreviewById(id: string): AgentPreview | undefined {
  return PREVIEWS.find(p => p.id === id);
}

export function getEvalScenarios(previewId: string): EvalScenario[] {
  return EVAL_SCENARIOS.filter(e => e.previewId === previewId);
}

export function getConfigDiff(previewId: string): ConfigDiff | undefined {
  return CONFIG_DIFFS.find(d => d.previewId === previewId);
}

export function getPreviewsForAgent(agentId: string): AgentPreview[] {
  return PREVIEWS.filter(p => p.agentId === agentId);
}
