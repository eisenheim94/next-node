import type { ReactNode } from 'react';

import { AuthGuard } from '@/components/auth-guard';
import { Header } from '@/components/header';

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Header />
        {children}
      </div>
    </AuthGuard>
  );
}
