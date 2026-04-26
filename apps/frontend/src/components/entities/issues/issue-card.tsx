'use client';

import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';

import {
  CalendarDotsIcon,
  ChatCircleDotsIcon,
  EyeIcon,
} from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { AuthUser } from '@/types/auth';
import type { Issue } from '@/types/issue';
import { IssuePriorityBadge } from './issue-priority-badge';
import { IssueDetailsDialog } from './issue-details-dialog';
import { IssueStatusBadge } from './issue-status-badge';

interface IssueCardProps {
  canDelete: boolean;
  currentUser: AuthUser | null;
  isDeleting: boolean;
  issue: Issue;
  onDelete: (issueId: string) => void;
}

export function IssueCard({
  canDelete,
  currentUser,
  isDeleting,
  issue,
  onDelete,
}: IssueCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(issue.commentCount);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>{issue.title}</CardTitle>
            <CardDescription>{issue.project.name}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <IssueStatusBadge status={issue.status} />
            <IssuePriorityBadge priority={issue.priority} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-xs/relaxed text-muted-foreground">
          {issue.description ?? 'No description provided.'}
        </p>

        <div className="mt-auto flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
            <p>Reporter: {issue.reporter.displayName}</p>
            <p>Assignee: {issue.assignee?.displayName ?? 'Unassigned'}</p>
            <p className="flex items-center gap-2">
              <CalendarDotsIcon />
              Updated {new Date(issue.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ChatCircleDotsIcon />
              <span>{commentCount} comments</span>
            </div>

            <div className="flex items-center gap-2">
              {canDelete ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-100 hover:text-red-600"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => {
                    void onDelete(issue.id);
                  }}
                >
                  <Trash2Icon />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              ) : null}

              <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                  setIsOpen(open);
                }}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <EyeIcon data-icon="inline-start" />
                    View details
                  </Button>
                </DialogTrigger>

                <IssueDetailsDialog
                  currentUser={currentUser}
                  isOpen={isOpen}
                  issue={issue}
                  onCommentCountChange={setCommentCount}
                />
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
