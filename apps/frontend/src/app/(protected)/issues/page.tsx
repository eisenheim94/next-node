'use client';

import { useEffect, useState } from 'react';
import type { AuthUser } from '@/types/auth';

import {
  deleteIssue,
  getIssues,
  getMe,
  getProjects,
  getUsers,
} from '@/lib/api';
import { IssueCard } from '@/components/entities/issues/issue-card';
import { IssueCreateDialog } from '@/components/entities/issues/issue-create-dialog';
import { IssueFiltersCard } from '@/components/entities/issues/issue-filters-card';
import { IssuePagination } from '@/components/entities/issues/issue-pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type {
  GetIssuesParams,
  IssuePriority,
  IssueStatus,
  PaginatedIssues,
} from '@/types/issue';

import type { Project } from '@/types/project';
import { isElevatedUserRole, type User } from '@/types/user';

const ISSUE_STATUS_OPTIONS: IssueStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'];
const ISSUE_PRIORITY_OPTIONS: IssuePriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export default function IssuesPage() {
  const [issuesResponse, setIssuesResponse] = useState<PaginatedIssues | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [deletingIssueId, setDeletingIssueId] = useState<string | null>(null);
  const [usersLoadError, setUsersLoadError] = useState<string | null>(null);

  const [issueQuery, setIssueQuery] = useState<GetIssuesParams>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const [searchInput, setSearchInput] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [issuesData, projectsData, currentUserData] = await Promise.all([
        getIssues(issueQuery),
        getProjects(),
        getMe(),
      ]);

      setIssuesResponse(issuesData);
      setProjects(projectsData);
      setCurrentUser(currentUserData);
      setError(null);

      try {
        const usersData = await getUsers();
        setUsers(usersData);
        setUsersLoadError(null);
      } catch (err) {
        setUsers([]);
        setUsersLoadError(err instanceof Error ? err.message : 'Failed to load users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [issueQuery]);

  const issues = issuesResponse?.items ?? [];
  const paginationMeta = issuesResponse?.meta ?? null;
  const canManageIssues = currentUser ? isElevatedUserRole(currentUser.role) : false;
  const canCreateIssue = canManageIssues && projects.length > 0 && users.length > 0;
  const createIssueUnavailableMessage = usersLoadError
    ? 'Issue creation is unavailable because assignable users could not be loaded for your account.'
    : currentUser && !canManageIssues
      ? 'Only admins and managers can create issues.'
      : 'Create at least one project and one user before creating issues.';

  function goToPreviousPage() {
    setIssueQuery((current) => ({
      ...current,
      page: Math.max(1, (current.page ?? 1) - 1),
    }));
  }

  function goToNextPage() {
    if (!paginationMeta?.hasNextPage) {
      return;
    }

    setIssueQuery((current) => ({
      ...current,
      page: (current.page ?? 1) + 1,
    }));
  }

  function handleLimitChange(limit: number) {
    setIssueQuery((current) => ({
      ...current,
      page: 1,
      limit,
    }));
  }

  function handleStatusFilterChange(value: string) {
    const status = ISSUE_STATUS_OPTIONS.find((option) => option === value);

    setIssueQuery((current) => ({
      ...current,
      page: 1,
      status,
    }));
  }

  function handlePriorityFilterChange(value: string) {
    const priority = ISSUE_PRIORITY_OPTIONS.find((option) => option === value);

    setIssueQuery((current) => ({
      ...current,
      page: 1,
      priority,
    }));
  }

  function handleSortChange(value: string) {
    const [sortBy, sortOrder] = value.split(':');

    setIssueQuery((current) => ({
      ...current,
      page: 1,
      sortBy: sortBy as GetIssuesParams['sortBy'],
      sortOrder: sortOrder as GetIssuesParams['sortOrder'],
    }));
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIssueQuery((current) => ({
      ...current,
      page: 1,
      search: searchInput.trim() || undefined,
    }));
  }

  function clearSearch() {
    setSearchInput('');
    setIssueQuery((current) => ({
      ...current,
      page: 1,
      search: undefined,
    }));
  }

  async function handleIssueDelete(issueId: string) {
    if (!window.confirm('Delete this issue?')) {
      return;
    }

    setDeletingIssueId(issueId);

    try {
      await deleteIssue(issueId);
      setIssuesResponse((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          items: current.items.filter((issue) => issue.id !== issueId),
          meta: {
            ...current.meta,
            totalItems: Math.max(0, current.meta.totalItems - 1),
          },
        };
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete issue');
    } finally {
      setDeletingIssueId(null);
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-3xl font-semibold text-foreground">
              Issues
            </h1>
            <p className="text-sm text-muted-foreground">
              Create issues, filter the backlog, and discuss work without leaving the
              page.
            </p>
          </div>

          <IssueCreateDialog
            canCreateIssue={canCreateIssue}
            creationUnavailableMessage={createIssueUnavailableMessage}
            currentUser={currentUser}
            projects={projects}
            users={users}
            onCreated={() => {
              setLoading(true);
              void loadData();
            }}
          />
        </section>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load issues</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <IssueFiltersCard
          issueQuery={issueQuery}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onClearSearch={clearSearch}
          onPriorityFilterChange={handlePriorityFilterChange}
          onSearchSubmit={handleSearchSubmit}
          onSortChange={handleSortChange}
          onStatusFilterChange={handleStatusFilterChange}
        />

        {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}

        {!loading && issues.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No issues found</CardTitle>
              <CardDescription>
                Try adjusting the filters or create a new issue from the header action.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {paginationMeta ? (
          <IssuePagination
            limit={issueQuery.limit ?? 10}
            limitId="issue-limit"
            paginationMeta={paginationMeta}
            onLimitChange={handleLimitChange}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
          />
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              canDelete={canManageIssues}
              currentUser={currentUser}
              isDeleting={deletingIssueId === issue.id}
              issue={issue}
              onDelete={(issueId) => {
                void handleIssueDelete(issueId);
              }}
            />
          ))}
        </section>

        {paginationMeta ? (
          <IssuePagination
            className="border-t pt-4"
            limit={issueQuery.limit ?? 10}
            limitId="issue-limit-bottom"
            paginationMeta={paginationMeta}
            onLimitChange={handleLimitChange}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
          />
        ) : null}
      </div>
    </main>
  );
}
