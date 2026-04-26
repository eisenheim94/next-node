'use client';

import { useQuery } from '@tanstack/react-query';

import { getMe, getUsers } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getMe,
  });
}

export function useUsersQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: getUsers,
    enabled,
  });
}
