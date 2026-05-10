import type { User } from '@/types/user';

export interface Comment {
  id: string;
  body: string;
  issueId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  body: string;
  issueId: string;
  authorId: string;
}
