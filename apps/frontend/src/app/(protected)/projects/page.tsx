'use client';

import { toast } from 'sonner';

import {
  useDeleteProjectMutation,
  useProjectsQuery,
} from '@/features/projects/api/use-projects';
import { useCurrentUserQuery } from '@/features/shared/api/use-session';

import { ProjectCard } from '@/components/entities/projects/project-card';
import { ProjectCreateDialog } from '@/components/entities/projects/project-create-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isElevatedUserRole } from '@/types/user';

export default function ProjectsPage() {
  const projectsQuery = useProjectsQuery();
  const currentUserQuery = useCurrentUserQuery();
  const deleteProjectMutation = useDeleteProjectMutation();

  const projects = projectsQuery.data ?? [];
  const currentUser = currentUserQuery.data ?? null;

  const errorMessage =
    projectsQuery.error instanceof Error
      ? projectsQuery.error.message
      : currentUserQuery.error instanceof Error
        ? currentUserQuery.error.message
        : null;

  const loading = projectsQuery.isLoading || currentUserQuery.isLoading;

  const canManageProjects = currentUser ? isElevatedUserRole(currentUser.role) : false;
  const projectCreationUnavailableMessage = currentUser && !canManageProjects
    ? 'Only admins and managers can create projects.'
    : 'Project creation is temporarily unavailable.';

  async function handleProjectDelete(projectId: string) {
    const projectName = projects.find((project) => project.id === projectId)?.name;

    if (
      !window.confirm(
        'Delete this project? All related issues and comments will be deleted too.',
      )
    ) {
      return;
    }

    try {
      await deleteProjectMutation.mutateAsync(projectId);

      toast.success('Project deleted', {
        description: projectName
          ? `"${projectName}" and its related issues/comments were removed.`
          : 'The project and its related issues/comments were removed.',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete project';

      toast.error('Project deletion failed', {
        description: message,
      });
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-3xl font-semibold text-foreground">
              Projects
            </h1>
            <p className="text-sm text-muted-foreground">
              Track the active project spaces your team is working inside.
            </p>
          </div>

          <ProjectCreateDialog
            canCreateProject={canManageProjects}
            creationUnavailableMessage={projectCreationUnavailableMessage}
          />
        </section>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load projects</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}

        {!loading && projects.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
              <CardDescription>
                Start by creating your first project from the button above.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              canDelete={canManageProjects}
              isDeleting={deleteProjectMutation.isPending && deleteProjectMutation.variables === project.id}
              onDelete={handleProjectDelete}
              project={project}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
