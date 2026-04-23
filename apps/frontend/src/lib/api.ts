import type { CreateIssueInput, Issue } from '@/types/issue';
import type { CreateProjectInput, Project } from '@/types/project';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/projects`, {
    cache: 'no-store',
  });

  return handleResponse<Project[]>(response);
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<Project>(response);
}

export async function getIssues(): Promise<Issue[]> {
  const response = await fetch(`${API_URL}/issues`, {
    cache: 'no-store',
  });

  return handleResponse<Issue[]>(response);
}

export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  const response = await fetch(`${API_URL}/issues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<Issue>(response);
}
