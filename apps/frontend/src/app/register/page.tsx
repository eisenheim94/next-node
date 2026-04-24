'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { saveAuthSession } from '@/lib/auth';
import { register } from '@/lib/api';
import type { UserRole } from '@/types/user';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('MEMBER');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const data = await register({
        email,
        displayName,
        password,
        role,
      });

      saveAuthSession(data.user, data.tokens);
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className='min-h-screen px-6 py-12 md:px-12'>
      <div className='mx-auto max-w-xl'>
        <section className='rounded-3xl border bg-white p-8 shadow-sm'>
          <p className='text-sm uppercase tracking-[0.3em] text-stone-500'>
            Phase 2
          </p>
          <h1 className='mt-4 text-3xl font-semibold text-stone-900'>
            Register
          </h1>
          <p className='mt-2 text-stone-600'>
            Create an account and start using the protected app.
          </p>

          <form
            className='mt-8 space-y-4'
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
                placeholder='Alex Johnson'
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
                placeholder='alex@example.com'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-stone-700'>
                Password
              </label>
              <input
                type='password'
                className='mt-2 w-full rounded-2xl border bg-stone-50 px-4 py-3'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder='strong-password-123'
                minLength={8}
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
                <option value='MEMBER'>MEMBER</option>
                <option value='ADMIN'>ADMIN</option>
              </select>
            </div>

            <button
              type='submit'
              disabled={submitting}
              className='w-full rounded-full bg-stone-900 px-5 py-3 text-white disabled:bg-stone-400'
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {error ? <p className='mt-4 text-sm text-red-600'>{error}</p> : null}

          <p className='mt-6 text-sm text-stone-600'>
            Already have an account?{' '}
            <Link href='/login' className='font-medium text-stone-900 underline'>
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
