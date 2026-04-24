'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { hasAuthSession } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = ['/login', '/register'];

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isAuthenticated = hasAuthSession();
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!isAuthenticated && !isPublicPath) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated && isPublicPath) {
      router.replace('/');
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <main className='flex min-h-screen items-center justify-center px-6'>
        <p className='text-sm text-stone-600'>Checking session...</p>
      </main>
    );
  }

  return <>{children}</>;
}
