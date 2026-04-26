'use client';

import { useRouter } from 'next/navigation';

import { clearAuthSession } from '@/lib/auth';
import { useCurrentUserQuery } from '@/features/shared/api/use-session';
import { useDeleteUserMutation, useUsersQuery } from '@/features/users/api/use-users';
import { UserCard } from '@/components/entities/users/user-card';
import { UserCardSkeleton } from '@/components/entities/users/user-card-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isAdminUserRole } from '@/types/user';

const USER_SKELETON_COUNT = 6;

export default function UsersPage() {
  const router = useRouter();

  const usersQuery = useUsersQuery();
  const currentUserQuery = useCurrentUserQuery();
  const deleteUserMutation = useDeleteUserMutation();

  const users = usersQuery.data ?? [];
  const currentUser = currentUserQuery.data ?? null;

  const loading = usersQuery.isLoading || currentUserQuery.isLoading;

  const errorMessage =
    usersQuery.error instanceof Error
      ? usersQuery.error.message
      : currentUserQuery.error instanceof Error
        ? currentUserQuery.error.message
        : null;

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

    try {
      await deleteUserMutation.mutateAsync(userId);

      if (isDeletingCurrentUser) {
        clearAuthSession();
        router.replace('/login');
      }
    } catch (err) {
      console.error(err);
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

        {loading ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: USER_SKELETON_COUNT }, (_, index) => (
              <UserCardSkeleton key={index} />
            ))}
          </section>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load users</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {!loading && !errorMessage && users.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No users found</CardTitle>
              <CardDescription>
                Registered members will appear here once they sign up.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {!loading ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <UserCard
                key={user.id}
                canDelete={canDeleteUsers}
                isDeleting={
                  deleteUserMutation.isPending &&
                  deleteUserMutation.variables === user.id
                }
                onDelete={handleUserDelete}
                user={user}
              />
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
