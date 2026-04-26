'use client';

import { useEffect, useState } from 'react';

import { ChatCircleDotsIcon } from '@phosphor-icons/react';

import { createComment, getCommentsByIssue } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import type { AuthUser } from '@/types/auth';
import type { Comment } from '@/types/comment';
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  useEffect(() => {
    if (!enabled || commentsLoaded) {
      return;
    }

    let isMounted = true;

    async function loadComments() {
      setIsCommentsLoading(true);
      setCommentError(null);

      try {
        const commentsData = await getCommentsByIssue(issueId);

        if (!isMounted) {
          return;
        }

        setComments(commentsData);
        setCommentsLoaded(true);
        onCommentCountChange?.(commentsData.length);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setCommentError(err instanceof Error ? err.message : 'Failed to load comments');
      } finally {
        if (isMounted) {
          setIsCommentsLoading(false);
        }
      }
    }

    void loadComments();

    return () => {
      isMounted = false;
    };
  }, [commentsLoaded, enabled, issueId, onCommentCountChange]);

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

    setIsCommentSubmitting(true);
    setCommentError(null);

    try {
      const newComment = await createComment({
        body,
        issueId,
        authorId: currentUser.id,
      });

      setComments((current) => {
        const nextComments = [newComment, ...current];
        onCommentCountChange?.(nextComments.length);
        return nextComments;
      });
      setCommentInput('');
      setCommentsLoaded(true);
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Failed to create comment');
    } finally {
      setIsCommentSubmitting(false);
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
            disabled={isCommentsLoading || isCommentSubmitting}
          />
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => {
                void handleCommentSubmit();
              }}
              disabled={
                !currentUser ||
                !commentInput.trim() ||
                isCommentsLoading ||
                isCommentSubmitting
              }
            >
              {isCommentSubmitting ? <Spinner className="me-2" /> : null}
              Add comment
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {isCommentsLoading ? (
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
