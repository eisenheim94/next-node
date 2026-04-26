'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-5 md:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Issue Tracker Frontend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-700">Authenticated workspace for projects, issues, and users.</p>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Link
            href="/users"
          >
            <Card className="transition hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle className="text-lg">
                  Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-700 mb-2">
                  Admin-only user management and lookup.
                </p>
                <Button className="w-full">View Users</Button>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/projects"
          >
            <Card className="transition hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle className="text-lg">
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-700 mb-2">
                  Create projects and view the current list.
                </p>
                <Button className="w-full">View Projects</Button>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/issues"
          >
            <Card className="transition hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle className="text-lg">
                  Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-700 mb-2">
                  Create issues and view the current list.
                </p>
                <Button className="w-full">View Issues</Button>
              </CardContent>
            </Card>
          </Link>
        </section>
      </div>
    </main>
  );
}
