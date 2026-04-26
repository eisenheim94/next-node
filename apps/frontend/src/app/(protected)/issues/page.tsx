'use client';

import {
  selectIssuesFilterState,
  selectIssuesQueryParams,
  setLimit,
  setPage,
} from '@/store/features/issues/issues-filters-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useIssuesPageData } from '@/features/issues/hooks/use-issues-page-data';
import { IssueCard } from '@/components/entities/issues/issue-card';
import { IssueCreateDialog } from '@/components/entities/issues/issue-create-dialog';
import { IssueFiltersCard } from '@/components/entities/issues/issue-filters-card';
import { IssuePagination } from '@/components/entities/issues/issue-pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
export default function IssuesPage() {
  const dispatch = useAppDispatch();
  const issueQuery = useAppSelector(selectIssuesQueryParams);
  const issueFilters = useAppSelector(selectIssuesFilterState);

  const {
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
  } = useIssuesPageData(issueQuery);

  function goToPreviousPage() {
    dispatch(setPage(Math.max(1, issueFilters.page - 1)));
  }

  function handleNextPage() {
    if (!paginationMeta?.hasNextPage) {
      return;
    }

    dispatch(setPage(issueFilters.page + 1));
  }

  function handleLimitChange(limit: number) {
    dispatch(setLimit(limit));
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
          />
        </section>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load issues</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <IssueFiltersCard />

        {paginationMeta && (
          <IssuePagination
            paginationMeta={paginationMeta}
            limit={issueFilters.limit}
            limitId="issues-pagination-top"
            onLimitChange={handleLimitChange}
            onNextPage={handleNextPage}
            onPreviousPage={goToPreviousPage}
          />
        )}

        {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}

        {!loading && issues.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No issues found</CardTitle>
              <CardDescription>
                Adjust your filters or create a new issue to get started.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              canDelete={canManageIssues}
              currentUser={currentUser}
              isDeleting={
                deleteIssueMutation.isPending &&
                deleteIssueMutation.variables === issue.id
              }
              issue={issue}
              onDelete={handleIssueDelete}
            />
          ))}
        </section>

        {paginationMeta && (
          <IssuePagination
            paginationMeta={paginationMeta}
            limit={issueFilters.limit}
            limitId="issues-pagination-bottom"
            onLimitChange={handleLimitChange}
            onNextPage={handleNextPage}
            onPreviousPage={goToPreviousPage}
          />
        )}
      </div>
    </main>
  );
}
