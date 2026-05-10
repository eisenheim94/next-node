import type { PaginatedResponse } from '@/types/api';
import type { Project } from '@/types/project';
import type { User } from '@/types/user';

export type IssueStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  project: Project;
  reporter: User;
  assignee: User | null;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  projectId: string;
  reporterId: string;
  assigneeId?: string;
}

export type IssueSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'title'
  | 'status'
  | 'priority';

export type SortOrder = 'ASC' | 'DESC';

export interface GetIssuesParams {
  page?: number;
  limit?: number;
  status?: IssueStatus;
  priority?: IssuePriority;
  projectId?: string;
  reporterId?: string;
  assigneeId?: string;
  search?: string;
  sortBy?: IssueSortBy;
  sortOrder?: SortOrder;
}

export type PaginatedIssues = PaginatedResponse<Issue>;
