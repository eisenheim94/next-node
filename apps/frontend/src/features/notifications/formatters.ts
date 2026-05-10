import type { NotificationEventType } from '@/types/notification';

const NOTIFICATION_EVENT_LABELS: Record<NotificationEventType, string> = {
  'issue.created': 'Issue created',
  'issue.status-changed': 'Status changed',
};

export function formatNotificationEventType(
  eventType: NotificationEventType,
): string {
  return NOTIFICATION_EVENT_LABELS[eventType];
}
