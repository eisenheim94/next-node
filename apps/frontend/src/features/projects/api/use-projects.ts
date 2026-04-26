'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createProject,
  deleteProject,
  getProjects,
} from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { CreateProjectInput } from '@/types/project';

export function useProjectsQuery() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: getProjects,
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      });
    },
  });
}
