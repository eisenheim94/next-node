export type AppEnvironment = 'development' | 'test' | 'production';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export enum IssueStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface HealthResponse {
  status: 'ok';
  service: 'backend';
  timestamp: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
}
