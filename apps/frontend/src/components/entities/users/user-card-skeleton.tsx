'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UserCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />

            <div className="flex min-w-0 flex-col gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          <Skeleton className="h-7 w-20" />
        </div>
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
}
