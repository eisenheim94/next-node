'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';

import { clearAuthSession, getStoredUser } from '@/lib/auth';
import { logout } from '@/lib/api';
import type { AuthUser } from '@/types/auth';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
    } catch {
      clearAuthSession();
    } finally {
      router.replace('/login');
    }
  }

  return (
    <AuthGuard>
      <main className='min-h-screen px-6 py-12 md:px-12'>
        <div className='mx-auto flex max-w-4xl flex-col gap-8'>
          <section className='rounded-3xl border bg-white/80 p-8 shadow-sm'>
            <p className='text-sm uppercase tracking-[0.3em] text-stone-500'>
              Phase 2
            </p>
            <div className='mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
              <div>
                <h1 className='text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl'>
                  Issue Tracker Frontend
                </h1>
                <p className='mt-4 max-w-2xl text-lg leading-8 text-stone-700'>
                  Authenticated workspace for projects, issues, and admin-only users.
                </p>
                {user ? (
                  <p className='mt-4 text-sm text-stone-500'>
                    Signed in as {user.displayName} ({user.role})
                  </p>
                ) : null}
              </div>

              <button
                type='button'
                onClick={() => {
                  void handleLogout();
                }}
                disabled={loggingOut}
                className='rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-900 disabled:opacity-50'
              >
                {loggingOut ? 'Logging out...' : 'Log out'}
              </button>
            </div>
          </section>

          <section className='grid gap-4 md:grid-cols-3'>
            <Link
              href='/users'
              className='rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5'
            >
              <h2 className='text-xl font-medium text-stone-900'>Users</h2>
              <p className='mt-2 text-stone-600'>
                Admin-only user management and lookup.
              </p>
            </Link>

            <Link
              href='/projects'
              className='rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5'
            >
              <h2 className='text-xl font-medium text-stone-900'>Projects</h2>
              <p className='mt-2 text-stone-600'>
                Create projects and view the current list.
              </p>
            </Link>

            <Link
              href='/issues'
              className='rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5'
            >
              <h2 className='text-xl font-medium text-stone-900'>Issues</h2>
              <p className='mt-2 text-stone-600'>
                Create issues and view the current list.
              </p>
            </Link>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
