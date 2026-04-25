'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';

import {
  createComment,
  createIssue,
  getCommentsByIssue,
  getIssues,
  getProjects,
  getUsers,
} from '@/lib/api';

import type {
  GetIssuesParams,
  Issue,
  IssuePriority,
  IssueStatus,
  PaginatedIssues,
} from '@/types/issue';

import type { Comment } from '@/types/comment';

import type { Project } from '@/types/project';
import type { User } from '@/types/user';

export default function IssuesPage() {
  const [issuesResponse, setIssuesResponse] = useState<PaginatedIssues | null>(null);
  const [commentsByIssue, setCommentsByIssue] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('BACKLOG');
  const [priority, setPriority] = useState<IssuePriority>('MEDIUM');
  const [projectId, setProjectId] = useState('');
  const [reporterId, setReporterId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const [issueQuery, setIssueQuery] = useState<GetIssuesParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const [searchInput, setSearchInput] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [issuesData, projectsData, usersData] = await Promise.all([
        getIssues(issueQuery),
        getProjects(),
        getUsers(),
      ]);

      setIssuesResponse(issuesData);
      setProjects(projectsData);
      setUsers(usersData);

      const commentsEntries = await Promise.all(
        issuesData.items.map(async (issue) => [
          issue.id,
          await getCommentsByIssue(issue.id),
        ] as const),
      );

      setCommentsByIssue(Object.fromEntries(commentsEntries));


      const firstProject = projectsData?.[0];
      if (firstProject) {
        setProjectId(firstProject.id);
      }

      const firstUser = usersData?.[0];
      if (firstUser) {
        setReporterId(firstUser.id);
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newIssue = await createIssue({
        title,
        description: description.trim() ? description : undefined,
        status,
        priority,
        projectId,
        reporterId,
        assigneeId: assigneeId || undefined,
      });

      setIssuesResponse((current) => {
        if (!current) {
          return {
            items: [newIssue],
            meta: {
              page: 1,
              limit: 10,
              totalItems: 1,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          };
        }

        const nextItems = [newIssue, ...current.items];
        const totalItems = current.meta.totalItems + 1;
        const totalPages = Math.max(
          current.meta.totalPages,
          Math.ceil(totalItems / current.meta.limit),
        );

        return {
          items: nextItems.slice(0, current.meta.limit),
          meta: {
            ...current.meta,
            totalItems,
            totalPages,
            hasNextPage: current.meta.page < totalPages,
            hasPreviousPage: current.meta.page > 1,
          },
        };
      });

      setCommentsByIssue((current) => ({
        ...current,
        [newIssue.id]: [],
      }));

      setTitle('');
      setDescription('');
      setStatus('BACKLOG');
      setPriority('MEDIUM');
      setAssigneeId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create issue');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCommentSubmit(issueId: string, authorId: string) {
    const body = commentInputs[issueId]?.trim();

    if (!body) {
      return;
    }

    try {
      const newComment = await createComment({
        body,
        issueId,
        authorId,
      });

      setCommentsByIssue((current) => ({
        ...current,
        [issueId]: [...(current[issueId] ?? []), newComment],
      }));

      setCommentInputs((current) => ({
        ...current,
        [issueId]: '',
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
    }
  }

  const issues = issuesResponse?.items ?? [];
  const paginationMeta = issuesResponse?.meta ?? null;
  const canCreateIssue = projects.length > 0 && users.length > 0;

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
    setIssueQuery((current) => ({
      ...current,
      page: 1,
      status: value ? (value as IssueStatus) : undefined,
    }));
  }

  function handlePriorityFilterChange(value: string) {
    setIssueQuery((current) => ({
      ...current,
      page: 1,
      priority: value ? (value as IssuePriority) : undefined,
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

  return (
    <AuthGuard>
      <main className='min-h-screen px-6 py-12 md:px-12'>
        <div className='mx-auto max-w-5xl space-y-8'>
          <section className='rounded-3xl border bg-white p-8 shadow-sm'>
            <h1 className='text-3xl font-semibold text-stone-900'>Issues</h1>
            <p className='mt-2 text-stone-600'>
              Create issues and connect them to projects and users.
            </p>
          </section>

          <section className='rounded-3xl border bg-white p-8 shadow-sm'>
            <h2 className='text-2xl font-semibold text-stone-900'>Create issue</h2>

            {!canCreateIssue ? (
              <p className='mt-4 text-amber-700'>
                Create at least one project and one user before creating issues.
              </p>
            ) : null}

            <form
              className='mt-6 space-y-4'
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
            >
              <div>
                <label className='block text-sm font-medium text-stone-700'>
                  Title
                </label>
                <input
                  className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder='Fix broken dashboard filter'
                  required
                  maxLength={160}
                  disabled={!canCreateIssue}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-stone-700'>
                  Description
                </label>
                <textarea
                  className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  disabled={!canCreateIssue}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-stone-700'>
                  Status
                </label>
                <select
                  className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                  value={status}
                  onChange={(event) => setStatus(event.target.value as IssueStatus)}
                  disabled={!canCreateIssue}
                >
                  <option value='BACKLOG'>BACKLOG</option>
                  <option value='TODO'>TODO</option>
                  <option value='IN_PROGRESS'>IN_PROGRESS</option>
                  <option value='DONE'>DONE</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-stone-700'>
                  Priority
                </label>
                <select
                  className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as IssuePriority)
                  }
                  disabled={!canCreateIssue}
                >
                  <option value='LOW'>LOW</option>
                  <option value='MEDIUM'>MEDIUM</option>
                  <option value='HIGH'>HIGH</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-stone-700'>
                  Project
                </label>
                <select
                  className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                  disabled={!canCreateIssue}
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-stone-700'>
                  Reporter
                </label>
                <select
                  className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                  value={reporterId}
                  onChange={(event) => setReporterId(event.target.value)}
                  disabled={!canCreateIssue}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-stone-700'>
                  Assignee
                </label>
                <select
                  className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                  value={assigneeId}
                  onChange={(event) => setAssigneeId(event.target.value)}
                  disabled={!canCreateIssue}
                >
                  <option value=''>Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type='submit'
                disabled={submitting || !canCreateIssue}
                className='rounded-full bg-stone-900 px-5 py-3 text-white disabled:bg-stone-400'
              >
                {submitting ? 'Creating...' : 'Create issue'}
              </button>
            </form>

            {error ? <p className='mt-4 text-sm text-red-600'>{error}</p> : null}
          </section>

          <section className='rounded-3xl border bg-white p-8 shadow-sm'>
            <h2 className='text-2xl font-semibold text-stone-900'>Issue list</h2>
            {paginationMeta ? (
              <div className='mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <p className='text-sm text-stone-500'>
                  Page {paginationMeta.page} of {paginationMeta.totalPages || 1} ·
                  {` `}
                  {paginationMeta.totalItems} total issues
                </p>

                <div className='flex flex-wrap items-center gap-3'>
                  <label className='flex items-center gap-2 text-sm text-stone-600'>
                    <span>Per page</span>
                    <select
                      className='rounded-xl border bg-stone-50 px-3 py-2'
                      value={issueQuery.limit ?? 10}
                      onChange={(event) => {
                        handleLimitChange(Number(event.target.value));
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </label>

                  <button
                    type='button'
                    className='rounded-full border px-4 py-2 text-sm text-stone-700 disabled:opacity-50'
                    onClick={goToPreviousPage}
                    disabled={!paginationMeta.hasPreviousPage}
                  >
                    Previous
                  </button>

                  <button
                    type='button'
                    className='rounded-full border px-4 py-2 text-sm text-stone-700 disabled:opacity-50'
                    onClick={goToNextPage}
                    disabled={!paginationMeta.hasNextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}

            {loading ? <p className='mt-4 text-stone-600'>Loading...</p> : null}

            <form
              className='mt-6 grid gap-4 rounded-2xl border bg-stone-50 p-4 md:grid-cols-2 xl:grid-cols-5'
              onSubmit={(event) => {
                handleSearchSubmit(event);
              }}
            >
              <div className='xl:col-span-2'>
                <label className='block text-sm font-medium text-stone-700'>
                  Search
                </label>
                <input
                  className='mt-2 w-full rounded-2xl border bg-white px-4 py-3'
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder='Search title or description'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-stone-700'>
                  Status
                </label>
                <select
                  className='mt-2 w-full rounded-2xl border bg-white px-4 py-3'
                  value={issueQuery.status ?? ''}
                  onChange={(event) => {
                    handleStatusFilterChange(event.target.value);
                  }}
                >
                  <option value=''>All statuses</option>
                  <option value='BACKLOG'>BACKLOG</option>
                  <option value='TODO'>TODO</option>
                  <option value='IN_PROGRESS'>IN_PROGRESS</option>
                  <option value='DONE'>DONE</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-stone-700'>
                  Priority
                </label>
                <select
                  className='mt-2 w-full rounded-2xl border bg-white px-4 py-3'
                  value={issueQuery.priority ?? ''}
                  onChange={(event) => {
                    handlePriorityFilterChange(event.target.value);
                  }}
                >
                  <option value=''>All priorities</option>
                  <option value='LOW'>LOW</option>
                  <option value='MEDIUM'>MEDIUM</option>
                  <option value='HIGH'>HIGH</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-stone-700'>
                  Sort
                </label>
                <select
                  className='mt-2 w-full rounded-2xl border bg-white px-4 py-3'
                  value={`${issueQuery.sortBy ?? 'createdAt'}:${issueQuery.sortOrder ?? 'DESC'}`}
                  onChange={(event) => {
                    handleSortChange(event.target.value);
                  }}
                >
                  <option value='createdAt:DESC'>Newest first</option>
                  <option value='createdAt:ASC'>Oldest first</option>
                  <option value='updatedAt:DESC'>Recently updated</option>
                  <option value='title:ASC'>Title A-Z</option>
                  <option value='priority:DESC'>Priority high-low</option>
                  <option value='status:ASC'>Status A-Z</option>
                </select>
              </div>

              <div className='flex items-end gap-3 xl:col-span-5'>
                <button
                  type='submit'
                  className='rounded-full bg-stone-900 px-5 py-3 text-white'
                >
                  Apply search
                </button>

                <button
                  type='button'
                  className='rounded-full border px-5 py-3 text-stone-700'
                  onClick={clearSearch}
                >
                  Clear search
                </button>
              </div>
            </form>

            {!loading && issues.length === 0 ? (
              <p className='mt-4 text-stone-600'>
                No issues found for the current filters.
              </p>
            ) : null}

            {issueQuery.search || issueQuery.status || issueQuery.priority ? (
              <p className='mt-4 text-sm text-stone-500'>
                Active filters:
                {issueQuery.search ? ` search="${issueQuery.search}"` : ''}
                {issueQuery.status ? ` status=${issueQuery.status}` : ''}
                {issueQuery.priority ? ` priority=${issueQuery.priority}` : ''}
              </p>
            ) : null}

            <div className='mt-6 space-y-4'>
              {issues.map((issue) => (
                <article
                  key={issue.id}
                  className='rounded-2xl border bg-stone-50 p-5'
                >
                  <h3 className='text-lg font-medium text-stone-900'>
                    {issue.title}
                  </h3>
                  <p className='mt-2 text-stone-600'>
                    {issue.description ?? 'No description'}
                  </p>
                  <p className='mt-2 text-sm text-stone-500'>
                    Status: {issue.status}
                  </p>
                  <p className='text-sm text-stone-500'>
                    Priority: {issue.priority}
                  </p>
                  <p className='text-sm text-stone-500'>
                    Project ID: {issue.projectId}
                  </p>
                  <p className='text-sm text-stone-500'>
                    Reporter ID: {issue.reporterId}
                  </p>
                  <p className='text-sm text-stone-500'>
                    Assignee ID: {issue.assigneeId ?? 'Unassigned'}
                  </p>
                  <div className='mt-4 rounded-2xl border bg-white p-4'>
                    <h4 className='text-sm font-semibold text-stone-900'>
                      Comments
                    </h4>

                    <div className='mt-3 space-y-3'>
                      {(commentsByIssue[issue.id] ?? []).length === 0 ? (
                        <p className='text-sm text-stone-500'>No comments yet.</p>
                      ) : (
                        (commentsByIssue[issue.id] ?? []).map((comment) => (
                          <div
                            key={comment.id}
                            className='rounded-xl border bg-stone-50 px-3 py-2'
                          >
                            <p className='text-sm text-stone-800'>{comment.body}</p>
                            <p className='mt-1 text-xs text-stone-500'>
                              Author ID: {comment.authorId}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className='mt-4 space-y-2'>
                      <textarea
                        className='w-full rounded-2xl border bg-stone-50 px-4 py-3'
                        value={commentInputs[issue.id] ?? ''}
                        onChange={(event) =>
                          setCommentInputs((current) => ({
                            ...current,
                            [issue.id]: event.target.value,
                          }))
                        }
                        placeholder='Add a comment'
                        rows={3}
                      />
                      <button
                        type='button'
                        className='rounded-full bg-stone-900 px-4 py-2 text-sm text-white disabled:bg-stone-400'
                        onClick={() => handleCommentSubmit(issue.id, reporterId)}
                        disabled={!reporterId}
                      >
                        Add comment
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
