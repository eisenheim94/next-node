import type { Metadata } from 'next';

import './globals.css';
import { JetBrains_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

export const metadata: Metadata = {
  title: 'Issue Tracker Learning Project',
  description: 'Next.js + NestJS learning workspace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('font-mono', jetbrainsMono.variable)}>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" closeButton />
      </body>
    </html>
  );
}
