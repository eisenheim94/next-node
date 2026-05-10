'use client';

import { useQuery } from '@tanstack/react-query';

import { getNotifications } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

export function useNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: getNotifications,
  });
}
