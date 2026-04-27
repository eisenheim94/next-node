'use client';

import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { AuthUser } from '@/types/auth';
import type { Issue } from '@/types/issue';
import { IssueComments } from './issue-comments';
import { IssuePriorityBadge } from './issue-priority-badge';
import { IssueStatusBadge } from './issue-status-badge';

interface IssueDetailsDialogProps {
  currentUser: AuthUser | null;
  isOpen: boolean;
  issue: Issue;
  onCommentCountChange?: (count: number) => void;
}

export function IssueDetailsDialog({
  currentUser,
  isOpen,
  issue,
  onCommentCountChange,
}: IssueDetailsDialogProps) {
  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{issue.title}</DialogTitle>
      </DialogHeader>

      <DialogBody className="gap-6 pt-3">
        <div className="flex flex-wrap gap-2">
          <IssueStatusBadge status={issue.status} />
          <IssuePriorityBadge priority={issue.priority} />
        </div>

        <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-2">
          <p>Project: {issue.project.name}</p>
          <p>Reporter: {issue.reporter.displayName}</p>
          <p>Assignee: {issue.assignee?.displayName ?? 'Unassigned'}</p>
          <p>Updated: {new Date(issue.updatedAt).toLocaleDateString()}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Description
          </h3>
          <p className="text-xs/relaxed text-foreground">
            {issue.description ?? 'No description provided.'}
          </p>
        </div>

        <IssueComments
          currentUser={currentUser}
          enabled={isOpen}
          issueId={issue.id}
          onCommentCountChange={onCommentCountChange}
        />
      </DialogBody>
    </DialogContent>
  );
}
