'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createIssue,
  deleteIssue,
  getCommentsByIssue,
  getIssues,
  getProjects,
  createComment,
} from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { CreateCommentInput } from '@/types/comment';
import type { CreateIssueInput, GetIssuesParams } from '@/types/issue';

export function useIssuesQuery(params: GetIssuesParams) {
  return useQuery({
    queryKey: queryKeys.issues.list(params),
    queryFn: () => getIssues(params),
  });
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: getProjects,
  });
}

export function useCreateIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateIssueInput) => createIssue(input),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.issues.lists(),
      });
    },
  });
}

export function useDeleteIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: string) => deleteIssue(issueId),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.issues.lists(),
      });
    },
  });
}

export function useCommentsByIssueQuery(issueId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.comments.byIssue(issueId),
    queryFn: () => getCommentsByIssue(issueId),
    enabled,
  });
}

export function useCreateCommentMutation(issueId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCommentInput) => createComment(input),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byIssue(issueId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.issues.lists(),
      });
    },
  });
}
