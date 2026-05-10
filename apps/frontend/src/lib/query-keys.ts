import type { GetIssuesParams } from '@/types/issue';

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  users: {
    all: ['users'] as const,
  },
  projects: {
    all: ['projects'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
  },
  issues: {
    all: ['issues'] as const,
    lists: () => ['issues', 'list'] as const,
    list: (params: GetIssuesParams) =>
      ['issues', 'list', params] as const,
  },
  comments: {
    byIssue: (issueId: string) => ['comments', 'issue', issueId] as const,
  },
};
