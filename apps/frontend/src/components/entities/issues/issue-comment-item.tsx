'use client';

import type { Comment } from '@/types/comment';

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
});

function parseApiDate(value: string) {
  const hasExplicitTimezone = /[zZ]$|[+-]\d{2}:\d{2}$/.test(value);
  return new Date(hasExplicitTimezone ? value : `${value}Z`);
}

function formatCommentTimestamp(createdAt: string) {
  const createdAtDate = parseApiDate(createdAt);
  const fullTimestamp = createdAtDate.toLocaleString();
  const millisecondsSinceComment = Date.now() - createdAtDate.getTime();
  const hoursSinceComment = millisecondsSinceComment / (1000 * 60 * 60);

  if (hoursSinceComment >= 24) {
    return {
      fullTimestamp,
      label: fullTimestamp,
    };
  }

  if (hoursSinceComment < 1) {
    const minutesSinceComment = Math.max(
      1,
      Math.round(millisecondsSinceComment / (1000 * 60)),
    );

    return {
      fullTimestamp,
      label: relativeTimeFormatter.format(-minutesSinceComment, 'minute'),
    };
  }

  const roundedHoursSinceComment = Math.max(1, Math.round(hoursSinceComment));

  return {
    fullTimestamp,
    label: relativeTimeFormatter.format(-roundedHoursSinceComment, 'hour'),
  };
}

interface IssueCommentItemProps {
  comment: Comment;
}

export function IssueCommentItem({ comment }: IssueCommentItemProps) {
  const timestamp = formatCommentTimestamp(comment.createdAt);

  return (
    <div className="border p-3">
      <p className="text-xs/relaxed">{comment.body}</p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase text-muted-foreground">
        <p>{comment.author.displayName}</p>
        <p title={timestamp.fullTimestamp}>{timestamp.label}</p>
      </div>
    </div>
  );
}
