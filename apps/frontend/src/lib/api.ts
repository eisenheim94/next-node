import { clearAuthSession, getAccessToken, getRefreshToken, saveAuthSession } from '@/lib/auth';
import type { AuthResponse, LoginInput, RegisterInput } from '@/types/auth';
import type { CreateIssueInput, Issue } from '@/types/issue';
import type { CreateProjectInput, Project } from '@/types/project';
import type { User } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAuthSession();
    return null;
  }

  const data = await handleResponse<AuthResponse>(response);
  saveAuthSession(data.user, data.tokens);

  return data.tokens.accessToken;
}

async function authenticatedFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  let accessToken = getAccessToken();

  const makeRequest = (token: string | null) =>
    fetch(input, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let response = await makeRequest(accessToken);

  if (response.status !== 401) {
    return response;
  }

  accessToken = await refreshAccessToken();

  if (!accessToken) {
    return response;
  }

  response = await makeRequest(accessToken);
  return response;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<AuthResponse>(response);
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<AuthResponse>(response);
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthSession();
    return;
  }

  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAuthSession();
    throw new Error(`Request failed with status ${response.status}`);
  }

  clearAuthSession();
}

export async function getMe(): Promise<AuthResponse['user']> {
  const response = await authenticatedFetch(`${API_URL}/auth/me`, {
    cache: 'no-store',
  });

  return handleResponse<AuthResponse['user']>(response);
}

export async function getUsers(): Promise<User[]> {
  const response = await authenticatedFetch(`${API_URL}/users`, {
    cache: 'no-store',
  });

  return handleResponse<User[]>(response);
}

export async function getProjects(): Promise<Project[]> {
  const response = await authenticatedFetch(`${API_URL}/projects`, {
    cache: 'no-store',
  });

  return handleResponse<Project[]>(response);
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const response = await authenticatedFetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<Project>(response);
}

export async function getIssues(): Promise<Issue[]> {
  const response = await authenticatedFetch(`${API_URL}/issues`, {
    cache: 'no-store',
  });

  return handleResponse<Issue[]>(response);
}

export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  const response = await authenticatedFetch(`${API_URL}/issues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<Issue>(response);
}
