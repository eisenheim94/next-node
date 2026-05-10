'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { clearAuthSession, getStoredUser } from '@/lib/auth';
import { logout } from '@/lib/api';
import type { AuthUser } from '@/types/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LogOut, Menu } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Overview' },
  { href: '/projects', label: 'Projects' },
  { href: '/issues', label: 'Issues' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/users', label: 'Users' },
];

interface HeaderNavLinksProps {
  pathname: string;
  onNavigate?: () => void;
  orientation?: 'desktop' | 'mobile';
}

function HeaderNavLinks({
  pathname,
  onNavigate,
  orientation = 'desktop',
}: HeaderNavLinksProps) {
  return NAV_ITEMS.map((item) => {
    const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

    const link = (
      <Link
        href={item.href}
        className={cn(
          'rounded-none text-xs transition-colors hover:bg-muted',
          orientation === 'desktop' ? 'px-3 py-2' : 'flex w-full px-3 py-3 text-left',
          isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
        )}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );

    if (orientation === 'mobile') {
      return (
        <DrawerClose asChild key={item.href}>
          {link}
        </DrawerClose>
      );
    }

    return <div key={item.href}>{link}</div>;
  });
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-heading font-bold">
              tracker
            </Link>
            <Separator
              orientation="vertical"
              className="hidden h-5 data-[orientation=vertical]:!self-center md:block"
            />
            <nav className="hidden items-center gap-1 md:flex">
              <HeaderNavLinks pathname={pathname} />
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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
                  variant="ghost"
                  className="hidden text-red-600 md:inline-flex"
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

            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DrawerTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  aria-expanded={mobileMenuOpen}
                >
                  <Menu />
                </Button>
              </DrawerTrigger>

              <DrawerContent className="md:hidden">
                <DrawerHeader className="border-b pb-4">
                  <DrawerTitle>Navigation</DrawerTitle>
                  <DrawerDescription>
                    Move between the protected sections of the tracker.
                  </DrawerDescription>
                </DrawerHeader>

                <nav className="flex flex-col gap-1 overflow-y-auto px-1">
                  <HeaderNavLinks
                    pathname={pathname}
                    onNavigate={() => setMobileMenuOpen(false)}
                    orientation="mobile"
                  />
                </nav>

                {user ? (
                  <div className="mt-2 flex items-center justify-between gap-3 border-t pt-4">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => {
                        void handleLogout();
                      }}
                      disabled={loggingOut}
                    >
                      <LogOut />
                      {loggingOut ? 'Logging out...' : 'Log out'}
                    </Button>
                  </div>
                ) : null}
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}
