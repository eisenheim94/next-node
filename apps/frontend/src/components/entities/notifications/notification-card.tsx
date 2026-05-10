'use client';

import { BellIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatNotificationEventType } from '@/features/notifications/formatters';
import type { Notification } from '@/types/notification';

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const createdAt = new Date(notification.createdAt).toLocaleString();
  const eventLabel = formatNotificationEventType(notification.eventType);
  const issueLabel = `${notification.issue.title} · ${notification.issue.status}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center border bg-muted">
              <BellIcon className="size-4" />
            </div>

            <div className="min-w-0 space-y-1">
              <CardTitle className="break-words">
                {notification.message}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {createdAt}
              </p>
            </div>
          </div>

          <Badge variant={notification.readAt ? 'outline' : 'secondary'}>
            {notification.readAt ? 'Read' : 'New'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-1 text-xs text-muted-foreground">
          <p>Event: {eventLabel}</p>
          <p>Issue: {issueLabel}</p>
          <p>Priority: {notification.issue.priority}</p>
        </div>
      </CardContent>
    </Card>
  );
}
