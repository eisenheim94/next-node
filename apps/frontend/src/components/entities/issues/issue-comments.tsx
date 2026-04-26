'use client';

import { useEffect, useState } from 'react';

import { ChatCircleDotsIcon } from '@phosphor-icons/react';

import {
  useCommentsByIssueQuery,
  useCreateCommentMutation,
} from '@/features/issues/api/use-issues';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import type { AuthUser } from '@/types/auth';
import { IssueCommentItem } from './issue-comment-item';

interface IssueCommentsProps {
  currentUser: AuthUser | null;
  enabled: boolean;
  issueId: string;
  onCommentCountChange?: (count: number) => void;
}

export function IssueComments({
  currentUser,
  enabled,
  issueId,
  onCommentCountChange,
}: IssueCommentsProps) {
  const commentsQuery = useCommentsByIssueQuery(issueId, enabled);
  const createCommentMutation = useCreateCommentMutation(issueId);

  const [commentInput, setCommentInput] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);

  const comments = commentsQuery.data ?? [];

  useEffect(() => {
    onCommentCountChange?.(comments.length);
  }, [comments.length, onCommentCountChange]);

  useEffect(() => {
    if (!enabled) {
      setCommentError(null);
    }
  }, [enabled]);

  async function handleCommentSubmit() {
    const body = commentInput.trim();

    if (!body) {
      return;
    }

    if (!currentUser) {
      setCommentError('You must be signed in to comment');
      return;
    }

    setCommentError(null);

    try {
      await createCommentMutation.mutateAsync({
        body,
        issueId,
        authorId: currentUser.id,
      });

      setCommentInput('');
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Failed to create comment');
    }
  }

  return (
    <div className="flex flex-col gap-4 border-t pt-4">
      <div className="flex items-center gap-2">
        <ChatCircleDotsIcon className="text-muted-foreground" />
        <h3 className="text-xs font-medium">Comments</h3>
      </div>

      {commentError ? (
        <Alert variant="destructive">
          <AlertTitle>Comment error</AlertTitle>
          <AlertDescription>{commentError}</AlertDescription>
        </Alert>
      ) : null}

      {commentsQuery.error instanceof Error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load comments</AlertTitle>
          <AlertDescription>{commentsQuery.error.message}</AlertDescription>
        </Alert>
      ) : null}

      {currentUser ? (
        <div className="flex flex-col gap-2 border p-3">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Commenting as {currentUser.displayName}
          </p>
          <Textarea
            value={commentInput}
            onChange={(event) => setCommentInput(event.target.value)}
            placeholder="Add a comment"
            rows={3}
            disabled={commentsQuery.isLoading || createCommentMutation.isPending}
          />
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleCommentSubmit}
              disabled={
                !currentUser ||
                !commentInput.trim() ||
                commentsQuery.isLoading ||
                createCommentMutation.isPending
              }
            >
              {createCommentMutation.isPending ? <Spinner className="me-2" /> : null}
              Add comment
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {commentsQuery.isLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Spinner />
            <span>Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-muted-foreground">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <IssueCommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
