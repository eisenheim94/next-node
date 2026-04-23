'use client';

import { useEffect, useState } from 'react';

import { createProject, getProjects } from '@/lib/api';
import type { Project } from '@/types/project';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    void loadProjects();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newProject = await createProject({
        name,
        description: description.trim() ? description : undefined,
      });

      setProjects((current) => [newProject, ...current]);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className='min-h-screen px-6 py-12 md:px-12'>
      <div className='mx-auto max-w-5xl space-y-8'>
        <section className='rounded-3xl border bg-white p-8 shadow-sm'>
          <h1 className='text-3xl font-semibold text-stone-900'>Projects</h1>
          <p className='mt-2 text-stone-600'>
            Create projects and view the current list.
          </p>
        </section>

        <section className='rounded-3xl border bg-white p-8 shadow-sm'>
          <h2 className='text-2xl font-semibold text-stone-900'>
            Create project
          </h2>

          <form
            className='mt-6 space-y-4'
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
            <div>
              <label className='block text-sm font-medium text-stone-700'>
                Name
              </label>
              <input
                className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder='Website redesign'
                required
                maxLength={120}
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
                placeholder='Short project description'
                rows={4}
              />
            </div>

            <button
              type='submit'
              disabled={submitting}
              className='rounded-full bg-stone-900 px-5 py-3 text-white disabled:bg-stone-400'
            >
              {submitting ? 'Creating...' : 'Create project'}
            </button>
          </form>

          {error ? <p className='mt-4 text-sm text-red-600'>{error}</p> : null}
        </section>

        <section className='rounded-3xl border bg-white p-8 shadow-sm'>
          <h2 className='text-2xl font-semibold text-stone-900'>Project list</h2>

          {loading ? <p className='mt-4 text-stone-600'>Loading...</p> : null}

          {!loading && projects.length === 0 ? (
            <p className='mt-4 text-stone-600'>No projects yet.</p>
          ) : null}

          <div className='mt-6 space-y-4'>
            {projects.map((project) => (
              <article
                key={project.id}
                className='rounded-2xl border bg-stone-50 p-5'
              >
                <h3 className='text-lg font-medium text-stone-900'>
                  {project.name}
                </h3>
                <p className='mt-2 text-stone-600'>
                  {project.description ?? 'No description'}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
