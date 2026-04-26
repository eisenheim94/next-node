import type { IssuePriority, IssueSortBy, IssueStatus, SortOrder } from '@/types/issue';

export const ISSUE_STATUS_OPTIONS: IssueStatus[] = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'DONE',
];

export const ISSUE_PRIORITY_OPTIONS: IssuePriority[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
];

export const ISSUE_SORT_OPTIONS: Record<
  string,
  { sortBy: IssueSortBy; sortOrder: SortOrder }
> = {
  'createdAt:DESC': { sortBy: 'createdAt', sortOrder: 'DESC' },
  'createdAt:ASC': { sortBy: 'createdAt', sortOrder: 'ASC' },
  'updatedAt:DESC': { sortBy: 'updatedAt', sortOrder: 'DESC' },
  'title:ASC': { sortBy: 'title', sortOrder: 'ASC' },
  'priority:DESC': { sortBy: 'priority', sortOrder: 'DESC' },
  'status:ASC': { sortBy: 'status', sortOrder: 'ASC' },
};
