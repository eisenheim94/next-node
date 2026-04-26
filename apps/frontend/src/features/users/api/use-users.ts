'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { deleteUser, getUsers } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

export function useUsersQuery() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: getUsers,
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });
    },
  });
}
