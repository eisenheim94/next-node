'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { clearAuthSession } from '@/lib/auth';
import { deleteUser, getMe, getUsers } from '@/lib/api';
import { UserCard } from '@/components/entities/users/user-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AuthUser } from '@/types/auth';
import type { User } from '@/types/user';
import { isAdminUserRole } from '@/types/user';

export default function UsersPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const [usersData, currentUserData] = await Promise.all([
          getUsers(),
          getMe(),
        ]);

        setUsers(usersData);
        setCurrentUser(currentUserData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    }

    void loadUsers();
  }, []);

  const canDeleteUsers = currentUser ? isAdminUserRole(currentUser.role) : false;

  async function handleUserDelete(userId: string) {
    const isDeletingCurrentUser = currentUser?.id === userId;

    if (!window.confirm(
      isDeletingCurrentUser
        ? 'Delete your own account? You will be logged out immediately.'
        : 'Delete this user?',
    )) {
      return;
    }

    setDeletingUserId(userId);

    try {
      await deleteUser(userId);

      if (isDeletingCurrentUser) {
        clearAuthSession();
        router.replace('/login');
        return;
      }

      setUsers((current) => current.filter((user) => user.id !== userId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            Users
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse the list of users.
          </p>
        </section>

        {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load users</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {!loading && !error && users.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No users found</CardTitle>
              <CardDescription>
                Registered members will appear here once they sign up.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              canDelete={canDeleteUsers}
              isDeleting={deletingUserId === user.id}
              onDelete={(userId) => {
                void handleUserDelete(userId);
              }}
              user={user}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
