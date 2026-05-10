export const RABBITMQ_EXCHANGE = 'issue_tracker.events';
export const RABBITMQ_EXCHANGE_TYPE = 'topic';
export const ISSUE_AUDIT_QUEUE = 'issue_tracker.audit';
export const ISSUE_NOTIFICATION_QUEUE = 'issue_tracker.notifications';

export enum IssueEventPattern {
  ISSUE_CREATED = 'issue.created',
  ISSUE_STATUS_CHANGED = 'issue.status-changed',
}
