import { IssuePriority, IssueStatus } from 'src/core/types';

import { IssueEventPattern } from '../rabbitmq.constants';

interface BaseIssueEventPayload {
  issueId: string;
  title: string;
  projectId: string;
  reporterId: string;
  assigneeId: string | null;
  priority: IssuePriority;
}

export interface IssueCreatedEventPayload extends BaseIssueEventPayload {
  status: IssueStatus;
}

export interface IssueStatusChangedEventPayload extends BaseIssueEventPayload {
  previousStatus: IssueStatus;
  currentStatus: IssueStatus;
}

export interface DomainEvent<TPattern extends IssueEventPattern, TPayload> {
  eventId: string;
  pattern: TPattern;
  occurredAt: string;
  payload: TPayload;
}

export type IssueCreatedEvent = DomainEvent<
  IssueEventPattern.ISSUE_CREATED,
  IssueCreatedEventPayload
>;

export type IssueStatusChangedEvent = DomainEvent<
  IssueEventPattern.ISSUE_STATUS_CHANGED,
  IssueStatusChangedEventPayload
>;

export type IssueDomainEvent = IssueCreatedEvent | IssueStatusChangedEvent;
