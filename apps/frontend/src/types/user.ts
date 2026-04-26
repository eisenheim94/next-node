export type UserRole = 'ADMIN' | 'MANAGER' | 'MEMBER';

export function isElevatedUserRole(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'MANAGER';
}

export function isAdminUserRole(role: UserRole): boolean {
  return role === 'ADMIN';
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  displayName: string;
  role: UserRole;
}
