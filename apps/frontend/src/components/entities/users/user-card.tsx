'use client';

import { Trash2Icon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { User } from '@/types/user';
import { UserRoleBadge } from './user-role-badge';

interface UserCardProps {
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: (userId: string) => void | Promise<void>;
  user: User;
}

export function UserCard({
  canDelete,
  isDeleting,
  onDelete,
  user,
}: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback>
                {user.displayName
                  .split(' ')
                  .map((word) => word.slice(0, 1))
                  .slice(0, 2)
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <CardTitle>{user.displayName}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canDelete ? (
              <Button
                type="button"
                variant="ghost"
                className="text-red-600 hover:bg-red-100 hover:text-red-600"
                size="sm"
                disabled={isDeleting}
                onClick={() => onDelete(user.id)}
              >
                <Trash2Icon />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <UserRoleBadge role={user.role} />
        <p className="text-xs text-muted-foreground">
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
