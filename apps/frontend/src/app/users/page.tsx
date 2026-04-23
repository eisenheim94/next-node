'use client';

import { useEffect, useState } from 'react';

import { createUser, getUsers } from '@/lib/api';
import type { User, UserRole } from '@/types/user';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('MEMBER');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    }

    void loadUsers();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newUser = await createUser({
        email,
        displayName,
        role,
      });

      setUsers((current) => [newUser, ...current]);
      setEmail('');
      setDisplayName('');
      setRole('MEMBER');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className='min-h-screen px-6 py-12 md:px-12'>
      <div className='mx-auto max-w-5xl space-y-8'>
        <section className='rounded-3xl border bg-white p-8 shadow-sm'>
          <h1 className='text-3xl font-semibold text-stone-900'>Users</h1>
          <p className='mt-2 text-stone-600'>
            Create users to use as reporters and assignees for issues.
          </p>
        </section>

        <section className='rounded-3xl border bg-white p-8 shadow-sm'>
          <h2 className='text-2xl font-semibold text-stone-900'>Create user</h2>

          <form
            className='mt-6 space-y-4'
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
            <div>
              <label className='block text-sm font-medium text-stone-700'>
                Display name
              </label>
              <input
                className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder='Jane Doe'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-stone-700'>
                Email
              </label>
              <input
                type='email'
                className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder='jane@example.com'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-stone-700'>
                Role
              </label>
              <select
                className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
              >
                <option value='ADMIN'>ADMIN</option>
                <option value='MANAGER'>MANAGER</option>
                <option value='MEMBER'>MEMBER</option>
              </select>
            </div>

            <button
              type='submit'
              disabled={submitting}
              className='rounded-full bg-stone-900 px-5 py-3 text-white disabled:bg-stone-400'
            >
              {submitting ? 'Creating...' : 'Create user'}
            </button>
          </form>

          {error ? <p className='mt-4 text-sm text-red-600'>{error}</p> : null}
        </section>

        <section className='rounded-3xl border bg-white p-8 shadow-sm'>
          <h2 className='text-2xl font-semibold text-stone-900'>User list</h2>

          {loading ? <p className='mt-4 text-stone-600'>Loading...</p> : null}

          {!loading && users.length === 0 ? (
            <p className='mt-4 text-stone-600'>No users yet.</p>
          ) : null}

          <div className='mt-6 space-y-4'>
            {users.map((user) => (
              <article
                key={user.id}
                className='rounded-2xl border bg-stone-50 p-5'
              >
                <h3 className='text-lg font-medium text-stone-900'>
                  {user.displayName}
                </h3>
                <p className='mt-1 text-stone-600'>{user.email}</p>
                <p className='mt-2 text-sm text-stone-500'>Role: {user.role}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
