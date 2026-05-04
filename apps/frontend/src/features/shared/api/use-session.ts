'use client';

import { useQuery } from '@tanstack/react-query';

import { getMe } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getMe,
  });
}
