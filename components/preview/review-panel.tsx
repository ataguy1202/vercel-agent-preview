'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { AgentPreview, Comment, ReviewDecision } from '@/lib/types';

export function ReviewPanel({ preview }: { preview: AgentPreview }) {
  const [comments, setComments] = useState<Comment[]>(preview.comments);
  const [newComment, setNewComment] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c-new-${Date.now()}`,
      author: { name: 'You', avatar: 'YO', role: 'Product Manager' },
      content: newComment,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, comment]);
    setNewComment('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeploy = () => {
    setDeployed(true);
    setTimeout(() => setDeployed(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Approval section */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-text-tertiary mb-4 font-medium">Review Status</h3>
        <div className="space-y-3">
          {preview.reviewers.map((reviewer) => (
            <div key={reviewer.member.name} className="flex items-center gap-3">
              <Avatar name={reviewer.member.name} initials={reviewer.member.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-text-primary truncate block">{reviewer.member.name}</span>
                <span className="text-[10px] text-text-tertiary">{reviewer.member.role}</span>
              </div>
              <DecisionBadge decision={reviewer.decision} />
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2.5">
        <Button
          variant="primary"
          className="w-full"
          onClick={handleDeploy}
          disabled={deployed}
        >
          {deployed ? '✓ Deployed to Production' : 'Approve & Deploy'}
        </Button>
        <Button variant="secondary" className="w-full">
          Request Changes
        </Button>
      </div>

      {/* Comments */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-text-tertiary mb-4 font-medium">
          Comments ({comments.length})
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment, i) => (
            <motion.div
              key={comment.id}
              initial={comment.id.startsWith('c-new') ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5"
            >
              <Avatar name={comment.author.name} initials={comment.author.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-text-primary">{comment.author.name}</span>
                  <span className="text-[10px] text-text-tertiary">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{comment.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add comment */}
        <div className="mt-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-bg-200 border border-border-default rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:border-accent-blue transition-colors"
            rows={2}
          />
          <Button
            size="sm"
            variant="secondary"
            className="mt-1.5"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Comment
          </Button>
        </div>
      </div>

      {/* Activity log */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-text-tertiary mb-4 font-medium">Activity</h3>
        <div className="space-y-2.5">
          {getActivityLog(preview).map((activity, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-border-default mt-1.5 shrink-0" />
              <span className="text-[11px] text-text-tertiary leading-relaxed">{activity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-bg-200 border border-accent-blue/30 rounded-lg px-4 py-3 shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
              <span className="text-sm text-text-primary">Comment added</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deploy toast */}
      <AnimatePresence>
        {deployed && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-bg-200 border border-green-500/30 rounded-lg px-4 py-3 shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm text-text-primary">Agent deployed to production</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DecisionBadge({ decision }: { decision: ReviewDecision }) {
  switch (decision) {
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'changes_requested':
      return <Badge variant="error">Changes</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
  }
}

function getActivityLog(preview: AgentPreview): string[] {
  const logs: string[] = [];
  logs.push(`${preview.author.name} created this preview`);
  logs.push('Eval suite started running');
  if (preview.status !== 'running') {
    logs.push(`Eval suite completed (${preview.evalScore.preview}% pass rate)`);
  }
  preview.reviewers.forEach(r => {
    if (r.decision === 'approved') {
      logs.push(`${r.member.name} approved`);
    } else if (r.decision === 'changes_requested') {
      logs.push(`${r.member.name} requested changes`);
    }
  });
  return logs;
}
