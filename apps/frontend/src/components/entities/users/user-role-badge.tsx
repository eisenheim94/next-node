'use client';

import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types/user';

interface UserRoleBadgeProps {
  role: UserRole;
}

function getRoleVariant(role: UserRole) {
  switch (role) {
    case 'ADMIN':
      return 'default' as const;
    case 'MANAGER':
      return 'outline' as const;
    default:
      return 'secondary' as const;
  }
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  return <Badge variant={getRoleVariant(role)}>{role}</Badge>;
}
