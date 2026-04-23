import Link from 'next/link';

export default function HomePage() {
  return (
    <main className='min-h-screen px-6 py-12 md:px-12'>
      <div className='mx-auto flex max-w-4xl flex-col gap-8'>
        <section className='rounded-3xl border bg-white/80 p-8 shadow-sm'>
          <p className='text-sm uppercase tracking-[0.3em] text-stone-500'>
            Phase 1
          </p>
          <h1 className='mt-4 text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl'>
            Issue Tracker Frontend
          </h1>
          <p className='mt-4 max-w-2xl text-lg leading-8 text-stone-700'>
            Start with the two core resources: projects and issues.
          </p>
        </section>

        <section className='grid gap-4 md:grid-cols-2'>
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
  );
}
