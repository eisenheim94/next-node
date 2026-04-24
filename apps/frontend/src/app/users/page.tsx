'use client';

import { useEffect, useState } from 'react';

import { AuthGuard } from '@/components/auth-guard';
import { getUsers } from '@/lib/api';
import type { User } from '@/types/user';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <AuthGuard>
      <main className='min-h-screen px-6 py-12 md:px-12'>
        <div className='mx-auto max-w-5xl space-y-8'>
          <section className='rounded-3xl border bg-white p-8 shadow-sm'>
            <h1 className='text-3xl font-semibold text-stone-900'>Users</h1>
            <p className='mt-2 text-stone-600'>
              Admin-only user directory.
            </p>
          </section>

          <section className='rounded-3xl border bg-white p-8 shadow-sm'>
            <h2 className='text-2xl font-semibold text-stone-900'>User list</h2>

            {loading ? <p className='mt-4 text-stone-600'>Loading...</p> : null}

            {error ? <p className='mt-4 text-sm text-red-600'>{error}</p> : null}

            {!loading && !error && users.length === 0 ? (
              <p className='mt-4 text-stone-600'>No users found.</p>
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
    </AuthGuard>
  );
}
