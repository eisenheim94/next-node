'use client';

import { Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: (projectId: string) => void | Promise<void>;
  project: Project;
}

export function ProjectCard({
  canDelete,
  isDeleting,
  onDelete,
  project,
}: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>
              Created {new Date(project.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>

          {canDelete ? (
            <Button
              type="button"
              variant="ghost"
              className="text-red-600 hover:bg-red-100 hover:text-red-600"
              size="sm"
              disabled={isDeleting}
              onClick={() => onDelete(project.id)}
            >
              <Trash2Icon />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs/relaxed text-muted-foreground">
          {project.description ?? 'No description yet.'}
        </p>
      </CardContent>
    </Card>
  );
}
