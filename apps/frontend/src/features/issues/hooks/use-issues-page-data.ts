'use client';

import { toast } from 'sonner';

import {
  useDeleteIssueMutation,
  useIssuesQuery,
  useProjectsQuery,
} from '@/features/issues/api/use-issues';
import { useCurrentUserQuery } from '@/features/shared/api/use-session';
import { useUsersQuery } from '@/features/users/api/use-users';
import type { GetIssuesParams } from '@/types/issue';
import { isElevatedUserRole } from '@/types/user';

export function useIssuesPageData(issueQuery: GetIssuesParams) {
  const issuesQuery = useIssuesQuery(issueQuery);
  const projectsQuery = useProjectsQuery();
  const currentUserQuery = useCurrentUserQuery();
  const usersQuery = useUsersQuery();
  const deleteIssueMutation = useDeleteIssueMutation();

  const issuesResponse = issuesQuery.data ?? null;
  const issues = issuesResponse?.items ?? [];
  const paginationMeta = issuesResponse?.meta ?? null;
  const projects = projectsQuery.data ?? [];
  const users = usersQuery.data ?? [];
  const currentUser = currentUserQuery.data ?? null;

  const loading =
    issuesQuery.isLoading ||
    projectsQuery.isLoading ||
    currentUserQuery.isLoading ||
    usersQuery.isLoading;

  const errorMessage =
    issuesQuery.error instanceof Error
      ? issuesQuery.error.message
      : projectsQuery.error instanceof Error
        ? projectsQuery.error.message
        : currentUserQuery.error instanceof Error
          ? currentUserQuery.error.message
          : null;

  const usersLoadError = usersQuery.error instanceof Error
    ? usersQuery.error.message
    : null;

  const canManageIssues = currentUser ? isElevatedUserRole(currentUser.role) : false;
  const canCreateIssue = canManageIssues && projects.length > 0 && users.length > 0;

  const createIssueUnavailableMessage = usersLoadError
    ? 'Issue creation is unavailable because assignable users could not be loaded for your account.'
    : currentUser && !canManageIssues
      ? 'Only admins and managers can create issues.'
      : 'Create at least one project and one user before creating issues.';

  async function handleIssueDelete(issueId: string) {
    const issueTitle = issues.find((issue) => issue.id === issueId)?.title;

    if (
      !window.confirm(
        'Delete this issue? All comments on this issue will also be deleted.',
      )
    ) {
      return;
    }

    try {
      await deleteIssueMutation.mutateAsync(issueId);

      toast.success('Issue deleted', {
        description: issueTitle
          ? `"${issueTitle}" and all of its comments were removed.`
          : 'The issue and all of its comments were removed.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete issue';

      toast.error('Issue deletion failed', {
        description: message,
      });
    }
  }

  return {
    canCreateIssue,
    canManageIssues,
    createIssueUnavailableMessage,
    currentUser,
    deleteIssueMutation,
    errorMessage,
    handleIssueDelete,
    issues,
    loading,
    paginationMeta,
    projects,
    users,
  };
}
