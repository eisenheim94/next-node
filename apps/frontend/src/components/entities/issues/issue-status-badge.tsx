'use client';

import { Badge } from '@/components/ui/badge';
import type { IssueStatus } from '@/types/issue';

interface IssueStatusBadgeProps {
  status: IssueStatus;
}

function getStatusVariant(status: IssueStatus) {
  switch (status) {
    case 'DONE':
      return 'default' as const;
    case 'IN_PROGRESS':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
}

export function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
}
