'use client';

import { motion } from 'motion/react';
import { getAllAgents } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';

export default function AgentsPage() {
  const agents = getAllAgents();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-text-primary">Agents</h1>
          <span className="text-xs bg-bg-300 text-text-secondary px-2 py-0.5 rounded-full">
            {agents.length}
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          All registered agents across your organization.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card interactive className="h-full !p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-text-primary mb-1.5">{agent.name}</h3>
                  <Badge variant="outline" className="text-[10px]">{agent.department}</Badge>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full mt-1 ${agent.status === 'active' ? 'bg-green-400' : 'bg-text-tertiary'}`} />
              </div>
              <p className="text-xs text-text-tertiary mb-4 leading-relaxed">{agent.description}</p>
              <div className="flex items-center justify-between text-[10px] text-text-tertiary pt-3 border-t border-border-subtle">
                <span className="font-mono">{agent.model}</span>
                <span>Deployed {formatRelativeTime(agent.lastDeployedAt)}</span>
              </div>
              {agent.pendingPreviews > 0 && (
                <div className="mt-3 pt-3 border-t border-border-subtle">
                  <Badge variant="warning" className="text-[10px]">
                    {agent.pendingPreviews} pending preview{agent.pendingPreviews > 1 ? 's' : ''}
                  </Badge>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
