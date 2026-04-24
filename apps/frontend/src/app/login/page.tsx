'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { saveAuthSession } from '@/lib/auth';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const data = await login({
        email,
        password,
      });

      saveAuthSession(data.user, data.tokens);
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
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
            Log in
          </h1>
          <p className='mt-2 text-stone-600'>
            Sign in to access projects, issues, and protected routes.
          </p>

          <form
            className='mt-8 space-y-4'
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
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
                required
              />
            </div>

            <button
              type='submit'
              disabled={submitting}
              className='w-full rounded-full bg-stone-900 px-5 py-3 text-white disabled:bg-stone-400'
            >
              {submitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {error ? <p className='mt-4 text-sm text-red-600'>{error}</p> : null}

          <p className='mt-6 text-sm text-stone-600'>
            Need an account?{' '}
            <Link href='/register' className='font-medium text-stone-900 underline'>
              Register
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
