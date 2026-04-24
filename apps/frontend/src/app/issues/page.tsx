'use client';

import { useEffect, useState } from 'react';

import { createIssue, getIssues, getProjects, getUsers } from '@/lib/api';
import type { Issue, IssuePriority, IssueStatus } from '@/types/issue';
import type { Project } from '@/types/project';
import type { User } from '@/types/user';

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('BACKLOG');
  const [priority, setPriority] = useState<IssuePriority>('MEDIUM');
  const [projectId, setProjectId] = useState('');
  const [reporterId, setReporterId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [issuesData, projectsData, usersData] = await Promise.all([
          getIssues(),
          getProjects(),
          getUsers(),
        ]);

        setIssues(issuesData);
        setProjects(projectsData);
        setUsers(usersData);

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
    }

    void loadData();
  }, []);

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

      setIssues((current) => [newIssue, ...current]);
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

  const canCreateIssue = projects.length > 0 && users.length > 0;

  return (
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

          {loading ? <p className='mt-4 text-stone-600'>Loading...</p> : null}

          {!loading && issues.length === 0 ? (
            <p className='mt-4 text-stone-600'>No issues yet.</p>
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
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
