'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { hasAuthSession } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  mode?: 'protected' | 'public';
}

export function AuthGuard({
  children,
  mode = 'protected',
}: AuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const letters = useMemo(() => 'tracker'.split(''), []);

  useEffect(() => {
    const isAuthenticated = hasAuthSession();

    if (mode === 'protected' && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (mode === 'public' && isAuthenticated) {
      router.replace('/');
      return;
    }

    setReady(true);
  }, [mode, router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex text-6xl font-bold tracking-tight text-stone-900 font-heading">
            {letters.map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.9,
                  delay: index * 0.08,
                  repeat: Infinity,
                  repeatDelay: 0.35,
                  ease: 'easeInOut',
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <div className="flex items-center text-sm text-stone-500">
            <span>Loading</span>

            <div className="flex w-6 justify-start">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={`dot-${dot}`}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.2,
                    delay: dot * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="display-block"
                >
                  .
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
