export interface Comment {
  id: string;
  body: string;
  issueId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  body: string;
  issueId: string;
  authorId: string;
}
