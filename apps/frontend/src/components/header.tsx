'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { clearAuthSession, getStoredUser } from '@/lib/auth';
import { logout } from '@/lib/api';
import type { AuthUser } from '@/types/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Overview' },
  { href: '/projects', label: 'Projects' },
  { href: '/issues', label: 'Issues' },
  { href: '/users', label: 'Users' },
];

export function Header() {
  const pathname = usePathname();
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
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-heading font-bold">
            tracker
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-none px-3 py-2 text-xs transition-colors hover:bg-muted',
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar className="size-9 rounded-full">
                  <AvatarFallback>
                    {user.displayName
                      .split(' ')
                      .map((word) => word.slice(0, 1))
                      .slice(0, 2)
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>

              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  void handleLogout();
                }}
                disabled={loggingOut}
              >
                <LogOut />
                {loggingOut ? 'Logging out...' : 'Log out'}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
