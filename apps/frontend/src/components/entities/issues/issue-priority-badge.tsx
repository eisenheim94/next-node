'use client';

import { Badge } from '@/components/ui/badge';
import type { IssuePriority } from '@/types/issue';

interface IssuePriorityBadgeProps {
  priority: IssuePriority;
}

function getPriorityVariant(priority: IssuePriority) {
  switch (priority) {
    case 'HIGH':
      return 'default' as const;
    case 'MEDIUM':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
}

export function IssuePriorityBadge({ priority }: IssuePriorityBadgeProps) {
  return <Badge variant={getPriorityVariant(priority)}>{priority}</Badge>;
}
