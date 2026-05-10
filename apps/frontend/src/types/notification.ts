import type { IssuePriority, IssueStatus } from '@/types/issue';
import type { UserRole } from '@/types/user';

export type NotificationEventType = 'issue.created' | 'issue.status-changed';

export interface NotificationIssueSummary {
  id: string;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
}

export interface NotificationUserSummary {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface Notification {
  id: string;
  sourceEventId: string;
  eventType: NotificationEventType;
  issue: NotificationIssueSummary;
  recipient: NotificationUserSummary;
  message: string;
  readAt: string | null;
  createdAt: string;
}
